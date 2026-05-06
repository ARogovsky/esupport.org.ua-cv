#!/usr/bin/env tsx
import { advogramContent } from '../src/advogram-i18n'

function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

function analyzeFAQ(lang: 'uk' | 'en') {
  console.log(`\n=== ${lang.toUpperCase()} FAQ Analysis ===\n`)
  
  const faq = advogramContent[lang].faq.items
  let totalWords = 0
  
  faq.forEach((item, idx) => {
    const wordCount = countWords(item.a)
    totalWords += wordCount
    const status = wordCount >= 100 ? '✅' : '❌'
    console.log(`${status} Q${idx + 1}: ${wordCount} words`)
    console.log(`   "${item.q}"`)
    if (wordCount < 100) {
      console.log(`   ⚠️  Need ${100 - wordCount} more words`)
    }
    console.log()
  })
  
  const avgWords = Math.round(totalWords / faq.length)
  console.log(`Total: ${totalWords} words across ${faq.length} questions`)
  console.log(`Average: ${avgWords} words per answer`)
  console.log(`Minimum required: 100 words per answer\n`)
}

console.log('📊 Advogram FAQ Word Count Analysis')
analyzeFAQ('uk')
analyzeFAQ('en')
