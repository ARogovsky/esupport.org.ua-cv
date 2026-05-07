import { validateOpsAuth } from '../_shared/ops-auth.js'
import evalResults from './_eval-results.js'
import { getActiveProvider } from '../_shared/model-router.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    // GET - return eval results
    if (req.method === 'GET') {
      return json(evalResults)
    }

    // POST - run SDK tests
    if (req.method === 'POST') {
      const sdkTests = await runSdkTests()
      return json(sdkTests)
    }

    return json({ error: 'Method not allowed' }, 405)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function runSdkTests() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
  }

  // Test 1: Environment variables
  try {
    results.tests.push({
      name: 'Environment Variables',
      status: 'success',
      details: {
        AWS_BEARER_TOKEN_BEDROCK: process.env.AWS_BEARER_TOKEN_BEDROCK ? '✓ SET' : '✗ NOT SET',
        AWS_REGION: process.env.AWS_REGION || '✗ NOT SET',
        AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? '✓ SET' : '✗ NOT SET',
        AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY ? '✓ SET' : '✗ NOT SET',
      },
    })
  } catch (error) {
    results.tests.push({
      name: 'Environment Variables',
      status: 'error',
      error: error.message,
    })
    results.errors.push(`Env check: ${error.message}`)
  }

  // Test 2: Provider detection
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

  // Overall status
  const hasErrors = results.tests.some(t => t.status === 'error')
  results.overallStatus = hasErrors ? 'partial' : 'success'

  return results
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
