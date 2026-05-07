import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'

async function test() {
  console.log('Testing Claude client streaming...')
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET')
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('')
  
  try {
    const client = createClaudeClient()
    console.log('Client created, provider:', client._provider)
    
    console.log('\nCreating stream with question: "Why should I hire Andrey?"')
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: 'Why should I hire Andrey?' }],
    })
    
    console.log('Stream created, reading events...\n')
    
    let fullText = ''
    let eventCount = 0
    
    for await (const event of stream) {
      eventCount++
      
      if (event.type === 'content_block_delta' && event.delta?.text) {
        fullText += event.delta.text
        process.stdout.write(event.delta.text)
      }
    }
    
    console.log('\n\n=== SUMMARY ===')
    console.log('Total events:', eventCount)
    console.log('Full text length:', fullText.length)
    console.log('\nFull text:', fullText)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
