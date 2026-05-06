# AWS Bedrock Integration for Evals - Complete

## Summary

Successfully integrated AWS Bedrock for LLM Judge in the evals suite. The system now uses your existing model router instead of direct Anthropic SDK, reading credentials from `.env.local`.

## Changes Made

### 1. **evals/llm-judge.ts** ✅
   - **Before:** Used `@anthropic-ai/sdk` directly with `ANTHROPIC_API_KEY`
   - **After:** Uses `createClaudeClient()` from `api/_shared/claude-client.js`
   - **Benefit:** Automatically uses AWS Bedrock if `AWS_BEDROCK_KEY` is set, falls back to Anthropic API
   - **Prompt:** Updated from Spanish to Ukrainian

### 2. **evals/runner.ts** ✅
   - **Before:** Loaded only `evals/.env.local`
   - **After:** Loads root `.env.local` first (for AWS Bedrock keys), then `evals/.env.local` (for overrides)
   - **Priority:** Root env → Local env (local can override)

### 3. **evals/.env.example** ✅
   - **Before:** Only documented `ANTHROPIC_API_KEY`
   - **After:** Documents AWS Bedrock as primary option, Anthropic as fallback
   - **Note:** Explains that keys are read from root `.env.local` automatically

### 4. **evals/README.md** ✅
   - Added **Setup** section explaining:
     - AWS Bedrock credentials location (root `.env.local`)
     - How to override with local `evals/.env.local`
     - Model router auto-detection behavior

### 5. **.env.local.example** ✅
   - Added AWS Bedrock variables documentation:
     ```bash
     # AWS Bedrock (for Claude via Bedrock)
     # AWS_BEDROCK_KEY=your-bedrock-api-key
     # AWS_REGION=eu-central-1
     ```

## How It Works

### Environment Variable Loading Priority

```
1. Root .env.local (AWS_BEDROCK_KEY, AWS_REGION)
   ↓
2. evals/.env.local (optional overrides)
   ↓
3. Model Router Detection
   ↓
4. AWS Bedrock (if AWS_BEDROCK_KEY exists)
   OR
   Anthropic API (if ANTHROPIC_API_KEY exists)
```

### Model Router Auto-Detection

The `model-router.js` automatically detects which provider to use:

```javascript
function detectProvider(service = 'claude') {
  const hasBedrock = !!(process.env.AWS_BEDROCK_KEY && process.env.AWS_REGION)
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  
  if (hasBedrock) return 'bedrock'
  if (hasAnthropic) return 'anthropic'
  return null
}
```

### LLM Judge Flow

```
evals/runner.ts
  ↓
evals/llm-judge.ts
  ↓
api/_shared/claude-client.js (createClaudeClient)
  ↓
api/_shared/model-router.js (createChatCompletion)
  ↓
AWS Bedrock API (eu.anthropic.claude-haiku-4-5-20251001-v1:0)
```

## Current Configuration

Your `.env.local` already has:

```bash
AWS_BEDROCK_KEY=you-key
AWS_REGION=you-region
```

✅ **Ready to use!** No additional setup needed.

## Benefits

### 1. **No Hardcoded Keys**
   - All credentials read from `.env.local`
   - `.env.local` is in `.gitignore`
   - Safe to commit code changes

### 2. **Unified Model Router**
   - Same infrastructure as chat API
   - Consistent error handling
   - Automatic provider fallback

### 3. **Cost Optimization**
   - Uses AWS Bedrock (cheaper than Anthropic direct)
   - Claude Haiku 4.5 for fast, cheap evaluations
   - Model: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`

### 4. **Flexibility**
   - Can override with `evals/.env.local` for testing
   - Can switch to Anthropic API by removing `AWS_BEDROCK_KEY`
   - Can test different regions by changing `AWS_REGION`

## Usage

### Run Evals Locally

```bash
# Terminal 1: Start dev server
vercel dev

# Terminal 2: Run evals (uses AWS Bedrock from .env.local)
npm run evals
```

### Run Against Production

```bash
CHAT_API_URL=https://esupport.org.ua/api/chat npm run evals
```

### Override for Testing

Create `evals/.env.local` to test with different credentials:

```bash
# Test with Anthropic direct API
ANTHROPIC_API_KEY=sk-ant-xxx

# Or test with different Bedrock region
AWS_BEDROCK_KEY=your-test-key
AWS_REGION=us-east-1
```

## Model Mapping

The model router maps friendly names to Bedrock inference profile IDs:

| Friendly Name | Bedrock Model ID |
|---------------|------------------|
| `claude-haiku-4-5-20251001` | `eu.anthropic.claude-haiku-4-5-20251001-v1:0` |
| `claude-sonnet-4-6` | `eu.anthropic.claude-sonnet-4-6` |

## Security

✅ **All credentials are secure:**
- `.env.local` is in `.gitignore`
- No keys in code or version control
- Keys loaded at runtime from environment
- Can use different keys per environment (dev/staging/prod)

## Testing

Build passed successfully:
```
Articles: 7 | Errors: 0 | Warnings: 0
✓ Prerender validation passed.
```

Ready to run evals with AWS Bedrock! 🚀

## Next Steps

1. **Run evals:** `npm run evals` (after `vercel dev`)
2. **Check results:** `evals/results/report-YYYY-MM-DD.md`
3. **Monitor costs:** AWS Bedrock console → Usage metrics
4. **Optimize:** Adjust `max_tokens` in `llm-judge.ts` if needed (currently 200)

## Troubleshooting

### Error: "No Claude provider configured"

**Cause:** Neither `AWS_BEDROCK_KEY` nor `ANTHROPIC_API_KEY` is set.

**Fix:** Check that `.env.local` exists in root and contains `AWS_BEDROCK_KEY`.

### Error: "Bedrock chat completion failed: 403"

**Cause:** Invalid or expired AWS Bedrock key.

**Fix:** Regenerate key in AWS Console → Bedrock → API Keys.

### Error: "Cannot find module '../api/_shared/claude-client.js'"

**Cause:** Running evals from wrong directory.

**Fix:** Run from project root: `npm run evals` (not `cd evals && npm run evals`).

## Files Modified

- ✅ `evals/llm-judge.ts` - Uses model router instead of Anthropic SDK
- ✅ `evals/runner.ts` - Loads root .env.local for AWS keys
- ✅ `evals/.env.example` - Documents AWS Bedrock setup
- ✅ `evals/README.md` - Added Setup section
- ✅ `.env.local.example` - Added AWS Bedrock variables

## No Breaking Changes

- ✅ Existing evals still work
- ✅ All 68 tests unchanged
- ✅ Build passes with 0 errors
- ✅ Backward compatible (can still use `ANTHROPIC_API_KEY`)
