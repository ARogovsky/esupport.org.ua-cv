// Simulate Edge Runtime - load env vars first
import { config } from 'dotenv'
config({ path: '.env.local' })

// Now import AI SDK (simulating Edge runtime where process.env is already loaded)
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { generateText } from 'ai'

async function test() {
  console.log('Testing Bedrock in Edge Runtime simulation...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  
  // In Edge Runtime, env vars are available in process.env
  // AI SDK should auto-detect AWS_BEARER_TOKEN_BEDROCK
  console.log('\nCreating model without explicit apiKey (auto-detect)...')
  
  try {
    const model = bedrock('eu.anthropic.claude-sonnet-4-6')
    
    console.log('Model created')
    console.log('Generating text...\n')
    
    const result = await generateText({
      model,
      prompt: 'Count to 5',
    })
    
    console.log('✓ SUCCESS!')
    console.log('Result:', result.text)
    console.log('\nUsage:', result.usage)
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    
    // Try with explicit apiKey
    console.log('\n--- Retrying with explicit apiKey ---\n')
    
    try {
      const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
        apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
      })
      
      console.log('Model created with explicit apiKey')
      console.log('Generating text...\n')
      
      const result = await generateText({
        model,
        prompt: 'Count to 5',
      })
      
      console.log('✓ SUCCESS with explicit apiKey!')
      console.log('Result:', result.text)
      console.log('\nUsage:', result.usage)
      
    } catch (error2) {
      console.error('\n❌ STILL FAILED:', error2.message)
      console.error('Stack:', error2.stack)
      process.exit(1)
    }
  }
}

test()
