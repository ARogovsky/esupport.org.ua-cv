---
inclusion: auto
---

# AWS Bedrock Integration Rules

## CRITICAL CONSTRAINTS

### Authentication Method
- ✅ **ONLY Bearer Token**: Use `AWS_BEARER_TOKEN_BEDROCK` environment variable
- ❌ **NO AWS Credentials**: Never use `accessKeyId`, `secretAccessKey`, or `sessionToken`
- ❌ **NO fetch()**: Do not use `fetch()` for Bedrock API calls

### Implementation Requirements
- **MUST** use `@aws-sdk/client-bedrock-runtime` package
- **MUST** use `BedrockRuntimeClient` and `InvokeModelWithResponseStreamCommand`
- **MUST** allow AWS SDK to automatically read `AWS_BEARER_TOKEN_BEDROCK` from environment
- **MUST NOT** manually set or modify `process.env.AWS_BEARER_TOKEN_BEDROCK` in code

### Why These Rules Exist
1. **Security**: Bearer tokens are simpler and more secure than long-lived credentials
2. **Consistency**: AWS SDK handles token authentication automatically when configured correctly
3. **Edge Runtime**: Bearer tokens work in both Node.js and Vercel Edge Runtime
4. **No Manual Auth**: AWS SDK credential provider chain handles token lookup

## Current Implementation

### Correct Pattern (Streaming)
```javascript
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime'

async function* createChatCompletionStreamBedrock(params) {
  const region = process.env.AWS_REGION || 'eu-central-1'
  
  // AWS SDK automatically reads AWS_BEARER_TOKEN_BEDROCK
  const client = new BedrockRuntimeClient({ region })
  
  const command = new InvokeModelWithResponseStreamCommand({
    modelId,
    body: JSON.stringify(body),
  })
  
  const response = await client.send(command)
  
  for await (const event of response.body) {
    if (event.chunk?.bytes) {
      const decoded = new TextDecoder().decode(event.chunk.bytes)
      yield JSON.parse(decoded)
    }
  }
}
```

### Environment Variables
```bash
# Required
AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key
AWS_REGION=eu-central-1
```

## Troubleshooting

### "Credential is missing" Error
**Cause**: AWS SDK cannot find `AWS_BEARER_TOKEN_BEDROCK` in environment

**Check**:
1. Variable exists in `.env` file (not just `.env.local`)
2. Vercel dev server was restarted after adding variable
3. Variable is set in Vercel dashboard for production
4. No dynamic imports blocking environment access

### Test Script Works But Vercel Doesn't
**Cause**: Different environment loading between Node.js and Edge Runtime

**Solution**: Ensure variable is in `.env` file which Vercel Edge Runtime reads

## DO NOT
- ❌ Use `fetch()` with manual `Authorization: Bearer` header
- ❌ Create custom credential providers
- ❌ Use `@anthropic-ai/bedrock-sdk` (uses credentials)
- ❌ Use `@aws/bedrock-token-generator` (unnecessary complexity)
- ❌ Modify `process.env` at runtime
- ❌ Use dynamic imports for AWS SDK (use static imports)

## ALWAYS
- ✅ Use static imports: `import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'`
- ✅ Let AWS SDK read `AWS_BEARER_TOKEN_BEDROCK` automatically
- ✅ Keep authentication simple and declarative
- ✅ Test with both Node.js scripts and Vercel dev
