import { config } from 'dotenv'
config({ path: '.env.local' })

import { createChatCompletionStream } from './api/_shared/model-router.js'

async function test() {
  console.log('Testing Model Router Streaming...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('')
  
  try {
    console.log('Creating stream...')
    const stream = await createChatCompletionStream({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      system: [{ type: 'text', text: 'You are a helpful assistant.' }],
      messages: [{ role: 'user', content: 'Say hello in one sentence' }],
    })
    
    console.log('Stream created, reading events...\n')
    
    let fullText = ''
    let eventCount = 0
    
    for await (const event of stream) {
      eventCount++
      console.log(`Event ${eventCount}:`, JSON.stringify(event, null, 2))
      
      if (event.delta?.text) {
        fullText += event.delta.text
        process.stdout.write(event.delta.text)
      }
    }
    
    console.log('\n\n=== SUMMARY ===')
    console.log('Total events:', eventCount)
    console.log('Full text length:', fullText.length)
    console.log('Full text:', fullText)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
