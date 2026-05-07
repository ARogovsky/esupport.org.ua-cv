import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { generateText, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { createClaudeClient } from './api/_shared/claude-client.js'
import { searchPortfolio, formatChunksForContext } from './api/_shared/rag.js'

async function test() {
  console.log('=== Testing RAG with Vercel AI SDK + Bedrock ===\n')
  console.log('Environment:')
  console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ SET' : '✗ NOT SET')
  console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ SET' : '✗ NOT SET')
  console.log('  AWS_REGION:', process.env.AWS_REGION)
  console.log('  AZURE_OPENAI_ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT ? '✓ SET' : '✗ NOT SET')
  console.log('  AZURE_OPENAI_API_KEY:', process.env.AZURE_OPENAI_API_KEY ? '✓ SET' : '✗ NOT SET')
  console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ SET' : '✗ NOT SET')
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ SET' : '✗ NOT SET')
  console.log('')
  
  try {
    const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
      region: process.env.AWS_REGION || 'eu-central-1',
    })
    
    // Create Claude client for reranking
    const claudeClient = createClaudeClient()
    console.log('Claude client created, provider:', claudeClient._provider)
    console.log('')
    
    const query = 'Tell me about GALA project'
    console.log(`User query: "${query}"`)
    console.log('Tool available: search_portfolio')
    console.log('')
    
    const result = await generateText({
      model,
      maxTokens: 500,
      prompt: query,
      tools: {
        search_portfolio: tool({
          description: 'Search your own published case studies for project details. You wrote these articles — they are YOUR words about YOUR projects. Use this whenever the user asks for specifics about any project.',
          inputSchema: z.object({
            query: z.string().describe('The search query to find relevant portfolio content'),
          }),
          execute: async ({ query }) => {
            console.log('🔧 Tool called with query:', query)
            console.log('')
            
            // Execute real RAG pipeline
            console.log('📊 Running RAG pipeline...')
            const ragResult = await searchPortfolio(query, null, claudeClient)
            
            console.log('  - Chunks found:', ragResult.chunks?.length || 0)
            console.log('  - Sources:', ragResult.sources?.length || 0)
            console.log('  - Degraded:', ragResult.degraded)
            console.log('  - Metrics:', ragResult.metrics)
            console.log('  - Usage:', ragResult.usage)
            console.log('')
            
            if (ragResult.chunks && ragResult.chunks.length > 0) {
              const context = formatChunksForContext(ragResult.chunks)
              console.log('✅ RAG context prepared (' + context.length + ' chars)')
              console.log('First 200 chars:', context.slice(0, 200) + '...')
              console.log('')
              return context
            } else {
              console.log('⚠️  No chunks found')
              console.log('')
              return 'No relevant content found in portfolio articles.'
            }
          },
        }),
      },
      stopWhen: stepCountIs(5), // Enable multi-step tool calling
    })
    
    console.log('\n=== FINAL RESULT ===')
    console.log('Steps:', result.steps?.length || 0)
    console.log('Finish reason:', result.finishReason)
    console.log('Usage:', JSON.stringify(result.usage, null, 2))
    console.log('')
    console.log('Response text:')
    console.log(result.text)
    console.log('')
    
    // Check if tool was used in any step
    let toolWasUsed = false
    if (result.steps) {
      for (const step of result.steps) {
        if (step.toolCalls && step.toolCalls.length > 0) {
          toolWasUsed = true
          console.log('✅ Tool was called in step', result.steps.indexOf(step))
          console.log('Tool calls:', JSON.stringify(step.toolCalls, null, 2))
        }
      }
    }
    
    if (!toolWasUsed) {
      console.log('❌ FAIL: Tool was NOT called in any step')
      process.exit(1)
    }
    
    console.log('\n✅ SUCCESS: RAG pipeline completed successfully!')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
