---
inclusion: auto
---

# Secrets & API Keys Security Rules

## CRITICAL: Never Expose Secrets

**NEVER include actual API keys, tokens, or credentials in:**
- Code files (`.js`, `.ts`, `.tsx`, etc.)
- Documentation files (`.md`)
- Test files
- Configuration examples
- Git commits
- Any file that goes to repository

## Always Use Placeholders

### ✅ CORRECT Examples:

**In documentation:**
```bash
AWS_BEDROCK_KEY=your_bedrock_key_here
AWS_REGION=eu-central-1
AZURE_OPENAI_API_KEY=your_azure_key_here
```

**In code:**
```javascript
const apiKey = process.env.AWS_BEDROCK_KEY
if (!apiKey) throw new Error('AWS_BEDROCK_KEY required')
```

**In examples:**
```bash
# Set your credentials
export AWS_BEDROCK_KEY="<your-key>"
export AZURE_OPENAI_API_KEY="<your-key>"
```

### ❌ WRONG Examples:

```bash
# NEVER DO THIS:
AWS_BEDROCK_KEY=ABSKQmVkcm9ja0FQSUtleS14Z3MwLWF0...
AZURE_OPENAI_API_KEY=20nnxBDV92Yw8XYOMyAcYZs1NmYT6zgP...
```

## Environment Variables

**Only real secrets belong in:**
- `.env.local` (gitignored)
- Vercel environment variables (dashboard)
- User's local environment

**Documentation should show:**
- Variable names
- Example format
- Where to get the key
- NOT the actual key value

## When User Provides Keys

If user shares their keys in chat:
1. Use them for testing/configuration
2. NEVER echo them back in responses
3. NEVER write them to documentation
4. Reference by variable name: `${AWS_BEDROCK_KEY}`

## Checking Before Commit

Before any file changes, verify:
- [ ] No API keys in code
- [ ] No tokens in documentation
- [ ] Only placeholders in examples
- [ ] `.env.local` is gitignored
- [ ] Secrets referenced via `process.env.*`

## This Project's Secrets

**Never expose:**
- AWS_BEDROCK_KEY
- AZURE_OPENAI_API_KEY
- AZURE_GPT5_API_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- LANGFUSE_SECRET_KEY
- OPS_DASHBOARD_SECRET

**Always use:**
- `process.env.AWS_BEDROCK_KEY`
- `${AWS_BEDROCK_KEY}` in docs
- `your_key_here` in examples
