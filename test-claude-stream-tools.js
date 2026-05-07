import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'
import { PORTFOLIO_TOOL } from './api/_shared/rag.js'

async function test() {
  console.log('=== Testing claude-client streaming with tools ===\n')
  
  try {
    const client = createClaudeClient()
    console.log('Client created, provider:', client._provider)
    console.log('')
    
    const query = 'Tell me about GALA project'
    console.log(`Query: "${query}"`)
    console.log('Tool available:', PORTFOLIO_TOOL.name)
    console.log('')
    
    console.log('📡 Streaming...\n')
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: query }],
      tools: [PORTFOLIO_TOOL],
    })
    
    let fullText = ''
    let eventCount = 0
    let toolUsed = false
    
    for await (const event of stream) {
      eventCount++
      
      if (event.type === 'content_block_delta' && event.delta?.text) {
        fullText += event.delta.text
        process.stdout.write(event.delta.text)
      }
      
      if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') {
        toolUsed = true
        console.log('\n\n🔧 TOOL USE:', event.content_block.name)
        console.log('Input:', JSON.stringify(event.content_block.input, null, 2))
      }
    }
    
    console.log('\n\n=== RESULT ===')
    console.log('Events:', eventCount)
    console.log('Text length:', fullText.length)
    console.log('Tool used:', toolUsed ? '✅ YES' : '❌ NO')
    
    if (!toolUsed) {
      console.log('\n❌ FAIL: Tool was NOT used')
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
