import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { createClaudeClient } from './api/_shared/claude-client.js'
import { searchPortfolio, formatChunksForContext } from './api/_shared/rag.js'

async function test() {
  console.log('=== Testing Vercel AI SDK Streaming + RAG ===\n')
  
  try {
    const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
      region: process.env.AWS_REGION || 'eu-central-1',
    })
    
    const claudeClient = createClaudeClient()
    console.log('Claude client created, provider:', claudeClient._provider)
    
    const query = 'Tell me about GALA project'
    console.log(`Query: "${query}"\n`)
    
    const result = streamText({
      model,
      maxTokens: 500,
      prompt: query,
      tools: {
        search_portfolio: tool({
          description: 'Search your own published case studies for project details.',
          inputSchema: z.object({
            query: z.string().describe('The search query'),
          }),
          execute: async ({ query }) => {
            console.log('🔧 Tool called:', query)
            
            const ragResult = await searchPortfolio(query, null, claudeClient)
            console.log('  - Chunks:', ragResult.chunks?.length || 0)
            console.log('  - Metrics:', ragResult.metrics)
            
            if (ragResult.chunks && ragResult.chunks.length > 0) {
              const context = formatChunksForContext(ragResult.chunks)
              console.log('  - Context:', context.length, 'chars\n')
              return context
            }
            return 'No content found.'
          },
        }),
      },
      stopWhen: stepCountIs(5),
    })
    
    console.log('📡 Streaming response:\n')
    
    let fullText = ''
    for await (const textChunk of result.textStream) {
      fullText += textChunk
      process.stdout.write(textChunk)
    }
    
    console.log('\n\n=== RESULT ===')
    console.log('Text length:', fullText.length)
    
    // Wait for steps to resolve
    const steps = await result.steps
    console.log('Steps:', steps?.length || 0)
    
    // Check tool usage
    let toolUsed = false
    if (steps) {
      for (const step of steps) {
        if (step.toolCalls && step.toolCalls.length > 0) {
          toolUsed = true
          console.log('✅ Tool used in step', steps.indexOf(step))
        }
      }
    }
    
    if (!toolUsed) {
      console.log('❌ Tool was NOT used')
      process.exit(1)
    }
    
    console.log('\n✅ SUCCESS!')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
