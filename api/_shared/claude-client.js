// ---------------------------------------------------------------------------
// Claude Client Wrapper
// Emulates Anthropic SDK API but uses model-router (supports Bedrock + Anthropic)
// ---------------------------------------------------------------------------

import { createChatCompletion, createChatCompletionStream, getActiveProvider } from './model-router.js'

/**
 * Create a Claude client (compatible with Anthropic SDK interface)
 * @param {Object} config - Client configuration
 * @param {string} config.apiKey - API key (optional, uses env vars)
 * @returns {Object} - Client with messages.create() and messages.stream()
 */
export function createClaudeClient(config = {}) {
  const provider = getActiveProvider('claude')
  
  if (!provider) {
    throw new Error('No Claude provider configured. Set AWS_BEDROCK_KEY or ANTHROPIC_API_KEY.')
  }
  
  return {
    messages: {
      /**
       * Create a chat completion (non-streaming)
       * Compatible with Anthropic SDK client.messages.create()
       */
      async create(params) {
        return await createChatCompletion(params)
      },
      
      /**
       * Create a streaming chat completion
       * Compatible with Anthropic SDK client.messages.stream()
       */
      stream(params) {
        // For Bedrock, we need to handle streaming differently
        // Return an async iterable that emulates Anthropic SDK stream
        if (provider === 'bedrock') {
          return createBedrockStreamWrapper(params)
        } else {
          // For Anthropic direct API (not implemented yet)
          throw new Error('Anthropic streaming not implemented')
        }
      },
    },
    
    // Metadata
    _provider: provider,
  }
}

/**
 * Bedrock stream wrapper that emulates Anthropic SDK stream interface
 */
function createBedrockStreamWrapper(params) {
  let streamIterator = null
  let finalMessage = null
  let currentMessage = {
    id: `msg_${Date.now()}`,
    type: 'message',
    role: 'assistant',
    content: [],
    model: params.model,
    stop_reason: null,
    stop_sequence: null,
    usage: { input_tokens: 0, output_tokens: 0 },
  }
  
  const stream = {
    // Async iterator for 'for await' loops
    async *[Symbol.asyncIterator]() {
      if (!streamIterator) {
        streamIterator = await createChatCompletionStream(params)
      }
      
      for await (const event of streamIterator) {
        // Transform Bedrock events to Anthropic SDK format
        if (event.type === 'content_block_delta' && event.delta?.text) {
          yield {
            type: 'content_block_delta',
            index: 0,
            delta: { type: 'text_delta', text: event.delta.text },
          }
          
          // Accumulate text for finalMessage
          if (!currentMessage.content[0]) {
            currentMessage.content.push({ type: 'text', text: '' })
          }
          currentMessage.content[0].text += event.delta.text
        }
        
        if (event.message) {
          // Final message from Bedrock
          finalMessage = {
            ...currentMessage,
            stop_reason: event.message.stop_reason,
            usage: event.message.usage,
          }
        }
      }
    },
    
    // finalMessage() method (Anthropic SDK compatibility)
    async finalMessage() {
      // Consume the stream if not already consumed
      if (!finalMessage) {
        for await (const _ of this) {
          // Just consume the stream
        }
      }
      return finalMessage
    },
    
    // on() method for event listeners (Anthropic SDK compatibility)
    on(eventName, callback) {
      // Not implemented for Bedrock
      // This is used in some Anthropic SDK patterns
      return this
    },
  }
  
  return stream
}
