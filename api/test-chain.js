// Test endpoint - testing FULL chain with claude-client
import { createClaudeClient } from './_shared/claude-client.js'
import { PORTFOLIO_TOOL } from './_shared/rag.js'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  try {
    console.log('1. Creating claude client...')
    const client = createClaudeClient()
    console.log('2. Client created, provider:', client._provider)
    
    console.log('3. Creating stream with tools...')
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'test' }],
      tools: [PORTFOLIO_TOOL],
    })
    console.log('4. Stream created, type:', typeof stream)
    console.log('5. Stream constructor:', stream?.constructor?.name)
    console.log('6. Has Symbol.asyncIterator?', !!stream?.[Symbol.asyncIterator])
    console.log('7. Is async iterable?', stream?.[Symbol.asyncIterator] !== undefined)
    
    console.log('8. Iterating stream...')
    let count = 0
    for await (const event of stream) {
      count++
      console.log('9. Event:', event.type)
      if (count > 5) break
    }
    
    console.log('10. Done, events:', count)
    
    return new Response(JSON.stringify({ success: true, events: count }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('ERROR:', error.message)
    console.error('STACK:', error.stack)
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
