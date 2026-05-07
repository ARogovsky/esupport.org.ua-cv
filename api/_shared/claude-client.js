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
    throw new Error('No Claude provider configured. Set AWS_BEARER_TOKEN_BEDROCK or ANTHROPIC_API_KEY.')
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
      async stream(params) {
        // For Bedrock, we need to handle streaming differently
        // Return an async iterable that emulates Anthropic SDK stream
        if (provider === 'bedrock') {
          return await createBedrockStreamWrapper(params)
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
 * Returns async generator directly (Edge Runtime compatible)
 */
async function createBedrockStreamWrapper(params) {
  // Check if we need to add RAG execute function
  const hasRAGTool = params.tools?.some(t => t.name === 'search_portfolio')
  
  if (hasRAGTool) {
    // Import RAG functions
    const { searchPortfolio, formatChunksForContext } = await import('./rag.js')
    
    // Add execute function to search_portfolio tool
    params.tools = params.tools.map(tool => {
      if (tool.name === 'search_portfolio') {
        return {
          ...tool,
          execute: async ({ query }) => {
            // Use trace and client from params if available
            const trace = params.trace || null
            const client = params.client || null
            
            const ragResult = await searchPortfolio(query, trace, client)
            
            // Store RAG metadata for caller to access
            if (params._ragMetadata) {
              params._ragMetadata.sources = ragResult.sources || []
              params._ragMetadata.degraded = ragResult.degraded || false
              params._ragMetadata.degradedReason = ragResult.degradedReason || null
              params._ragMetadata.metrics = ragResult.metrics || {}
              params._ragMetadata.usage = ragResult.usage || {}
            }
            
            if (ragResult.chunks && ragResult.chunks.length > 0) {
              return formatChunksForContext(ragResult.chunks)
            }
            return 'No relevant content found in portfolio articles. You MUST NOT fabricate project details. Say you don\'t have that information and suggest contacting Andrey directly.'
          },
        }
      }
      return tool
    })
  }
  
  // Get async generator from model-router
  const streamIterator = await createChatCompletionStream(params)
  
  // Return the async generator directly - Edge Runtime compatible
  // Add metadata as property on the generator
  streamIterator._ragMetadata = params._ragMetadata
  
  return streamIterator
}
