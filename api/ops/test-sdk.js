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
    
    const streamPromise = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Count to 5' }],
    })
    
    // Await the stream promise first
    const stream = await streamPromise
    
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

  // Test 4: Full /api/chat Flow with RAG (Direct Call)
  try {
    const chatQuery = 'Tell me about GALA project'
    const logs = []
    
    logs.push(`Starting chat test with query: "${chatQuery}"`)
    
    // Import chat handler directly
    const chatModule = await import('../chat.js')
    const chatHandler = chatModule.default
    
    logs.push('Chat handler imported')
    
    // Create mock request
    const mockReq = new Request(`${new URL(req.url).origin}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: chatQuery }],
        lang: 'en',
        sessionId: 'test-sdk-' + Date.now(),
      }),
    })
    
    logs.push('Mock request created')
    
    // Call handler directly
    let chatResponse
    try {
      chatResponse = await chatHandler(mockReq)
      logs.push(`Chat handler returned status: ${chatResponse.status}`)
    } catch (handlerError) {
      logs.push(`ERROR in chat handler: ${handlerError.message}`)
      logs.push(`Stack: ${handlerError.stack}`)
      throw handlerError
    }
    
    if (!chatResponse.ok) {
      const errorText = await chatResponse.text()
      logs.push(`Chat API error response: ${errorText}`)
      throw new Error(`Chat API returned ${chatResponse.status}: ${errorText}`)
    }
    
    logs.push('Starting to read stream...')
    
    let fullText = ''
    let ragSources = []
    let ragStatus = null
    let eventCount = 0
    let chunkCount = 0
    
    const reader = chatResponse.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          logs.push('Stream ended')
          break
        }
        
        chunkCount++
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (!line.trim()) continue
          
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7).trim()
            eventCount++
            logs.push(`Event: ${eventType}`)
            
            if (i + 1 < lines.length) {
              const dataLine = lines[i + 1]
              if (dataLine.startsWith('data: ')) {
                const data = dataLine.slice(6)
                
                if (eventType === 'rag-sources') {
                  try {
                    ragSources = JSON.parse(data)
                    logs.push(`RAG sources: ${ragSources.length}`)
                  } catch (e) {
                    logs.push(`Failed to parse rag-sources: ${e.message}`)
                  }
                } else if (eventType === 'rag-status') {
                  try {
                    ragStatus = JSON.parse(data)
                    logs.push(`RAG status: ${ragStatus.status}`)
                  } catch (e) {
                    logs.push(`Failed to parse rag-status: ${e.message}`)
                  }
                }
              }
            }
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              logs.push('Received [DONE]')
              continue
            }
            
            try {
              const json = JSON.parse(data)
              if (json.text) {
                fullText += json.text
              }
              if (json.replace) {
                logs.push('Received replace flag')
              }
            } catch (e) {
              logs.push(`Failed to parse data: ${data.slice(0, 50)}`)
            }
          }
        }
      }
    } catch (streamError) {
      logs.push(`ERROR reading stream: ${streamError.message}`)
      logs.push(`Stack: ${streamError.stack}`)
      throw streamError
    }
    
    logs.push(`Stream complete: ${chunkCount} chunks, ${eventCount} events, ${fullText.length} chars`)
    
    const testPassed = fullText.length > 0 && !fullText.includes('something went wrong')
    
    results.tests.push({
      name: 'Full /api/chat Flow with RAG',
      status: testPassed ? 'success' : 'error',
      details: {
        query: chatQuery,
        textLength: fullText.length,
        ragSourcesCount: ragSources.length,
        ragSources: ragSources.map(s => s.article_id || s.title),
        ragStatus: ragStatus?.status,
        eventCount,
        chunkCount,
        responsePreview: fullText.slice(0, 200) + (fullText.length > 200 ? '...' : ''),
        fullResponse: fullText.length < 500 ? fullText : undefined,
      },
      logs,
    })
    
    if (!testPassed) {
      results.errors.push(`Chat API test failed: ${fullText.includes('something went wrong') ? 'Error response' : 'No text returned'}`)
    }
  } catch (error) {
    results.tests.push({
      name: 'Full /api/chat Flow with RAG',
      status: 'error',
      error: error.message,
      errorType: error.constructor.name,
      stack: error.stack,
      logs: error.logs || [],
    })
    results.errors.push(`Chat flow: ${error.message}`)
  }

  // Overall status
  const hasErrors = results.tests.some(t => t.status === 'error')
  results.overallStatus = hasErrors ? 'partial' : 'success'

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}
