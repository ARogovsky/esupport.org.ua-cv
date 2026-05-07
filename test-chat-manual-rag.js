import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'
import { PORTFOLIO_TOOL, searchPortfolio, formatChunksForContext } from './api/_shared/rag.js'

async function test() {
  console.log('=== Testing Manual 2-Step RAG Flow (like /api/chat) ===\n')
  
  try {
    const client = createClaudeClient()
    console.log('Claude client created, provider:', client._provider)
    
    const query = 'Tell me about GALA project'
    console.log(`Query: "${query}"\n`)
    
    // Step 1: Tool decision (non-streaming)
    console.log('📋 Step 1: Tool decision (non-streaming)...')
    const firstResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: query }],
      tools: [PORTFOLIO_TOOL],
    })
    
    console.log('  - Stop reason:', firstResponse.stop_reason)
    console.log('  - Content blocks:', firstResponse.content.length)
    
    if (firstResponse.stop_reason !== 'tool_use') {
      console.log('❌ Claude did NOT use tool')
      console.log('Response:', JSON.stringify(firstResponse, null, 2))
      process.exit(1)
    }
    
    const toolUseBlock = firstResponse.content.find(b => b.type === 'tool_use')
    console.log('  - Tool:', toolUseBlock.name)
    console.log('  - Input:', toolUseBlock.input)
    
    // Step 2: Execute RAG
    console.log('\n🔍 Step 2: Execute RAG...')
    const ragResult = await searchPortfolio(toolUseBlock.input.query, null, client)
    console.log('  - Chunks:', ragResult.chunks?.length || 0)
    console.log('  - Metrics:', ragResult.metrics)
    
    const toolResultContent = ragResult.chunks
      ? formatChunksForContext(ragResult.chunks)
      : 'No content found.'
    
    console.log('  - Context:', toolResultContent.length, 'chars')
    
    // Step 3: Stream final response
    console.log('\n📡 Step 3: Stream final response...\n')
    
    const messagesWithTool = [
      { role: 'user', content: query },
      { role: 'assistant', content: firstResponse.content },
      {
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: toolResultContent,
        }],
      },
    ]
    
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: messagesWithTool,
    })
    
    let fullText = ''
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        fullText += event.delta.text
        process.stdout.write(event.delta.text)
      }
    }
    
    console.log('\n\n=== RESULT ===')
    console.log('Text length:', fullText.length)
    
    if (fullText.length === 0) {
      console.log('❌ No text generated!')
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
