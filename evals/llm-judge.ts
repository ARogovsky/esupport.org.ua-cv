/**
 * LLM Judge usando Claude Haiku para evaluaciones subjetivas
 * Usa AWS Bedrock через model router (lee credenciales de .env.local)
 */

import { createClaudeClient } from '../api/_shared/claude-client.js'

// Cliente lazy - se inicializa cuando se usa, no al importar el módulo
let client: ReturnType<typeof createClaudeClient> | null = null
function getClient() {
  if (!client) {
    client = createClaudeClient()
  }
  return client
}

export interface JudgeResult {
  pass: boolean
  reason: string
}

/**
 * Usa Claude Haiku para evaluar si una respuesta cumple criterios subjetivos
 */
export async function judgeTone(
  response: string,
  criteria: string
): Promise<JudgeResult> {
  try {
    const result = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Оціни чи ця відповідь чатбота відповідає вказаному критерію.

Критерій: ${criteria}

Відповідь для оцінки:
"""
${response}
"""

Відповідай ТІЛЬКИ валідним JSON у цьому точному форматі (без markdown):
{"pass": true, "reason": "коротке пояснення чому проходить"}
або
{"pass": false, "reason": "коротке пояснення чому не проходить"}`,
        },
      ],
    })

    const text =
      result.content[0].type === 'text' ? result.content[0].text : ''

    // Limpiar posible markdown del JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()

    const parsed = JSON.parse(cleanText)
    return {
      pass: Boolean(parsed.pass),
      reason: String(parsed.reason || 'No reason provided'),
    }
  } catch (error) {
    console.error('LLM Judge error:', error)
    return {
      pass: false,
      reason: `LLM Judge error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
