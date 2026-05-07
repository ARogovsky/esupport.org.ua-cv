import { config } from 'dotenv'
config({ path: '.env.local' })
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText, tool, generateText, stepCountIs } from 'ai'
import { z } from 'zod'

console.log('='.repeat(80))
console.log('FULL CHAIN TEST - ASSEMBLED FROM EXTRACTED FUNCTIONS')
console.log('='.repeat(80))

// Import createEmbedding from model-router (needed for embedQuery)
import { createEmbedding } from './api/_shared/model-router.js'

// === func-diversifyByArticle.js ===
function diversifyByArticle(ranked) {
  const result = []
  const seenArticles = new Set()

  // Pass 1: first chunk from each distinct article (preserving rank order)
  for (const chunk of ranked) {
    const articleId = chunk.metadata?.article_id
    if (!seenArticles.has(articleId)) {
      seenArticles.add(articleId)
      result.push(chunk)
    }
  }

  // Pass 2: fill remaining slots with best remaining chunks (rank order)
  for (const chunk of ranked) {
    if (result.length >= 5) break
    if (!result.includes(chunk)) {
      result.push(chunk)
    }
  }

  return result
}

// === func-embedQuery.js ===
async function embedQuery(query) {
  const result = await createEmbedding(query)
  return {
    embedding: result.embedding,
    latencyMs: result.latencyMs,
    totalTokens: result.totalTokens,
  }
}

// === func-extractSources.js ===
function extractSources(chunks) {
  const seenArticles = new Set()
  const sources = []
  for (const c of chunks) {
    const meta = c.metadata || {}
    // One badge per article — keep the highest-ranked section (first occurrence)
    if (seenArticles.has(meta.article_id)) continue
    seenArticles.add(meta.article_id)
    sources.push({
      article_id: meta.article_id,
      section_id: meta.section_id,
      section_anchor: meta.section_anchor || '',
      page_path_en: meta.page_path_en || '',
      page_path_uk: meta.page_path_uk || '',
      article_slug_en: meta.article_slug_en || '',
      article_slug_uk: meta.article_slug_uk || '',
    })
  }
  return sources
}

// === func-formatChunksForContext.js ===
function formatChunksForContext(chunks) {
  return chunks.map((c, i) => {
    const meta = c.metadata || {}
    const source = meta.article_id ? `[From your article: ${meta.article_id}, section: ${meta.section_id}]` : ''
    return `--- Your content ${i + 1} ${source} ---\n${c.content}`
  }).join('\n\n')
}

// === func-rerankChunks.js ===
async function rerankChunks(query, chunks, anthropicClient) {
  if (chunks.length <= 3) return { chunks, latencyMs: 0, rerankedOrder: null, usage: null }

  const t0 = Date.now()
  try {
    const numbered = chunks.slice(0, 10).map((c, i) =>
      `[${i}] ${c.content.slice(0, 200)}`
    ).join('\n')

    const response = await anthropicClient.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: `Query: "${query}"\nRank these chunks by relevance. Return ONLY the top 5 IDs as comma-separated numbers (most relevant first):\n${numbered}`,
      }],
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const ids = text.match(/\d+/g)?.map(Number).filter(n => n < chunks.length) || []

    const ranked = ids.slice(0, 5).map(i => chunks[i])
    // Fill up to 5 if Haiku returned fewer
    while (ranked.length < 5 && ranked.length < chunks.length) {
      const next = chunks.find(c => !ranked.includes(c))
      if (next) ranked.push(next)
      else break
    }

    // Diversify: ensure each distinct article has at least one representative
    const diversified = diversifyByArticle(ranked)

    return {
      chunks: diversified, latencyMs: Date.now() - t0, rerankedOrder: ids.slice(0, 5),
      usage: { input_tokens: response.usage?.input_tokens || 0, output_tokens: response.usage?.output_tokens || 0 },
    }
  } catch {
    // Fallback: use original order with diversity
    const diversified = diversifyByArticle(chunks.slice(0, 5))
    return { chunks: diversified, latencyMs: Date.now() - t0, rerankedOrder: null, usage: null }
  }
}

// === func-searchDocuments.js ===
async function searchDocuments(queryText, queryEmbedding) {
  const t0 = Date.now()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2000) // 2s timeout (cold start can be slow)

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/hybrid_search`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_text: queryText,
          query_embedding: queryEmbedding,
          match_count: 10,
          semantic_weight: 0.7,
          keyword_weight: 0.3,
        }),
        signal: controller.signal,
      },
    )

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Supabase search failed: ${response.status}`)
    }

    const chunks = await response.json()
    return {
      chunks,
      latencyMs: Date.now() - t0,
    }
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      throw new Error('Supabase search timeout (>2s)')
    }
    throw err
  }
}

// === func-searchPortfolio.js ===
async function searchPortfolio(query, trace, anthropicClient) {
  const result = {
    chunks: null,
    sources: [],
    degraded: false,
    degradedReason: null,
    metrics: { embeddingMs: 0, retrievalMs: 0, rerankMs: 0 },
    usage: { embeddingTokens: 0, rerankInputTokens: 0, rerankOutputTokens: 0 },
  }

  // 1. Embed
  let embedding
  const embeddingGen = trace?.generation({ name: 'embedding', model: 'text-embedding-3-small', metadata: { query } })
  try {
    const embResult = await embedQuery(query)
    embedding = embResult.embedding
    result.metrics.embeddingMs = embResult.latencyMs
    result.usage.embeddingTokens = embResult.totalTokens
    embeddingGen?.end({
      usage: { input: embResult.totalTokens, output: 0 },
      metadata: { latencyMs: embResult.latencyMs },
    })
  } catch (err) {
    embeddingGen?.end({ metadata: { error: err.message } })
    result.degraded = true
    result.degradedReason = 'embedding_fail'
    return result
  }

  // 2. Retrieve
  const retrievalSpan = trace?.span({ name: 'retrieval', metadata: { query } })
  try {
    const searchResult = await searchDocuments(query, embedding)
    result.metrics.retrievalMs = searchResult.latencyMs
    retrievalSpan?.end({
      metadata: {
        chunksCount: searchResult.chunks.length,
        topSimilarity: searchResult.chunks[0]?.similarity || 0,
        latencyMs: searchResult.latencyMs,
      },
    })

    if (!searchResult.chunks.length) {
      result.degradedReason = 'no_match'
      return result
    }

    // Filter out low-similarity chunks before reranking
    const filteredChunks = searchResult.chunks.filter(c => (c.similarity || 0) >= 0.3)
    if (!filteredChunks.length) {
      result.degradedReason = 'no_match'
      return result
    }

    // 3. Re-rank
    const rerankGen = trace?.generation({ name: 'reranking', model: 'claude-haiku-4-5-20251001', metadata: { query } })
    const rerankResult = await rerankChunks(query, filteredChunks, anthropicClient)
    result.metrics.rerankMs = rerankResult.latencyMs
    if (rerankResult.usage) {
      result.usage.rerankInputTokens = rerankResult.usage.input_tokens
      result.usage.rerankOutputTokens = rerankResult.usage.output_tokens
    }
    rerankGen?.end({
      usage: {
        input: rerankResult.usage?.input_tokens || 0,
        output: rerankResult.usage?.output_tokens || 0,
      },
      metadata: {
        rerankedOrder: rerankResult.rerankedOrder,
        latencyMs: rerankResult.latencyMs,
      },
    })

    result.chunks = rerankResult.chunks
    result.sources = extractSources(rerankResult.chunks)
  } catch (err) {
    retrievalSpan?.end({ metadata: { error: err.message } })
    result.degraded = true
    result.degradedReason = err.message.includes('timeout') ? 'retrieval_timeout' : 'retrieval_fail'
  }

  return result
}


// ============================================================================
// MAIN TEST
// ============================================================================

async function main() {
  console.log('\n=== TEST: WITHOUT system prompt (reproducing bug) ===\n')
  
  const userMessage = 'Why should I hire Andrey?'
  
  // Convert to Vercel AI SDK format - INLINE like working test
  const zodSchema = z.object({
    query: z.string().describe('The search query'),
  })
  
  // Call streamText
  const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
    region: process.env.AWS_REGION || 'eu-central-1',
  })
  
  console.log('Calling streamText WITHOUT system prompt (like broken API)...\n')
  
  const result = streamText({
    model,
    messages: [{ role: 'user', content: userMessage }],
    // NO system prompt here - reproducing the bug!
    maxTokens: 800,
    tools: {
      search_portfolio: tool({
        description: 'Search your own published case studies for project details.',
        inputSchema: zodSchema,
        execute: async (args) => {
          console.log('\n🔧 TOOL EXECUTE')
          console.log('Args:', args)
          
          const query = args.query
          console.log('Query:', query)
          
          // Mock anthropicClient for reranking
          const mockClient = {
            messages: {
              create: async (params) => {
                // Use Haiku for reranking
                const model = bedrock('eu.anthropic.claude-haiku-4-5-20251001-v1:0', {
                  region: process.env.AWS_REGION || 'eu-central-1',
                })
                const result = await generateText({
                  model,
                  maxTokens: params.max_tokens,
                  messages: params.messages,
                })
                return {
                  content: [{ type: 'text', text: result.text }],
                  usage: {
                    input_tokens: result.usage?.promptTokens || 0,
                    output_tokens: result.usage?.completionTokens || 0,
                  },
                }
              },
            },
          }
          
          const ragResult = await searchPortfolio(query, null, mockClient)
          
          console.log('RAG Result:')
          console.log('  - Chunks:', ragResult.chunks?.length || 0)
          console.log('  - Degraded:', ragResult.degraded)
          console.log('  - Metrics:', ragResult.metrics)
          
          if (ragResult.chunks && ragResult.chunks.length > 0) {
            const context = formatChunksForContext(ragResult.chunks)
            console.log('  - Context length:', context.length, 'chars\n')
            return context
          }
          return 'No content found.'
        },
      }),
    },
    stopWhen: stepCountIs(5),
  })
  
  console.log('=== Streaming ===\n')
  
  let fullText = ''
  for await (const event of result.fullStream) {
    if (event.type === 'text-delta') {
      fullText += event.text
      process.stdout.write(event.text)
    }
  }
  
  console.log('\n\n=== Results ===')
  console.log('Text length:', fullText.length)
  
  const steps = await result.steps
  console.log('Steps:', steps?.length || 0)
  
  if (steps) {
    steps.forEach((step, i) => {
      console.log(`\nStep ${i}:`)
      if (step.toolCalls?.length > 0) {
        console.log('  Tool calls:', step.toolCalls.length)
        step.toolCalls.forEach(tc => {
          console.log('    -', tc.toolName)
        })
      }
      if (step.text) {
        console.log('  Text preview:', step.text.slice(0, 80))
      }
    })
  }
  
  const toolUsed = steps?.some(s => s.toolCalls && s.toolCalls.length > 0)
  console.log('\n✅ Tool used:', toolUsed)
  console.log('✅ Text generated:', fullText.length > 0)
  
  if (!toolUsed) {
    console.log('\n❌ FAILED: Tool not used')
    process.exit(1)
  }
  
  if (fullText.length === 0) {
    console.log('\n❌ FAILED: No text generated')
    process.exit(1)
  }
  
  console.log('\n✅ SUCCESS!')
}

main().catch(err => {
  console.error('\n❌ ERROR:', err.message)
  console.error(err.stack)
  process.exit(1)
})
