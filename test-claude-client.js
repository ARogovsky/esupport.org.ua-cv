import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'
import { PORTFOLIO_TOOL } from './api/_shared/rag.js'

async function test() {
  console.log('=== Testing claude-client with tools ===\n')
  
  try {
    const client = createClaudeClient()
    console.log('Client created, provider:', client._provider)
    console.log('')
    
    const query = 'Tell me about GALA project'
    console.log(`Query: "${query}"`)
    console.log('Tool available:', PORTFOLIO_TOOL.name)
    console.log('')
    
    console.log('Calling client.messages.create()...')
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: query }],
      tools: [PORTFOLIO_TOOL],
    })
    
    console.log('\n=== RESPONSE ===')
    console.log('Stop reason:', response.stop_reason)
    console.log('Content blocks:', response.content.length)
    console.log('')
    
    for (const block of response.content) {
      if (block.type === 'text') {
        console.log('TEXT BLOCK:')
        console.log(block.text)
        console.log('')
      }
      if (block.type === 'tool_use') {
        console.log('✅ TOOL USE BLOCK:')
        console.log('- Tool:', block.name)
        console.log('- ID:', block.id)
        console.log('- Input:', JSON.stringify(block.input, null, 2))
        console.log('')
      }
    }
    
    if (response.stop_reason === 'tool_use') {
      console.log('✅ SUCCESS: Tool was called!')
    } else {
      console.log('❌ FAIL: Tool was NOT called')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
