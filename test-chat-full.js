import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'
import { getSystemPrompt } from './api/_shared/prompt.js'

async function test() {
  console.log('=== FULL CHAT FLOW TEST ===\n')
  
  try {
    // Step 1: Get system prompt
    console.log('Step 1: Loading system prompt...')
    const { text: systemPromptText, version } = await getSystemPrompt(null)
    console.log(`✓ System prompt loaded (version: ${version}, length: ${systemPromptText?.length || 0})`)
    
    if (!systemPromptText) {
      throw new Error('System prompt is undefined!')
    }
    
    // Step 2: Create client
    console.log('\nStep 2: Creating Claude client...')
    const client = createClaudeClient()
    console.log(`✓ Client created (provider: ${client._provider})`)
    
    // Step 3: Create stream
    console.log('\nStep 3: Creating stream...')
    const systemBlocks = [
      {
        type: 'text',
        text: systemPromptText,
        cache_control: { type: 'ephemeral' },
      },
      {
        type: 'text',
        text: 'The user is browsing in English. You MUST respond in English.',
      },
    ]
    
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      system: systemBlocks,
      messages: [{ role: 'user', content: 'Why should I hire Andrey?' }],
    })
    
    console.log('✓ Stream created')
    
    // Step 4: Read stream
    console.log('\nStep 4: Reading stream...')
    let fullText = ''
    let eventCount = 0
    
    for await (const event of stream) {
      eventCount++
      console.log(`Event ${eventCount}: ${event.type}`)
      
      if (event.type === 'content_block_delta' && event.delta?.text) {
        fullText += event.delta.text
        process.stdout.write(event.delta.text)
      }
    }
    
    console.log('\n\n✓ Stream completed')
    console.log(`\nTotal events: ${eventCount}`)
    console.log(`Response length: ${fullText.length}`)
    console.log(`\nFull response:\n${fullText}`)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
