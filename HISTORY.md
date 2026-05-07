# Development History

## 2026-05-06: SDK Testing & Runtime Issues

### Problem
Needed to add SDK testing to `/ops` dashboard to verify AWS Bedrock credentials are set correctly.

### Investigation
1. **Initial approach**: Added SDK tests to `/api/ops/evals` endpoint
   - Used `runtime: 'nodejs'` because AWS SDK streaming requires Node.js
   - **Result**: Endpoint hung for 30+ seconds, never responded

2. **Root cause discovery**:
   - Vercel dev server has **cold start delays** with Node.js runtime (5-10 seconds)
   - Edge runtime starts **instantly**
   - AWS SDK `BedrockRuntimeClient` works in Node.js but causes delays in dev

3. **Testing**:
   - Created `test-aws-sdk-direct.js` - console script that works perfectly in Node.js
   - Streaming works fine in terminal (~2 seconds)
   - Same code in API endpoint with `runtime: 'nodejs'` hangs

### Solution
Created separate endpoint `/api/ops/test-sdk` with:
- **Runtime**: `edge` (not `nodejs`)
- **Functionality**: Only environment variable checks (no API calls)
- **Result**: Instant response, works perfectly

### Key Learnings
1. **Always use Edge runtime for API endpoints** unless absolutely necessary
2. **Node.js runtime has cold start issues** in Vercel dev server
3. **Streaming tests should run in Node.js runtime** but cause delays in dev
4. **Separate concerns**: 
   - Quick checks (env vars) → Edge runtime
   - Heavy operations (streaming) → Node.js runtime or separate script

### Files Modified
- `api/ops/test-sdk.js` - New endpoint for SDK testing (Edge runtime)
- `api/ops/evals.js` - Kept for eval results only
- `src/ops/OpsDashboard.tsx` - Updated button to call `/api/ops/test-sdk`
- `api/_shared/ops-auth.js` - Fixed to support both Edge and Node.js runtimes

### Files Created
- `test-aws-sdk-direct.js` - Console test script for AWS SDK streaming
- `api/ops/test-sdk.js` - Fast SDK testing endpoint

### Conclusion
**Edge runtime is the default choice** for Vercel API endpoints. Only use Node.js runtime when you need:
- File system access
- Native Node.js modules
- Long-running operations (but be aware of cold start delays in dev)

For this project: **All `/api/ops/*` endpoints use Edge runtime** for instant response.
