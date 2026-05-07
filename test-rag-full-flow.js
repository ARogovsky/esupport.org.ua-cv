import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// Import only what we need from rag.js
import { searchPortfolio, formatChunksForContext, PORTFOLIO_TOOL } from './api/_shared/rag.js'

async function test() {
  console.log('=== FULL RAG FLOW TEST WITH INLINE CODE ===\n')
  
  const query = 'Why should I hire Andrey?'
  console.log(`Query: "${query}"\n`)
  
  try {
    // =========================================================================
    // STEP 1: /api/chat.js - Create client and ragMetadata
    // =========================================================================
    console.log('--- STEP 1: /api/chat.js ---')
    console.log('Creating ragMetadata container...')
    
    const ragMetadata = {
      sources: [],
      degraded: false,
      degradedReason: null,
      metrics: {},
      usage: { embeddingTokens: 0, rerankInputTokens: 0, rerankOutputTokens: 0 },
    }
    console.log('✓ ragMetadata created:', ragMetadata)
    
    const messages = [{ role: 'user', content: query }]
    const systemBlocks = [
      { type: 'text', text: 'You are Andrey, a senior full-stack engineer.' }
    ]
    
    console.log('✓ Messages and system prepared\n')
    
    // =========================================================================
    // STEP 2: claude-client.js - Check for RAG tool and add execute
    // =========================================================================
    console.log('--- STEP 2: claude-client.js - stream() ---')
    
    const params = {
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemBlocks,
      messages,
      tools: [PORTFOLIO_TOOL],
      trace: null,
      client: null, // Would be claude client for reranking
      _ragMetadata: ragMetadata,
    }
    
    console.log('Checking for RAG tool...')
    const hasRAGTool = params.tools?.some(t => t.name === 'search_portfolio')
    console.log(`✓ Has RAG tool: ${hasRAGTool}`)
    
    if (hasRAGTool) {
      console.log('Adding execute function to search_portfolio tool...')
      
      // This is the code from claude-client.js createBedrockStreamWrapper
      params.tools = params.tools.map(toolDef => {
        if (toolDef.name === 'search_portfolio') {
          console.log('  - Found search_portfolio, adding execute...')
          return {
            ...toolDef,
            execute: async ({ query }) => {
              console.log(`  [EXECUTE] Tool called with query: "${query}"`)
              
              const trace = params.trace || null
              const client = params.client || null
              
              console.log('  [EXECUTE] Calling searchPortfolio...')
              const ragResult = await searchPortfolio(query, trace, client)
              
              console.log(`  [EXECUTE] RAG result: ${ragResult.chunks?.length || 0} chunks`)
              
              // Store RAG metadata
              if (params._ragMetadata) {
                params._ragMetadata.sources = ragResult.sources || []
                params._ragMetadata.degraded = ragResult.degraded || false
                params._ragMetadata.degradedReason = ragResult.degradedReason || null
                params._ragMetadata.metrics = ragResult.metrics || {}
                params._ragMetadata.usage = ragResult.usage || {}
                console.log('  [EXECUTE] Metadata stored:', params._ragMetadata)
              }
              
              if (ragResult.chunks && ragResult.chunks.length > 0) {
                const context = formatChunksForContext(ragResult.chunks)
                console.log(`  [EXECUTE] Returning context: ${context.length} chars`)
                return context
              }
              
              console.log('  [EXECUTE] No chunks, returning fallback')
              return 'No relevant content found.'
            },
          }
        }
        return toolDef
      })
      
      console.log('✓ Execute function added\n')
    }
    
    // =========================================================================
    // STEP 3: createBedrockStreamWrapper - just passes params through
    // =========================================================================
    console.log('--- STEP 3: createBedrockStreamWrapper ---')
    console.log('(This just wraps the stream, skipping for simplicity)\n')
    
    // =========================================================================
    // STEP 4: model-router.js - Convert tools to Vercel AI SDK format
    // =========================================================================
    console.log('--- STEP 4: model-router.js - createChatCompletionStream ---')
    
    const modelId = 'eu.anthropic.claude-sonnet-4-6'
    console.log(`Creating Bedrock model: ${modelId}`)
    
    const model = bedrock(modelId, {
      region: process.env.AWS_REGION || 'eu-central-1',
    })
    console.log('✓ Bedrock model created')
    
    console.log('Converting Anthropic tools to Vercel AI SDK format...')
    let vercelTools = undefined
    
    if (params.tools && params.tools.length > 0) {
      vercelTools = {}
      
      for (const anthropicTool of params.tools) {
        console.log(`  - Converting tool: ${anthropicTool.name}`)
        
        // Convert JSON Schema to Zod
        const inputSchema = anthropicTool.input_schema
        const zodSchema = z.object({
          query: z.string().describe('The search query'),
        })
        
        const toolConfig = {
          description: anthropicTool.description,
          inputSchema: zodSchema,  // ← inputSchema, not parameters
        }
        
        // Add execute if present
        if (anthropicTool.execute) {
          console.log(`    ✓ Execute function found, adding to tool`)
          toolConfig.execute = anthropicTool.execute
        } else {
          console.log(`    ✗ No execute function`)
        }
        
        vercelTools[anthropicTool.name] = tool(toolConfig)
      }
      
      console.log(`✓ Converted ${Object.keys(vercelTools).length} tools`)
    }
    
    console.log('Calling streamText...\n')
    
    // =========================================================================
    // STEP 5: Vercel AI SDK - streamText with auto tool execution
    // =========================================================================
    console.log('--- STEP 5: Vercel AI SDK streamText ---')
    
    const result = streamText({
      model,
      messages: params.messages,
      maxTokens: params.max_tokens,
      ...(vercelTools && { 
        tools: vercelTools,
        maxSteps: 5,
      }),
    })
    
    console.log('✓ streamText called, reading stream...\n')
    console.log('--- STREAMING RESPONSE ---\n')
    
    let fullText = ''
    for await (const chunk of result.textStream) {
      fullText += chunk
      process.stdout.write(chunk)
    }
    
    console.log('\n\n--- STREAM COMPLETE ---\n')
    
    console.log('=== FINAL RESULTS ===')
    console.log('Text length:', fullText.length)
    console.log('RAG metadata:', JSON.stringify(ragMetadata, null, 2))
    
    if (fullText.length === 0) {
      console.log('\n❌ FAILED: No text generated')
      process.exit(1)
    }
    
    if (ragMetadata.sources.length === 0) {
      console.log('\n⚠️  WARNING: No RAG sources (tool may not have been called)')
    }
    
    console.log('\n✅ SUCCESS!')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
