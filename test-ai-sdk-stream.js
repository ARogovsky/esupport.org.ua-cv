import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText } from 'ai'

async function test() {
  console.log('Testing Vercel AI SDK with Bedrock streaming...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('')
  
  try {
    // Create Bedrock model instance with explicit API key
    const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
      apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
    })
    
    console.log('Model created')
    console.log('\nStreaming with question: "Why should I hire Andrey?"')
    
    const { textStream } = await streamText({
      model,
      messages: [
        { role: 'user', content: 'Why should I hire Andrey?' }
      ],
      maxTokens: 200,
    })
    
    console.log('Stream created, reading chunks...\n')
    
    let fullText = ''
    let chunkCount = 0
    
    for await (const textChunk of textStream) {
      chunkCount++
      fullText += textChunk
      process.stdout.write(textChunk)
    }
    
    console.log('\n\n=== SUMMARY ===')
    console.log('Total chunks:', chunkCount)
    console.log('Full text length:', fullText.length)
    console.log('\nFull text:', fullText)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
