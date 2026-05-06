# Evals Update Complete - Ukrainian/Andrey Context

## Summary

Successfully updated all evaluation datasets and infrastructure from Spanish/Santiago context to Ukrainian/Andrey context.

## Files Updated

### Dataset Files (Complete Rewrite)

1. **evals/datasets/factual.json** ✅
   - 9 tests checking Andrey's factual information
   - Updated to reflect: 25 years experience, Ukraine location, GALA (85 calls/day), AI Tool Insights (16K+ tools, 100% retention)
   - Email: esupport@esupport.org.ua
   - Tech stack: Claude Sonnet 4 via AWS Bedrock

2. **evals/datasets/persona.json** ✅
   - 4 tests checking persona adherence
   - Updated to Ukrainian/English bilingual context

3. **evals/datasets/boundaries.json** ✅
   - 7 tests checking proper boundaries
   - Updated with Ukrainian context and correct contact info

4. **evals/datasets/languages.json** ✅
   - 5 tests for UK/EN bilingual behavior
   - Changed from ES/EN to UK/EN
   - Updated email and Telegram links

5. **evals/datasets/safety.json** ✅
   - 7 jailbreak/security tests
   - Updated with Ukrainian context

6. **evals/datasets/quality.json** ✅
   - 7 tests for response quality (conciseness, tone, metrics)
   - All prompts translated to Ukrainian
   - Updated conversation examples with Andrey's projects (GALA, AI Tool Insights)

7. **evals/datasets/rag.json** ✅
   - 16 tests for RAG quality (retrieval, citations, hallucinations)
   - Replaced Jacobo/Business OS references with GALA/AI Tool Insights/offzmi/SmartCourses/PII Removal
   - Updated email to esupport@esupport.org.ua
   - Updated tech stack references (Claude via AWS Bedrock, not OpenAI GPT-4)

8. **evals/datasets/multi-turn.json** ✅
   - 5 tests for conversation continuity
   - All prompts in Ukrainian
   - Updated conversation examples with Andrey's projects

9. **evals/datasets/source-badges.json** ✅
   - 6 tests for source badge accuracy
   - Updated to test GALA, AI Tool Insights, offzmi, SmartCourses, PII Removal badges
   - Changed from Spanish to Ukrainian primary language

10. **evals/datasets/voice.json** ✅
    - 6 tests for voice RAG endpoint
    - Updated to test GALA and AI Tool Insights content
    - Changed prompts to Ukrainian

### Infrastructure Files

11. **evals/assertions.ts** ✅
    - Updated `assertLanguage()` function to detect Ukrainian instead of Spanish
    - Changed from 'es' | 'en' to 'uk' | 'en'
    - Added Ukrainian common words list (я, ти, він, вона, ми, що, як, де, коли, etc.)

12. **evals/runner.ts** ✅
    - Updated header: "Santi Chatbot Evals Suite" → "Andrey Chatbot Evals Suite"
    - Changed lang type from 'es' | 'en' to 'uk' | 'en'
    - Updated production URL: santifer.io → esupport.org.ua
    - Updated test API call to use lang: 'uk'

13. **evals/README.md** ✅
    - Complete rewrite with Andrey's information
    - Updated tech stack (AWS Bedrock + Azure OpenAI)
    - Changed from ES/EN to UK/EN bilingual
    - Updated examples to Ukrainian

## Key Changes

### Personal Information
- **Name:** Santiago Fernández → Andrey Rogovsky (Андрій Роговський)
- **Location:** Seville, Spain → Ukraine
- **Email:** hola@santifer.io → esupport@esupport.org.ua
- **Website:** santifer.io → esupport.org.ua
- **Telegram:** Added https://t.me/andreyrogovsky

### Projects Referenced
- **Old:** Jacobo (AI agent), Business OS (ERP), n8n workflows, pSEO
- **New:** GALA (B2B lead generation, 85 calls/day), AI Tool Insights (16K+ tools, 100% retention), PerfectSquad (gaming traffic), SmartCourses (EdTech), Advogram (ATS validation), offzmi (MCP-browser niche discovery), PII Removal (RoBERTa for Ukrainian)

### Technical Stack
- **AI Models:** Claude via AWS Bedrock (Sonnet 4, Haiku 4) + Azure OpenAI (embeddings, realtime)
- **Languages:** Spanish/English → Ukrainian/English
- **Primary Language:** Spanish (es) → Ukrainian (uk)

### Language Detection
- Updated assertions to detect Ukrainian words instead of Spanish
- Ukrainian words: я, ти, він, вона, ми, ви, вони, це, що, як, де, коли, чому, який, яка, які, мій, твій, його, її, наш, ваш, їх, та, але, або, для, від, до, на, в, з, про, років, року, маю, має, мають

## Test Coverage

Total tests across all datasets: **68 tests**

- factual: 9 tests
- persona: 4 tests
- boundaries: 7 tests
- languages: 5 tests
- safety: 7 tests
- quality: 7 tests
- rag: 16 tests
- multi-turn: 5 tests
- source-badges: 6 tests
- voice: 6 tests

## Build Status

✅ **Build passed successfully**
- 0 errors
- 0 warnings (article validation)
- All 7 articles validated
- Sitemap generated with Ukrainian/English URLs

## Next Steps

To run the eval suite:

```bash
# Start local dev server
vercel dev

# In another terminal, run evals
npm run evals
```

Or test against production:

```bash
CHAT_API_URL=https://esupport.org.ua/api/chat npm run evals
```

## Notes

- All eval datasets now use Ukrainian as the primary language (lang: 'uk')
- English is still supported as secondary language (lang: 'en')
- RAG tests now reference Andrey's actual projects instead of Santiago's
- Voice tests updated to match new project names
- Language detection properly handles Ukrainian Cyrillic characters
- All contact information updated to esupport.org.ua domain
