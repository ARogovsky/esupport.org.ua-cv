import { config } from 'dotenv'
config({ path: '.env.local' })
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { streamText, tool, generateText } from 'ai'
import { z } from 'zod'

console.log('='*80)
console.log('FULL CHAIN TEST - EXACT CODE FROM SOURCE FILES')
console.log('='*80)

// Import createEmbedding from model-router
