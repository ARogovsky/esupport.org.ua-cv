import { readFileSync } from 'fs'

const ukHtml = readFileSync('dist/pii-removal-roberta-ukrainska/index.html', 'utf-8')
const enHtml = readFileSync('dist/pii-removal-roberta-ukrainian/index.html', 'utf-8')

function countFaqWords(html: string, lang: string) {
  const faqBlock = html.match(/"FAQPage"[\s\S]*?"mainEntity"\s*:\s*\[([\s\S]*?)\]\s*\}/)?.[1]
  if (!faqBlock) {
    console.log(`${lang}: No FAQ found`)
    return
  }
  
  const answers = faqBlock.match(/"text"\s*:\s*"([^"]*)"/g) || []
  console.log(`\n${lang} FAQ answers:`)
  answers.forEach((ans, i) => {
    const text = ans.replace(/"text"\s*:\s*"/, '').replace(/"$/, '')
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
    console.log(`Q${i+1}: ${wordCount} words`)
    if (wordCount < 100) {
      console.log(`  ⚠️  TOO SHORT: ${text.substring(0, 100)}...`)
    }
  })
}

countFaqWords(ukHtml, 'UK')
countFaqWords(enHtml, 'EN')
