/**
 * Test Azure OpenAI GPT-5-pro connection
 * 
 * Usage:
 *   npx tsx scripts/test-gpt5-connection.ts
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Load environment variables
config({ path: resolve(root, '.env.local') })

const ENDPOINT = process.env.AZURE_GPT5_ENDPOINT
const API_KEY = process.env.AZURE_GPT5_API_KEY
const DEPLOYMENT = process.env.AZURE_GPT5_DEPLOYMENT || 'gpt-5.4-pro'

console.log('🧪 Testing Azure OpenAI GPT-5-pro connection...\n')

if (!ENDPOINT || !API_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   AZURE_GPT5_ENDPOINT')
  console.error('   AZURE_GPT5_API_KEY')
  process.exit(1)
}

console.log('✅ Environment variables loaded:')
console.log(`   AZURE_GPT5_ENDPOINT: ${ENDPOINT}`)
console.log(`   AZURE_GPT5_DEPLOYMENT: ${DEPLOYMENT}`)
console.log('')

async function testConnection() {
  // The endpoint already includes /v1/responses, so we just need to append the model
  const url = `${ENDPOINT}?model=${DEPLOYMENT}`

  console.log('📡 Sending test request...')
  console.log(`   URL: ${url}`)
  console.log('')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEPLOYMENT,
        input: [
          { type: 'message', role: 'system', content: 'You are a helpful assistant. You will talk like a pirate.' },
          { type: 'message', role: 'user', content: 'Can you help me?' },
          { type: 'message', role: 'user', content: 'What\'s the best way to train a parrot?' },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`❌ API request failed: ${response.status}`)
      console.error(`   Error: ${error}`)
      process.exit(1)
    }

    const data = await response.json()

    console.log('✅ Connection successful!')
    console.log('')
    console.log('📊 Response:')
    console.log(JSON.stringify(data, null, 2))
    console.log('')
    console.log('🎉 Test passed! Azure OpenAI GPT-5-pro is working correctly.')

  } catch (err) {
    console.error('❌ Connection test failed:')
    console.error(err)
    process.exit(1)
  }
}

testConnection()
