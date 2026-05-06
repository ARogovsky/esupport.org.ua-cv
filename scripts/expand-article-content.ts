#!/usr/bin/env tsx
/**
 * Expand article content using Azure OpenAI GPT-5-pro
 * Generates additional paragraphs to reach 1500-word minimum
 * Outputs to scripts/expanded-content-{casestudy}-{lang}.txt
 * 
 * Usage:
 *   npx tsx scripts/expand-article-content.ts PerfectSquad uk
 *   npx tsx scripts/expand-article-content.ts PerfectSquad en
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

interface ContentExpansion {
  section: string
  content: string
  wordCount: number
}

async function generateContent(
  caseStudy: string,
  lang: 'uk' | 'en',
  sourceContent: string,
  currentWordCount: number,
  targetWordCount: number
): Promise<ContentExpansion[]> {
  console.log(`\n🤖 Generating content expansion for ${caseStudy} [${lang}]...`)
  console.log(`   Current: ${currentWordCount} words`)
  console.log(`   Target: ${targetWordCount} words`)
  console.log(`   Need: ${targetWordCount - currentWordCount} words`)

  const langName = lang === 'uk' ? 'Ukrainian' : 'English'
  const wordsNeeded = targetWordCount - currentWordCount

  const systemPrompt = `You are a technical content writer expanding case study articles.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${wordsNeeded} words of additional content
- Write in ${langName} language
- Use technical details from the source content
- Maintain professional tone
- Include specific metrics and examples
- Focus on technical implementation details
- DO NOT use markdown formatting
- Write in paragraph form, ready to insert into article

Content should expand on:
1. Technical architecture and implementation details
2. Specific challenges and how they were solved
3. Metrics and results with context
4. Lessons learned and insights
5. Comparison with similar approaches`

  const userPrompt = `Source content about ${caseStudy}:
${sourceContent}

Current article has ${currentWordCount} words. Target is ${targetWordCount} words.

Task: Generate ${wordsNeeded} words of additional content that:
1. Expands on technical implementation details
2. Adds context to metrics and results
3. Explains challenges and solutions
4. Provides insights and lessons learned
5. Maintains consistency with existing content

Write in ${langName}. Generate EXACTLY ${wordsNeeded} words.

Output format:
Provide 2-3 paragraphs of content, each focusing on a different aspect (technical details, results analysis, or insights). Each paragraph should be 50-100 words.`

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
        max_output_tokens: Math.ceil(wordsNeeded * 1.5), // Allow some buffer
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    
    console.log('   📋 API Response:', JSON.stringify(data, null, 2).substring(0, 500))
    
    // Extract content from Responses API format
    const messageOutput = data.output?.find((item: any) => item.type === 'message')
    if (!messageOutput?.content?.[0]?.text) {
      throw new Error('Invalid response format from API')
    }
    
    const generatedContent = messageOutput.content[0].text.trim()
    const wordCount = generatedContent.split(/\s+/).length

    console.log(`   ✅ Generated: ${wordCount} words`)

    // Split into paragraphs
    const paragraphs = generatedContent
      .split(/\n\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string, idx: number) => ({
        section: `Paragraph ${idx + 1}`,
        content: p.trim(),
        wordCount: p.trim().split(/\s+/).length,
      }))

    return paragraphs
  } catch (error) {
    console.error(`   ❌ Failed: ${error}`)
    throw error
  }
}

async function main() {
  const caseStudy = process.argv[2] || 'PerfectSquad'
  const lang = (process.argv[3] || 'uk') as 'uk' | 'en'

  console.log(`\n📝 Article Content Expander`)
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

  // Get current word count from build output
  // For PerfectSquad: UK=1369, EN=1408
  const currentWordCounts: Record<string, Record<string, number>> = {
    perfectsquad: { uk: 1369, en: 1408 },
    smartcourses: { uk: 1218, en: 1254 },
    'ai-tools': { uk: 923, en: 956 },
    gala: { uk: 892, en: 945 },
    'pii-removal': { uk: 929, en: 949 },
  }

  const caseKey = caseStudy.toLowerCase()
  const currentWordCount = currentWordCounts[caseKey]?.[lang]

  if (!currentWordCount) {
    console.error(`❌ No word count data for ${caseStudy} [${lang}]`)
    console.error(`   Available: ${Object.keys(currentWordCounts).join(', ')}`)
    process.exit(1)
  }

  const targetWordCount = 1500

  if (currentWordCount >= targetWordCount) {
    console.log(`✅ Article already meets target (${currentWordCount} ≥ ${targetWordCount})`)
    process.exit(0)
  }

  // Generate expanded content
  const expansions = await generateContent(
    caseStudy,
    lang,
    sourceContent,
    currentWordCount,
    targetWordCount
  )

  // Save to file
  const outputPath = path.join(
    process.cwd(),
    'scripts',
    `expanded-content-${caseStudy.toLowerCase()}-${lang}.txt`
  )

  const output = [
    `# Expanded Content for ${caseStudy} [${lang}]`,
    ``,
    `Current word count: ${currentWordCount}`,
    `Target word count: ${targetWordCount}`,
    `Words needed: ${targetWordCount - currentWordCount}`,
    ``,
    `---`,
    ``,
    ...expansions.flatMap((exp) => [
      `## ${exp.section} (${exp.wordCount} words)`,
      ``,
      exp.content,
      ``,
    ]),
  ].join('\n')

  fs.writeFileSync(outputPath, output, 'utf-8')

  // Output results
  console.log(`\n✅ Generation complete!`)
  console.log(`📄 Saved to: ${outputPath}`)

  console.log(`\n📊 Generated content:`)
  let totalWords = 0
  expansions.forEach((exp) => {
    totalWords += exp.wordCount
    console.log(`   ${exp.section}: ${exp.wordCount} words`)
  })

  console.log(`\nTotal generated: ${totalWords} words`)
  console.log(`New total: ${currentWordCount + totalWords} words`)

  const status =
    currentWordCount + totalWords >= targetWordCount
      ? '✅ Meets target'
      : '⚠️ Still below target'
  console.log(`Status: ${status}`)

  console.log(`\n💡 Next steps:`)
  console.log(`   1. Review: cat ${outputPath}`)
  console.log(`   2. Choose where to insert paragraphs in the article`)
  console.log(`   3. Update src/${caseStudy.toLowerCase()}-i18n.ts`)
  console.log(`   4. Run: npm run build`)
}

main().catch(console.error)
