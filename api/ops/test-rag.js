import { validateOpsAuth } from '../_shared/ops-auth.js'
import { createClaudeClient } from '../_shared/claude-client.js'
import { searchPortfolio, isRagEnabled, PORTFOLIO_TOOL } from '../_shared/rag.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const auth = validateOpsAuth(req)
  if (!auth.ok) return auth.response

  const logs = []
  const log = (msg) => {
    console.log(msg)
    logs.push(`[${new Date().toISOString()}] ${msg}`)
  }

  const results = {
    timestamp: new Date().toISOString(),
    status: 'running',
    logs: [],
    tests: [],
  }

  try {
    // Test 1: Environment check
    log('=== TEST 1: Environment Check ===')
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      ragEnabled: isRagEnabled(),
    }
    log(`Environment: ${JSON.stringify(envCheck, null, 2)}`)
    results.tests.push({ name: 'Environment Check', status: 'success', details: envCheck })

    // Test 2: Direct RAG search
    log('\n=== TEST 2: Direct RAG Search ===')
    const testQuery = 'Tell me about GALA project'
    log(`Query: "${testQuery}"`)
    
    const client = createClaudeClient()
    log(`Claude client created, provider: ${client._provider}`)
    
    const ragResult = await searchPortfolio(testQuery, null, client)
    log(`RAG search completed`)
    log(`- Chunks found: ${ragResult.chunks?.length || 0}`)
    log(`- Sources: ${ragResult.sources?.length || 0}`)
    log(`- Degraded: ${ragResult.degraded}`)
    log(`- Degraded reason: ${ragResult.degradedReason || 'none'}`)
    log(`- Metrics: ${JSON.stringify(ragResult.metrics)}`)
    log(`- Usage: ${JSON.stringify(ragResult.usage)}`)
    
    if (ragResult.chunks && ragResult.chunks.length > 0) {
      log(`\nFirst chunk preview:`)
      log(`- Content: ${ragResult.chunks[0].content.slice(0, 200)}...`)
      log(`- Metadata: ${JSON.stringify(ragResult.chunks[0].metadata)}`)
    }
    
    results.tests.push({
      name: 'Direct RAG Search',
      status: ragResult.chunks?.length > 0 ? 'success' : 'failed',
      details: {
        query: testQuery,
        chunksFound: ragResult.chunks?.length || 0,
        sources: ragResult.sources?.length || 0,
        degraded: ragResult.degraded,
        degradedReason: ragResult.degradedReason,
        metrics: ragResult.metrics,
        usage: ragResult.usage,
        firstChunkPreview: ragResult.chunks?.[0]?.content.slice(0, 200),
      },
    })

    // Test 3: Tool definition check
    log('\n=== TEST 3: Tool Definition ===')
    log(`Tool name: ${PORTFOLIO_TOOL.name}`)
    log(`Tool description length: ${PORTFOLIO_TOOL.description.length} chars`)
    log(`Tool description preview: ${PORTFOLIO_TOOL.description.slice(0, 100)}...`)
    results.tests.push({
      name: 'Tool Definition',
      status: 'success',
      details: {
        name: PORTFOLIO_TOOL.name,
        descriptionLength: PORTFOLIO_TOOL.description.length,
        hasInputSchema: !!PORTFOLIO_TOOL.input_schema,
      },
    })

    // Test 4: Agentic RAG flow (tool use)
    log('\n=== TEST 4: Agentic RAG Flow (Tool Use) ===')
    const agenticQuery = 'What is the GALA project about?'
    log(`Query: "${agenticQuery}"`)
    
    try {
      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        tools: [PORTFOLIO_TOOL],
        messages: [{ role: 'user', content: agenticQuery }],
      })

      let toolUsed = false
      let toolInput = null
      let finalText = ''
      let eventCount = 0

      for await (const event of stream) {
        eventCount++
        
        if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') {
          toolUsed = true
          log(`Tool use detected: ${event.content_block.name}`)
        }
        
        if (event.type === 'content_block_delta') {
          if (event.delta?.type === 'input_json_delta') {
            toolInput = (toolInput || '') + event.delta.partial_json
          }
          if (event.delta?.type === 'text_delta') {
            finalText += event.delta.text
          }
        }
      }

      log(`Events received: ${eventCount}`)
      log(`Tool used: ${toolUsed}`)
      if (toolInput) {
        log(`Tool input: ${toolInput}`)
      }
      log(`Final text length: ${finalText.length}`)
      log(`Final text preview: ${finalText.slice(0, 200)}`)

      results.tests.push({
        name: 'Agentic RAG Flow',
        status: toolUsed ? 'success' : 'failed',
        details: {
          query: agenticQuery,
          toolUsed,
          toolInput: toolInput ? JSON.parse(toolInput) : null,
          eventCount,
          responseLength: finalText.length,
          responsePreview: finalText.slice(0, 200),
        },
      })
    } catch (error) {
      log(`ERROR in agentic flow: ${error.message}`)
      results.tests.push({
        name: 'Agentic RAG Flow',
        status: 'error',
        error: error.message,
        stack: error.stack,
      })
    }

    // Test 5: Full /api/chat flow
    log('\n=== TEST 5: Full /api/chat Flow ===')
    try {
      const chatQuery = 'Why should I hire Andrey?'
      log(`Query: "${chatQuery}"`)
      
      // Call /api/chat endpoint
      const chatResponse = await fetch(`${new URL(req.url).origin}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: chatQuery }],
          lang: 'en',
          sessionId: 'test-' + Date.now(),
        }),
      })
      
      if (!chatResponse.ok) {
        throw new Error(`Chat API returned ${chatResponse.status}`)
      }
      
      log('Chat API responded, parsing stream...')
      
      let fullText = ''
      let ragSources = []
      let ragStatus = null
      let eventCount = 0
      
      const reader = chatResponse.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (!line.trim()) continue
          
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7).trim()
            eventCount++
            
            // Next line should be data
            if (i + 1 < lines.length) {
              const dataLine = lines[i + 1]
              if (dataLine.startsWith('data: ')) {
                const data = dataLine.slice(6)
                
                if (eventType === 'rag-sources') {
                  try {
                    ragSources = JSON.parse(data)
                    log(`RAG sources received: ${ragSources.length}`)
                  } catch (e) {
                    log(`Failed to parse rag-sources: ${e.message}`)
                  }
                } else if (eventType === 'rag-status') {
                  try {
                    ragStatus = JSON.parse(data)
                    log(`RAG status: ${ragStatus.status}`)
                  } catch (e) {
                    log(`Failed to parse rag-status: ${e.message}`)
                  }
                }
              }
            }
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            
            try {
              const json = JSON.parse(data)
              if (json.text) {
                fullText += json.text
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      log(`Stream completed`)
      log(`- Text length: ${fullText.length}`)
      log(`- RAG sources: ${ragSources.length}`)
      log(`- Events: ${eventCount}`)
      log(`- Text preview: ${fullText.slice(0, 200)}`)
      
      const testPassed = fullText.length > 0
      
      results.tests.push({
        name: 'Full /api/chat Flow',
        status: testPassed ? 'success' : 'failed',
        details: {
          query: chatQuery,
          textLength: fullText.length,
          ragSourcesCount: ragSources.length,
          ragSources: ragSources.map(s => s.article_id),
          ragStatus,
          eventCount,
          textPreview: fullText.slice(0, 200),
        },
      })
    } catch (error) {
      log(`ERROR in /api/chat flow: ${error.message}`)
      results.tests.push({
        name: 'Full /api/chat Flow',
        status: 'error',
        error: error.message,
        stack: error.stack,
      })
    }

    // Test 6: Supabase connection
    log('\n=== TEST 6: Supabase Connection ===')
    try {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      const response = await fetch(`${supabaseUrl}/rest/v1/documents?select=count`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'count=exact',
        },
      })
      
      const contentRange = response.headers.get('content-range')
      const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0
      
      log(`Supabase documents count: ${count}`)
      results.tests.push({
        name: 'Supabase Connection',
        status: count > 0 ? 'success' : 'failed',
        details: { documentCount: count },
      })
    } catch (error) {
      log(`ERROR in Supabase check: ${error.message}`)
      results.tests.push({
        name: 'Supabase Connection',
        status: 'error',
        error: error.message,
      })
    }

    results.status = 'completed'
    results.logs = logs

  } catch (error) {
    log(`FATAL ERROR: ${error.message}`)
    log(`Stack: ${error.stack}`)
    results.status = 'error'
    results.error = error.message
    results.stack = error.stack
    results.logs = logs
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
