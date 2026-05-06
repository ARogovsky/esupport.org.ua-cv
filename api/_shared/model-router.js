// ---------------------------------------------------------------------------
// Model Router — unified interface for OpenAI and Azure OpenAI
// Automatically selects provider based on available environment variables
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Provider detection
// ---------------------------------------------------------------------------

function detectProvider(service = 'embedding') {
  // For Claude (chat completions)
  if (service === 'claude') {
    const hasBedrock = !!(process.env.AWS_BEDROCK_KEY && process.env.AWS_REGION)
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
    
    if (hasBedrock) return 'bedrock'
    if (hasAnthropic) return 'anthropic'
    return null
  }
  
  // For embeddings and realtime
  const hasAzure = !!(
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_OPENAI_API_KEY
  )
  const hasOpenAI = !!process.env.OPENAI_API_KEY

  if (hasAzure) return 'azure'
  if (hasOpenAI) return 'openai'
  return null
}

// ---------------------------------------------------------------------------
// Embeddings
// ---------------------------------------------------------------------------

/**
 * Generate embeddings for text
 * @param {string} text - Text to embed
 * @param {Object} options - Optional parameters
 * @param {string} options.model - Model name (default: text-embedding-3-small)
 * @returns {Promise<{embedding: number[], latencyMs: number, totalTokens: number, provider: string}>}
 */
export async function createEmbedding(text, options = {}) {
  const t0 = Date.now()
  const provider = detectProvider()

  if (!provider) {
    throw new Error('No embedding provider configured. Set OPENAI_API_KEY or AZURE_OPENAI_* variables.')
  }

  if (provider === 'azure') {
    return createEmbeddingAzure(text, options, t0)
  } else {
    return createEmbeddingOpenAI(text, options, t0)
  }
}

async function createEmbeddingOpenAI(text, options, t0) {
  const model = options.model || 'text-embedding-3-small'

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI embedding failed: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return {
    embedding: data.data[0].embedding,
    latencyMs: Date.now() - t0,
    totalTokens: data.usage?.total_tokens || 0,
    provider: 'openai',
    model: data.model,
  }
}

async function createEmbeddingAzure(text, options, t0) {
  const deployment = process.env.AZURE_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small'
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT
  const apiVersion = options.apiVersion || '2024-02-01'

  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/embeddings?api-version=${apiVersion}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': process.env.AZURE_OPENAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Azure OpenAI embedding failed: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return {
    embedding: data.data[0].embedding,
    latencyMs: Date.now() - t0,
    totalTokens: data.usage?.total_tokens || 0,
    provider: 'azure',
    model: data.model,
    deployment,
  }
}

// ---------------------------------------------------------------------------
// Realtime (Voice)
// ---------------------------------------------------------------------------

/**
 * Create ephemeral token for Realtime API
 * @param {Object} config - Realtime session configuration
 * @param {string} config.instructions - System instructions
 * @param {string} config.voice - Voice name (default: cedar)
 * @param {Array} config.modalities - Modalities (default: ['audio', 'text'])
 * @param {Array} config.tools - Function calling tools
 * @param {Object} config.turnDetection - Turn detection config
 * @param {Object} config.inputAudioTranscription - Transcription config
 * @returns {Promise<{token: string, expiresAt: number, provider: string, model: string}>}
 */
export async function createRealtimeSession(config) {
  const provider = detectProvider()

  if (!provider) {
    throw new Error('No realtime provider configured. Set OPENAI_API_KEY or AZURE_OPENAI_* variables.')
  }

  if (provider === 'azure') {
    return createRealtimeSessionAzure(config)
  } else {
    return createRealtimeSessionOpenAI(config)
  }
}

async function createRealtimeSessionOpenAI(config) {
  const model = config.model || 'gpt-4o-realtime-preview-2024-12-17'

  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      voice: config.voice || 'alloy',
      modalities: config.modalities || ['audio', 'text'],
      instructions: config.instructions,
      tools: config.tools,
      turn_detection: config.turnDetection,
      input_audio_transcription: config.inputAudioTranscription,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI Realtime session failed: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return {
    token: data.client_secret?.value,
    expiresAt: data.client_secret?.expires_at,
    provider: 'openai',
    model,
  }
}

async function createRealtimeSessionAzure(config) {
  const deployment = process.env.AZURE_REALTIME_DEPLOYMENT || 'gpt-realtime-1.5'
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT

  // Azure Realtime uses WebSocket, not REST API for session creation
  // Return WebSocket URL and api-key for client-side connection
  const wsUrl = endpoint
    .replace('https://', 'wss://')
    .replace(/\/$/, '') + 
    `/openai/realtime?api-version=2024-10-01-preview&deployment=${deployment}`

  return {
    // For Azure, we return WebSocket URL instead of ephemeral token
    wsUrl,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    provider: 'azure',
    model: deployment,
    deployment,
    // Note: Azure doesn't provide ephemeral tokens like OpenAI
    // Client must connect directly with api-key header
  }
}

// ---------------------------------------------------------------------------
// Utility: Get active provider
// ---------------------------------------------------------------------------

/**
 * Get currently active provider
 * @param {string} service - Service type: 'embedding', 'realtime', 'claude'
 * @returns {'openai' | 'azure' | 'anthropic' | 'bedrock' | null}
 */
export function getActiveProvider(service = 'embedding') {
  return detectProvider(service)
}

/**
 * Check if embeddings are available
 * @returns {boolean}
 */
export function isEmbeddingAvailable() {
  const provider = detectProvider()
  if (!provider) return false

  if (provider === 'azure') {
    return !!process.env.AZURE_EMBEDDING_DEPLOYMENT
  }
  return true // OpenAI always has embeddings
}

/**
 * Check if realtime is available
 * @returns {boolean}
 */
export function isRealtimeAvailable() {
  const provider = detectProvider()
  if (!provider) return false

  if (provider === 'azure') {
    return !!process.env.AZURE_REALTIME_DEPLOYMENT
  }
  return true // OpenAI always has realtime
}

// ---------------------------------------------------------------------------
// Claude (Chat Completions)
// ---------------------------------------------------------------------------

/**
 * Create Claude chat completion (non-streaming)
 * @param {Object} params - Chat completion parameters
 * @param {string} params.model - Model name (e.g., 'claude-sonnet-4-6')
 * @param {number} params.max_tokens - Max tokens to generate
 * @param {Array} params.system - System messages
 * @param {Array} params.messages - Chat messages
 * @param {Array} params.tools - Function calling tools (optional)
 * @returns {Promise<Object>} - Claude response
 */
export async function createChatCompletion(params) {
  const provider = detectProvider('claude')

  if (!provider) {
    throw new Error('No Claude provider configured. Set AWS_BEDROCK_KEY or ANTHROPIC_API_KEY.')
  }

  if (provider === 'bedrock') {
    return createChatCompletionBedrock(params)
  } else {
    return createChatCompletionAnthropic(params)
  }
}

async function createChatCompletionAnthropic(params) {
  // This would use Anthropic SDK - not implemented yet
  // For now, throw error to force Bedrock usage
  throw new Error('Anthropic direct API not implemented. Use AWS Bedrock.')
}

async function createChatCompletionBedrock(params) {
  const region = process.env.AWS_REGION || 'eu-central-1'
  const apiKey = process.env.AWS_BEDROCK_KEY
  
  // Map model names to Bedrock inference profile IDs
  const modelMap = {
    'claude-sonnet-4-6': 'eu.anthropic.claude-sonnet-4-6',
    'claude-haiku-4-5-20251001': 'eu.anthropic.claude-haiku-4-5-20251001-v1:0',
  }
  
  const modelId = modelMap[params.model] || params.model
  const endpoint = `https://bedrock-runtime.${region}.amazonaws.com`
  const url = `${endpoint}/model/${modelId}/invoke`
  
  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: params.max_tokens,
    messages: params.messages,
  }
  
  if (params.system) {
    body.system = params.system
  }
  
  if (params.tools) {
    body.tools = params.tools
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Bedrock chat completion failed: ${response.status} - ${error}`)
  }
  
  const data = await response.json()
  
  return {
    ...data,
    provider: 'bedrock',
    model: modelId,
  }
}

/**
 * Create Claude chat completion stream
 * @param {Object} params - Chat completion parameters (same as createChatCompletion)
 * @returns {AsyncIterable} - Stream of events
 */
export async function createChatCompletionStream(params) {
  const provider = detectProvider('claude')

  if (!provider) {
    throw new Error('No Claude provider configured. Set AWS_BEDROCK_KEY or ANTHROPIC_API_KEY.')
  }

  if (provider === 'bedrock') {
    return createChatCompletionStreamBedrock(params)
  } else {
    return createChatCompletionStreamAnthropic(params)
  }
}

async function createChatCompletionStreamAnthropic(params) {
  throw new Error('Anthropic direct API not implemented. Use AWS Bedrock.')
}

async function* createChatCompletionStreamBedrock(params) {
  const region = process.env.AWS_REGION || 'eu-central-1'
  const apiKey = process.env.AWS_BEDROCK_KEY
  
  // Map model names
  const modelMap = {
    'claude-sonnet-4-6': 'eu.anthropic.claude-sonnet-4-6',
    'claude-haiku-4-5-20251001': 'eu.anthropic.claude-haiku-4-5-20251001-v1:0',
  }
  
  const modelId = modelMap[params.model] || params.model
  const endpoint = `https://bedrock-runtime.${region}.amazonaws.com`
  const url = `${endpoint}/model/${modelId}/invoke-with-response-stream`
  
  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: params.max_tokens,
    messages: params.messages,
  }
  
  if (params.system) {
    body.system = params.system
  }
  
  if (params.tools) {
    body.tools = params.tools
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Bedrock streaming failed: ${response.status} - ${error}`)
  }
  
  // Parse AWS event stream
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    buffer += decoder.decode(value, { stream: true })
    
    // Parse event-stream format
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    
    for (const line of lines) {
      if (line.startsWith(':event-type:')) {
        const eventType = line.split(':event-type:')[1].trim()
        continue
      }
      
      if (line.startsWith(':content-type:')) {
        continue
      }
      
      if (line.startsWith(':message-type:')) {
        continue
      }
      
      // Parse JSON chunks
      try {
        const event = JSON.parse(line)
        yield {
          type: event.type || 'content_block_delta',
          delta: event.delta,
          content_block: event.content_block,
          message: event.message,
          provider: 'bedrock',
        }
      } catch {
        // Skip non-JSON lines
      }
    }
  }
}

/**
 * Check if Claude is available
 * @returns {boolean}
 */
export function isClaudeAvailable() {
  return !!detectProvider('claude')
}
