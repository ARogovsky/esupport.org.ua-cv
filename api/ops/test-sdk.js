import { validateOpsAuth } from '../_shared/ops-auth.js'
import { createClaudeClient } from '../_shared/claude-client.js'
import { getActiveProvider } from '../_shared/model-router.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  const results = {
    timestamp: new Date().toISOString(),
    overallStatus: 'success',
    tests: [],
    errors: [],
  }

  // Test 1: Environment Variables
  results.tests.push({
    name: 'Environment Variables',
    status: 'success',
    details: {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✓ SET' : '✗ NOT SET',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✓ SET' : '✗ NOT SET',
      AWS_REGION: process.env.AWS_REGION || '✗ NOT SET',
      AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? '✓ SET' : '✗ NOT SET',
      AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY ? '✓ SET' : '✗ NOT SET',
    },
  })

  // Test 2: Provider Detection
  try {
    const claudeProvider = getActiveProvider('claude')
    const embeddingProvider = getActiveProvider('embedding')
    
    results.tests.push({
      name: 'Provider Detection',
      status: 'success',
      details: {
        claude: claudeProvider || 'none',
        embedding: embeddingProvider || 'none',
      },
    })
  } catch (error) {
    results.tests.push({
      name: 'Provider Detection',
      status: 'error',
      error: error.message,
    })
    results.errors.push(`Provider detection: ${error.message}`)
  }

  // Test 3: Claude SDK Streaming (Edge Runtime with AI SDK)
  try {
    const client = createClaudeClient()
    
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Count to 5' }],
    })
    
    let fullText = ''
    let eventCount = 0
    
    for await (const event of stream) {
      eventCount++
      
      if (event.type === 'content_block_delta' && event.delta?.text) {
        fullText += event.delta.text
      }
    }
    
    results.tests.push({
      name: 'Claude SDK Streaming',
      status: 'success',
      details: {
        provider: client._provider,
        model: 'claude-sonnet-4-6',
        eventCount,
        response: fullText,
        responseLength: fullText.length,
      },
    })
  } catch (error) {
    results.tests.push({
      name: 'Claude SDK Streaming',
      status: 'error',
      error: error.message,
      errorType: error.constructor.name,
    })
    results.errors.push(`Claude streaming: ${error.message}`)
  }

  // Overall status
  const hasErrors = results.tests.some(t => t.status === 'error')
  results.overallStatus = hasErrors ? 'partial' : 'success'

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}
