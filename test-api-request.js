async function test() {
  console.log('=== Testing /api/chat with "Why should I hire Andrey?" ===\n')
  
  try {
    const query = 'Why should I hire Andrey?'
    console.log(`Query: "${query}"\n`)
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }],
        lang: 'en',
        sessionId: 'test-' + Date.now(),
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    console.log('📡 Streaming response:\n')
    
    let fullText = ''
    let ragSources = []
    let ragStatus = null
    let eventCount = 0
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (!line.trim()) continue
        
        if (line.startsWith('event: ')) {
          const eventType = line.slice(7).trim()
          eventCount++
          
          // Next line should be data
          const dataLineIndex = lines.indexOf(line) + 1
          if (dataLineIndex < lines.length) {
            const dataLine = lines[dataLineIndex]
            if (dataLine.startsWith('data: ')) {
              const data = dataLine.slice(6)
              
              if (eventType === 'rag-sources') {
                try {
                  ragSources = JSON.parse(data)
                  console.log(`\n\n[RAG Sources: ${ragSources.length}]`)
                } catch (e) {
                  console.error('Failed to parse rag-sources:', e.message)
                }
              } else if (eventType === 'rag-status') {
                try {
                  ragStatus = JSON.parse(data)
                  console.log(`\n[RAG Status: ${ragStatus.status}]`)
                } catch (e) {
                  console.error('Failed to parse rag-status:', e.message)
                }
              }
            }
          }
        } else if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            console.log('\n\n[DONE]')
            continue
          }
          
          try {
            const json = JSON.parse(data)
            if (json.text) {
              fullText += json.text
              process.stdout.write(json.text)
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
    
    console.log('\n\n=== RESULT ===')
    console.log('Text length:', fullText.length)
    console.log('RAG sources:', ragSources.length)
    if (ragSources.length > 0) {
      console.log('Sources:', ragSources.map(s => s.article_id).join(', '))
    }
    console.log('RAG status:', ragStatus)
    console.log('Events:', eventCount)
    
    if (fullText.length === 0) {
      console.log('\n❌ No text generated!')
      process.exit(1)
    }
    
    console.log('\n✅ SUCCESS!')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

test()
