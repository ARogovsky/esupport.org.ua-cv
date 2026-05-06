#!/usr/bin/env tsx
/**
 * Generate expanded FAQ content using Azure OpenAI GPT-5-pro
 * Outputs to scripts/generated-faq-{casestudy}-{lang}.json
 * 
 * Usage:
 *   npx tsx scripts/generate-faq-content.ts PerfectSquad uk
 *   npx tsx scripts/generate-faq-content.ts PerfectSquad en
 */

import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

const AZURE_ENDPOINT = process.env.AZURE_GPT5_ENDPOINT
const AZURE_API_KEY = process.env.AZURE_GPT5_API_KEY
const AZURE_DEPLOYMENT = process.env.AZURE_GPT5_DEPLOYMENT || 'gpt-5.4-pro'

if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
  console.error('❌ Missing Azure credentials in .env.local')
  console.error('   Required: AZURE_GPT5_ENDPOINT, AZURE_GPT5_API_KEY')
  process.exit(1)
}

interface FAQItem {
  q: string
  a: string
  wordCount?: number
}

function extractFAQ(i18nContent: string, lang: 'uk' | 'en'): FAQItem[] {
  // Extract FAQ section for the specified language
  const langSection = lang === 'uk' 
    ? i18nContent.match(/uk: \{[\s\S]*?faq: \{[\s\S]*?items: \[([\s\S]*?)\],[\s\S]*?\},[\s\S]*?\},\s*en: \{/)
    : i18nContent.match(/en: \{[\s\S]*?faq: \{[\s\S]*?items: \[([\s\S]*?)\],[\s\S]*?\},[\s\S]*?\},\s*\} as const/)

  if (!langSection) {
    throw new Error(`Failed to extract FAQ section for ${lang}`)
  }

  const faqItemsText = langSection[1]
  
  // Extract individual FAQ items
  const items: FAQItem[] = []
  const itemMatches = faqItemsText.matchAll(/\{\s*q:\s*['"]([^'"]+)['"]\s*,\s*a:\s*['"]([^'"]+)['"]\s*\}/gs)
  
  for (const match of itemMatches) {
    items.push({
      q: match[1],
      a: match[2],
    })
  }

  return items
}

async function generateFAQContent(
  caseStudy: string,
  lang: 'uk' | 'en',
  sourceContent: string,
  currentFAQ: FAQItem[]
): Promise<FAQItem[]> {
  console.log(`\n🤖 Generating FAQ for ${caseStudy} [${lang}]...`)

  const langName = lang === 'uk' ? 'Ukrainian' : 'English'
  const minWords = 100

  const systemPrompt = `You are a technical content writer expanding FAQ answers for a case study.

CRITICAL REQUIREMENTS:
- Each answer MUST contain MINIMUM ${minWords} words (count carefully!)
- Write in ${langName} language
- Use technical details from the source content
- Maintain professional tone
- Include specific metrics and examples
- DO NOT use markdown formatting
- DO NOT add extra questions
- ONLY expand the existing answers
- Generate AT LEAST ${minWords} words per answer`

  const expandedFAQ: FAQItem[] = []

  for (let i = 0; i < currentFAQ.length; i++) {
    const item = currentFAQ[i]
    const currentWordCount = item.a.split(/\s+/).length
    console.log(`\n  📝 Q${i + 1}/${currentFAQ.length}: "${item.q}"`)
    console.log(`     Current: ${currentWordCount} words`)

    const userPrompt = `Source content about ${caseStudy}:
${sourceContent}

Current FAQ:
Question: ${item.q}
Current Answer (${currentWordCount} words): ${item.a}

Task: Expand this answer to contain MINIMUM ${minWords} words while:
1. Adding technical details from source content
2. Including specific metrics and examples
3. Maintaining the original meaning
4. Writing in ${langName}
5. Using professional tone

IMPORTANT: Count words carefully and ensure you generate AT LEAST ${minWords} words.

Generate ONLY the expanded answer text, nothing else.`

    try {
      const response = await fetch(AZURE_ENDPOINT!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY!,
        },
        body: JSON.stringify({
          model: AZURE_DEPLOYMENT,
          input: [
            { type: 'message', role: 'system', content: systemPrompt },
            { type: 'message', role: 'user', content: userPrompt },
          ],
          max_output_tokens: 600,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      
      // Extract content from Responses API format
      const messageOutput = data.output?.find((item: any) => item.type === 'message')
      if (!messageOutput?.content?.[0]?.text) {
        throw new Error('Invalid response format from API')
      }
      
      const expandedAnswer = messageOutput.content[0].text.trim()
      const wordCount = expandedAnswer.split(/\s+/).length

      const status = wordCount >= minWords ? '✅' : '⚠️'
      console.log(`     ${status} Generated: ${wordCount} words`)

      expandedFAQ.push({
        q: item.q,
        a: expandedAnswer,
        wordCount,
      })

      // Rate limiting: wait 1 second between requests
      if (i < currentFAQ.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`     ❌ Failed: ${error}`)
      // Keep original answer on error
      expandedFAQ.push({ ...item, wordCount: currentWordCount })
    }
  }

  return expandedFAQ
}

async function main() {
  const caseStudy = process.argv[2] || 'PerfectSquad'
  const lang = (process.argv[3] || 'uk') as 'uk' | 'en'

  console.log(`\n📝 FAQ Content Generator`)
  console.log(`   Case Study: ${caseStudy}`)
  console.log(`   Language: ${lang}`)

  // Read source content
  const sourcePath = path.join(process.cwd(), 'scripts', caseStudy)
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`)
    process.exit(1)
  }

  const sourceContent = fs.readFileSync(sourcePath, 'utf-8')
  console.log(`✓ Loaded source content (${sourceContent.length} chars)`)

  // Read current i18n file
  const i18nPath = path.join(
    process.cwd(),
    'src',
    `${caseStudy.toLowerCase()}-i18n.ts`
  )
  if (!fs.existsSync(i18nPath)) {
    console.error(`❌ i18n file not found: ${i18nPath}`)
    process.exit(1)
  }

  const i18nContent = fs.readFileSync(i18nPath, 'utf-8')
  const currentFAQ = extractFAQ(i18nContent, lang)

  console.log(`✓ Loaded current FAQ (${currentFAQ.length} questions)`)

  // Generate expanded FAQ
  const expandedFAQ = await generateFAQContent(
    caseStudy,
    lang,
    sourceContent,
    currentFAQ
  )

  // Save to JSON file
  const outputPath = path.join(
    process.cwd(),
    'scripts',
    `generated-faq-${caseStudy.toLowerCase()}-${lang}.json`
  )
  fs.writeFileSync(outputPath, JSON.stringify(expandedFAQ, null, 2), 'utf-8')

  // Output results
  console.log(`\n✅ Generation complete!`)
  console.log(`📄 Saved to: ${outputPath}`)
  
  console.log(`\n📊 Word count summary:`)
  let allPass = true
  let totalWords = 0
  
  expandedFAQ.forEach((item, idx) => {
    const wordCount = item.wordCount || item.a.split(/\s+/).length
    totalWords += wordCount
    const status = wordCount >= 100 ? '✅' : '❌'
    if (wordCount < 100) allPass = false
    console.log(`${status} Q${idx + 1}: ${wordCount} words`)
  })

  const avgWords = Math.round(totalWords / expandedFAQ.length)
  console.log(`\nTotal: ${totalWords} words`)
  console.log(`Average: ${avgWords} words per answer`)
  console.log(`Status: ${allPass ? '✅ All answers ≥ 100 words' : '⚠️ Some answers < 100 words'}`)

  console.log(`\n💡 Next steps:`)
  console.log(`   1. Review: cat ${outputPath}`)
  console.log(`   2. Copy answers to ${i18nPath}`)
  console.log(`   3. Run: npm run build`)
}

main().catch(console.error)
