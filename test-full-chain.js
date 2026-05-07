import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// ============================================================================
// ШАГ 1: RAG - Embedding + Retrieval + Reranking (ПОЛНЫЙ КОД)
// ============================================================================

async function step1_searchPortfolio(query) {
  console.log('\n=== ШАГ 1: RAG Search ===')
  console.log('Query:', query)
  
  const t0 = Date.now()
  
  // 1.1 Create embedding
  console.log('\n1.1 Creating embedding...')
  const embeddingT0 = Date.now()
  
  const embeddingResponse = await fetch(
    `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-02-01`,
    {
      method: 'POST',
      headers: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: query }),
    }
  )
  
  if (!embeddingResponse.ok) {
    throw new Error(`Embedding failed: ${embeddingResponse.status}`)
  }
  
  const embeddingData = await embeddingResponse.json()
  const embedding = embeddingData.data[0].embedding
  const embeddingMs = Date.now() - embeddingT0
  const embeddingTokens = embeddingData.usage?.total_tokens || 0
  
  console.log(`✓ Embedding created: ${embedding.length} dims, ${embeddingMs}ms, ${embeddingTokens} tokens`)
  
  // 1.2 Vector search in Supabase
  console.log('\n1.2 Vector search in Supabase...')
  const retrievalT0 = Date.now()
  
  const supabaseResponse = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rpc/match_portfolio_chunks`,
    {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 10,
      }),
    }
  )
  
  if (!supabaseResponse.ok) {
    throw new Error(`Supabase search failed: ${supabaseResponse.status}`)
  }
  
  const chunks = await supabaseResponse.json()
  const retrievalMs = Date.now() - retrievalT0
  
  console.log(`✓ Retrieved ${chunks.length} chunks in ${retrievalMs}ms`)
  chunks.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.article_id} (similarity: ${c.similarity.toFixed(3)})`)
  })
  
  // 1.3 Rerank with Claude Haiku
  console.log('\n1.3 Reranking with Claude Haiku...')
  const rerankT0 = Date.now()
  
  const rerankPrompt = `Rate relevance of each chunk to query: "${query}"

${chunks.map((c, i) => `[${i}] ${c.content.slice(0, 200)}...`).join('\n\n')}

Respond ONLY with JSON array of indices sorted by relevance (most relevant first):
[0, 2, 1, ...]`
  
  const model = bedrock('eu.anthropic.claude-haiku-4-5-20251001-v1:0', {
    region: process.env.AWS_REGION || 'eu-central-1',
  })
  
  const { generateText } = await import('ai')
  
  const rerankResult = await generateText({
    model,
    maxTokens: 200,
    prompt: rerankPrompt,
  })
  
  const rerankMs = Date.now() - rerankT0
  const rerankInputTokens = rerankResult.usage?.promptTokens || 0
  const rerankOutputTokens = rerankResult.usage?.completionTokens || 0
  
  console.log(`✓ Reranked in ${rerankMs}ms (${rerankInputTokens} + ${rerankOutputTokens} tokens)`)
  
  // Parse rerank result
  const jsonMatch = rerankResult.text.match(/\[[\s\S]*?\]/)
  let rerankedChunks = chunks
  
  if (jsonMatch) {
    try {
      const indices = JSON.parse(jsonMatch[0])
      rerankedChunks = indices.slice(0, 4).map(i => chunks[i]).filter(Boolean)
      console.log(`✓ Reranked order: ${indices.slice(0, 4).join(', ')}`)
    } catch (e) {
      console.log('⚠ Rerank parse failed, using original order')
    }
  }
  
  // 1.4 Format context
  const context = rerankedChunks
    .map(c => `[Source: ${c.article_id}]\n${c.content}`)
    .join('\n\n---\n\n')
  
  console.log(`\n✓ Final context: ${context.length} chars from ${rerankedChunks.length} chunks`)
  
  const totalMs = Date.now() - t0
  console.log(`\n✓ Total RAG time: ${totalMs}ms`)
  
  return {
    context,
    chunks: rerankedChunks,
    metrics: {
      embeddingMs,
      retrievalMs,
      rerankMs,
      totalMs,
    },
    usage: {
      embeddingTokens,
      rerankInputTokens,
      rerankOutputTokens,
    },
  }
}

// ============================================================================
// ШАГ 2-5: Claude Client → Model Router → Vercel AI SDK (ПОЛНЫЙ КОД)
// ============================================================================

async function step2to5_streamWithRAG(userMessage) {
  console.log('\n=== ШАГ 2-5: Stream with RAG Tool ===')
  console.log('User message:', userMessage)
  
  // ШАГ 2: Prepare messages (как в api/chat.js)
  console.log('\n--- ШАГ 2: Prepare messages ---')
  
  const systemPrompt = `You are Andrey's portfolio chatbot. Use search_portfolio tool when asked about projects.`
  
  const messages = [
    {
      role: 'user',
      content: userMessage,
    },
  ]
  
  console.log('✓ Messages prepared:', messages.length)
  
  // ШАГ 3: Add execute to tool (как в claude-client.js)
  console.log('\n--- ШАГ 3: Add execute to tool ---')
  
  const PORTFOLIO_TOOL = {
    name: 'search_portfolio',
    description: 'Search your own published case studies for project details.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
      },
      required: ['query'],
    },
    // ADD EXECUTE HERE (как в claude-client.js)
    execute: async (args) => {
      console.log('\n🔧 Tool execute called')
      console.log('  Args received:', JSON.stringify(args, null, 2))
      const query = args.query
      console.log('  Query:', query)
      const ragResult = await step1_searchPortfolio(query)
      console.log('✓ Tool execute returned:', ragResult.context.length, 'chars')
      return ragResult.context
    },
  }
  
  console.log('✓ Tool with execute prepared')
  
  // ШАГ 4: Convert tool to Vercel format (как в model-router.js)
  console.log('\n--- ШАГ 4: Convert tool to Vercel format ---')
  
  const zodSchema = z.object({
    query: z.string().describe('The search query'),
  })
  
  const vercelTool = tool({
    description: PORTFOLIO_TOOL.description,
    inputSchema: zodSchema,  // ← ВАЖНО: inputSchema, не parameters
    execute: PORTFOLIO_TOOL.execute,
  })
  
  console.log('✓ Vercel tool created')
  
  // ШАГ 5: Call streamText (как в model-router.js)
  console.log('\n--- ШАГ 5: Call streamText ---')
  
  const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
    region: process.env.AWS_REGION || 'eu-central-1',
  })
  
  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    maxTokens: 800,
    tools: {
      search_portfolio: vercelTool,
    },
    maxSteps: 5,  // ← ВАЖНО: maxSteps для multi-step
  })
  
  console.log('✓ streamText called')
  
  // Stream response
  console.log('\n--- Streaming response ---\n')
  
  let fullText = ''
  for await (const textChunk of result.textStream) {
    fullText += textChunk
    process.stdout.write(textChunk)
  }
  
  console.log('\n\n--- Stream complete ---')
  console.log('Total text length:', fullText.length)
  
  // Check steps
  const steps = await result.steps
  console.log('Total steps:', steps?.length || 0)
  
  if (steps) {
    steps.forEach((step, i) => {
      console.log(`\nStep ${i}:`)
      if (step.toolCalls && step.toolCalls.length > 0) {
        step.toolCalls.forEach(tc => {
          console.log(`  - Tool: ${tc.toolName}`)
          console.log(`  - Args:`, tc.args)
        })
      }
      if (step.toolResults && step.toolResults.length > 0) {
        step.toolResults.forEach(tr => {
          console.log(`  - Result length:`, String(tr.result).length, 'chars')
        })
      }
      if (step.text) {
        console.log(`  - Text:`, step.text.slice(0, 100) + '...')
      }
    })
  }
  
  return { fullText, steps }
}

// ============================================================================
// MAIN TEST
// ============================================================================

async function main() {
  console.log('='.repeat(80))
  console.log('FULL CHAIN TEST: Reproducing api/chat.js flow')
  console.log('='.repeat(80))
  
  try {
    const result = await step2to5_streamWithRAG('Tell me about GALA project')
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ SUCCESS!')
    console.log('='.repeat(80))
    console.log('Text length:', result.fullText.length)
    console.log('Steps:', result.steps?.length || 0)
    
    // Check if tool was used
    const toolUsed = result.steps?.some(s => s.toolCalls && s.toolCalls.length > 0)
    console.log('Tool used:', toolUsed ? '✅ YES' : '❌ NO')
    
    if (!toolUsed) {
      console.log('\n❌ FAILED: Tool was not used!')
      process.exit(1)
    }
    
    if (result.fullText.length === 0) {
      console.log('\n❌ FAILED: No text generated!')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('\n' + '='.repeat(80))
    console.error('❌ ERROR:', error.message)
    console.error('='.repeat(80))
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

main()
