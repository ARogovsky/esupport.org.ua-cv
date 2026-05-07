import { config } from 'dotenv'
config({ path: '.env.local' })

import { bedrock } from '@ai-sdk/amazon-bedrock'
import { generateText } from 'ai'

async function test() {
  console.log('Testing Bedrock with AI SDK...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('')
  
  try {
    const model = bedrock('eu.anthropic.claude-sonnet-4-6')
    
    console.log('Generating text...\n')
    
    const result = await generateText({
      model,
      prompt: 'Count to 5',
    })
    
    console.log('Result:', result.text)
    console.log('\nUsage:', result.usage)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
