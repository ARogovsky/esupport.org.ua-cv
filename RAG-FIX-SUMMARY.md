# RAG Fix Summary

## Проблема
RAG система технически работает (embeddings, retrieval, reranking), но Claude НЕ использует tool `search_portfolio`.

## Root Cause
`/api/chat.js` использует custom wrapper `claude-client.js` который эмулирует Anthropic SDK API, но НЕ поддерживает правильный tool calling через Vercel AI SDK.

## Что работает ✅
1. Azure OpenAI embeddings через `model-router.js`
2. Supabase retrieval (131 documents)
3. Bedrock Haiku reranking
4. Tool calling работает в локальном тесте `test-claude-tools.js` с Vercel AI SDK

## Что НЕ работает ❌
1. Tool calling в `/api/chat.js` - Claude не вызывает `search_portfolio`
2. Evals падают потому что RAG tool не используется

## Решение
Переписать `/api/chat.js` чтобы использовать Vercel AI SDK (`streamText` / `generateText`) напрямую вместо `claude-client.js`.

### Текущая архитектура (НЕ работает):
```
api/chat.js 
  → claude-client.js (custom wrapper)
    → model-router.js (createChatCompletion/Stream)
      → Vercel AI SDK (bedrock)
```

### Нужная архитектура (работает):
```
api/chat.js
  → Vercel AI SDK (streamText/generateText) напрямую
    → bedrock() model
    → tools с tool() helper
    → stopWhen для multi-step
```

## Пример правильного кода
См. `test-claude-tools.js` - там tool calling работает:

```javascript
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { generateText, tool, stepCountIs } from 'ai'
import { z } from 'zod'

const model = bedrock('eu.anthropic.claude-sonnet-4-6', {
  region: 'eu-central-1',
})

const result = await generateText({
  model,
  tools: {
    search_portfolio: tool({
      description: 'Search portfolio...',
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        // RAG logic here
      },
    }),
  },
  stopWhen: stepCountIs(5),
  prompt: 'Tell me about GALA',
})
```

## Что нужно изменить в `/api/chat.js`

1. **Убрать** `claude-client.js` wrapper
2. **Использовать** `streamText()` из Vercel AI SDK напрямую
3. **Добавить** `tool()` helper для `search_portfolio`
4. **Добавить** `stopWhen: stepCountIs(5)` для multi-step
5. **Сохранить** всю логику:
   - Langfuse tracing
   - RAG pipeline (embedQuery, searchDocuments, rerankChunks)
   - Prompt versioning
   - Canary word leak detection
   - Source badges
   - Streaming to frontend

## Риски
- Большая переделка (200+ строк кода)
- Нужно протестировать все edge cases
- Может сломать существующий функционал

## Альтернатива
Исправить `claude-client.js` чтобы правильно передавать tools в Bedrock API, но это сложнее чем использовать Vercel AI SDK напрямую.
