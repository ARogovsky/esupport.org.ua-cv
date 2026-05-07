import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClaudeClient } from './api/_shared/claude-client.js'
import { PORTFOLIO_TOOL, searchPortfolio, formatChunksForContext } from './api/_shared/rag.js'
import { getSystemPrompt } from './api/_shared/prompt.js'

async function test() {
  console.log('Testing Full Chat RAG Flow...')
  console.log('AWS_BEARER_TOKEN_BEDROCK:', process.env.AWS_BEARER_TOKEN_BEDROCK ? 'SET' : 'NOT SET')
  console.log('AWS_REGION:', process.env.AWS_REGION)
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET')
  console.log('')
  
  try {
    const client = createClaudeClient()
    const { text: systemPromptText } = await getSystemPrompt(null)
    
    const systemBlocks = [
      {
        type: 'text',
        text: systemPromptText,
        cache_control: { type: 'ephemeral' },
      },
      {
        type: 'text',
        text: 'The user is browsing in English. You MUST respond in English. Contact email: esupport@esupport.org.ua',
      },
    ]
    
    const userMessage = 'Why should I hire Andrey?'
    const cleanMessages = [{ role: 'user', content: userMessage }]
    
    console.log('Step 1: Tool decision (non-streaming)...')
    const firstResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: systemBlocks,
      messages: cleanMessages,
      tools: [PORTFOLIO_TOOL],
    })
    
    console.log('Stop reason:', firstResponse.stop_reason)
    console.log('Tool used:', firstResponse.stop_reason === 'tool_use')
    
    if (firstResponse.stop_reason === 'tool_use') {
      const toolUseBlock = firstResponse.content.find(b => b.type === 'tool_use')
      const searchQuery = toolUseBlock?.input?.query || userMessage
      
      console.log('\nStep 2: RAG search...')
      console.log('Search query:', searchQuery)
      
      const ragResult = await searchPortfolio(searchQuery, null, client)
      console.log('Sources found:', ragResult.sources.length)
      console.log('Degraded:', ragResult.degraded)
      
      const toolResultContent = ragResult.chunks
        ? formatChunksForContext(ragResult.chunks)
        : 'No relevant content found.'
      
      console.log('Context length:', toolResultContent.length)
      
      const messagesWithTool = [
        ...cleanMessages,
        { role: 'assistant', content: firstResponse.content },
        {
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: toolResultContent,
          }],
        },
      ]
      
      console.log('\nStep 3: Streaming response with RAG context...')
      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: systemBlocks,
        messages: messagesWithTool,
      })
      
      let fullText = ''
      let eventCount = 0
      
      for await (const event of stream) {
        eventCount++
        if (event.type === 'content_block_delta' && event.delta?.text) {
          fullText += event.delta.text
          process.stdout.write(event.delta.text)
        }
      }
      
      console.log('\n\n=== SUMMARY ===')
      console.log('Total events:', eventCount)
      console.log('Response length:', fullText.length)
      console.log('Response preview:', fullText.substring(0, 200))
      
    } else {
      console.log('\n❌ Claude did not use tool!')
      console.log('Response:', firstResponse.content[0]?.text)
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

test()
