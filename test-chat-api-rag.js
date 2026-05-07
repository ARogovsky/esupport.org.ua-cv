import { config } from 'dotenv'
config({ path: '.env.local' })

async function test() {
  console.log('=== Testing /api/chat with RAG ===\n')
  
  try {
    const query = 'Tell me about GALA project'
    console.log(`Query: "${query}"\n`)
    
    // Simulate chat API request
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
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    console.log('📡 Streaming response:\n')
    
    let fullText = ''
    let ragSources = []
    let ragStatus = null
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const json = JSON.parse(data)
            if (json.text) {
              fullText += json.text
              process.stdout.write(json.text)
            }
          } catch (e) {
            // Skip invalid JSON
          }
        } else if (line.startsWith('event: rag-sources')) {
          const nextLine = lines[lines.indexOf(line) + 1]
          if (nextLine?.startsWith('data: ')) {
            ragSources = JSON.parse(nextLine.slice(6))
          }
        } else if (line.startsWith('event: rag-status')) {
          const nextLine = lines[lines.indexOf(line) + 1]
          if (nextLine?.startsWith('data: ')) {
            ragStatus = JSON.parse(nextLine.slice(6))
          }
        }
      }
    }
    
    console.log('\n\n=== RESULT ===')
    console.log('Text length:', fullText.length)
    console.log('RAG sources:', ragSources.length)
    console.log('RAG status:', ragStatus)
    
    if (fullText.length === 0) {
      console.log('❌ No text generated!')
      process.exit(1)
    }
    
    if (ragSources.length === 0) {
      console.log('⚠️  No RAG sources returned (tool may not have been called)')
    }
    
    console.log('\n✅ SUCCESS!')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
