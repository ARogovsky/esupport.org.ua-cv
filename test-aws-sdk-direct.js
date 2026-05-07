import { config } from 'dotenv'
config({ path: '.env.local' })

import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime'

async function test() {
  console.log('Testing AWS SDK BedrockRuntimeClient streaming directly...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('')
  
  try {
    const region = process.env.AWS_REGION || 'eu-central-1'
    
    const client = new BedrockRuntimeClient({
      region,
    })
    
    console.log('Client created')
    
    const modelId = 'eu.anthropic.claude-sonnet-4-6'
    
    const body = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 200,
      messages: [{ role: 'user', content: 'Count to 5' }],
    }
    
    const command = new InvokeModelWithResponseStreamCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    })
    
    console.log('Sending command...\n')
    
    const response = await client.send(command)
    
    let fullText = ''
    let eventCount = 0
    
    for await (const event of response.body) {
      eventCount++
      
      if (event.chunk?.bytes) {
        const decoded = new TextDecoder().decode(event.chunk.bytes)
        const parsed = JSON.parse(decoded)
        
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          fullText += parsed.delta.text
          process.stdout.write(parsed.delta.text)
        }
      }
    }
    
    console.log('\n\n=== SUMMARY ===')
    console.log('Total events:', eventCount)
    console.log('Full text length:', fullText.length)
    console.log('\nFull text:', fullText)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Error name:', error.name)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
