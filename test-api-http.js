// Test real API endpoint
async function testAPI() {
  console.log('='.repeat(80))
  console.log('Testing http://localhost:3000/api/chat')
  console.log('='.repeat(80))
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Why should I hire Andrey?' }],
        lang: 'en',
        sessionId: 'test-' + Date.now(),
      }),
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    console.log('\n=== Response ===\n')
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      process.stdout.write(chunk)
      
      // Extract text from SSE
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text && !data.replace) {
              fullText += data.text
            }
          } catch (e) {}
        }
      }
    }
    
    console.log('\n\n=== Summary ===')
    console.log('Total text length:', fullText.length)
    console.log('Text preview:', fullText.slice(0, 200))
    
    if (fullText.length === 0) {
      console.log('\n❌ FAILED: No text received')
      process.exit(1)
    }
    
    if (fullText.includes('Sorry, something went wrong')) {
      console.log('\n❌ FAILED: Error response')
      process.exit(1)
    }
    
    console.log('\n✅ SUCCESS')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

testAPI()
