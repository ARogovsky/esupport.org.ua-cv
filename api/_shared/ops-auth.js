/**
 * Shared auth helper for /api/ops/* endpoints.
 * Validates Bearer token against OPS_DASHBOARD_SECRET env var.
 */

export function validateOpsAuth(req) {
  const secret = process.env.OPS_DASHBOARD_SECRET
  if (!secret) {
    return { ok: false, response: new Response('Dashboard not configured', { status: 503 }) }
  }

  // Support both Edge Runtime (req.headers.get) and Node.js (req.headers)
  const auth = typeof req.headers.get === 'function' 
    ? req.headers.get('authorization')
    : req.headers['authorization']
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

  if (!token || token !== secret) {
    return { ok: false, response: new Response('Unauthorized', { status: 401 }) }
  }

  return { ok: true }
}

/**
 * Langfuse REST API Basic Auth header value.
 * Uses btoa() which is available in Edge Runtime.
 */
export function langfuseAuth() {
  const pk = process.env.LANGFUSE_PUBLIC_KEY
  const sk = process.env.LANGFUSE_SECRET_KEY
  if (!pk || !sk) return null
  return `Basic ${btoa(`${pk}:${sk}`)}`
}

export function langfuseBaseUrl() {
  return process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
}
