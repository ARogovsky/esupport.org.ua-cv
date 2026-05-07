import React from 'react'
import KpiCard from '../components/KpiCard'
import { useOpsApi } from '../hooks/useOpsApi'
import type { TabProps, OpsPromptVersion, OpsRagStats } from '../types'

const MODEL_PRICING = [
  { model: 'Claude Sonnet 4.5', input: '$3.00', output: '$15.00', use: 'Generation + Tool decision' },
  { model: 'Claude Haiku 3.5', input: '$0.80', output: '$4.00', use: 'Reranking + Scoring' },
  { model: 'text-embedding-3-small', input: '$0.02', output: '—', use: 'RAG embeddings' },
  { model: 'OpenAI Realtime (gpt-4o)', input: '$5.00', output: '$20.00', use: 'Voice mode' },
]

export default function SystemTab({ stats, loading }: TabProps) {
  const { data: promptVersions, loading: promptLoading } = useOpsApi<OpsPromptVersion[]>({
    endpoint: 'prompts',
  })
  const { data: ragStats, loading: ragLoading } = useOpsApi<OpsRagStats>({
    endpoint: 'rag-stats',
  })

  const [ragTestRunning, setRagTestRunning] = React.useState(false)
  const [ragTestResult, setRagTestResult] = React.useState<any>(null)

  const runRagTest = async () => {
    setRagTestRunning(true)
    setRagTestResult(null)
    try {
      const token = sessionStorage.getItem('ops_token')
      const response = await fetch('/api/ops/test-rag', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      setRagTestResult(data)
    } catch (error) {
      setRagTestResult({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setRagTestRunning(false)
    }
  }

  const isLoading = loading || promptLoading || ragLoading
  const activeVersion = promptVersions?.find(v => v.isActive)

  if (isLoading && !stats && !promptVersions && !ragStats) {
    return <div className="h-48 sm:h-64 bg-card border border-white/[0.06] rounded-lg animate-pulse" />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* System KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <KpiCard label="Active Prompt" value={activeVersion ? `v${activeVersion.version}` : '—'} />
        <KpiCard label="Prompt Versions" value={promptVersions?.length ?? 0} format="number" />
        <KpiCard label="RAG Chunks" value={ragStats?.totalChunks ?? 0} format="number" />
        <KpiCard label="Error Rate" value={0} format="percent" />
      </div>

      {/* Prompt versions table */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Prompt Versions</h3>
        {promptVersions && promptVersions.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Version</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Created</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Labels</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Hash</th>
                <th className="text-center text-muted-foreground py-2 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {promptVersions.map(pv => (
                <tr
                  key={pv.version}
                  className={`border-b border-white/[0.06] hover:bg-white/[0.03] ${
                    pv.isActive ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="py-2 px-2 text-foreground font-medium">v{pv.version}</td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {new Date(pv.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex flex-wrap gap-1">
                      {pv.labels.map(label => (
                        <span
                          key={label}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            label === 'production'
                              ? 'bg-green-500/20 text-green-400'
                              : label === 'latest'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground font-mono text-xs">
                    {pv.hash ? pv.hash.slice(0, 8) : '—'}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {pv.isActive ? (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full">inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-sm">
            {promptLoading ? 'Loading...' : 'No prompt versions available'}
          </div>
        )}
      </div>

      {/* RAG documents */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          RAG Documents ({ragStats?.totalChunks?.toLocaleString() ?? 0} total chunks)
        </h3>
        {ragStats?.byArticle && ragStats.byArticle.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Article</th>
                <th className="text-left text-muted-foreground py-2 px-2 font-medium">Slug</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">Chunks</th>
                <th className="text-right text-muted-foreground py-2 px-2 font-medium">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {ragStats.byArticle.map(article => (
                <tr key={article.articleId} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-foreground">{article.articleId}</td>
                  <td className="py-2 px-2 text-muted-foreground font-mono text-xs">{article.slug}</td>
                  <td className="py-2 px-2 text-right text-foreground font-medium">{article.chunkCount}</td>
                  <td className="py-2 px-2 text-right text-muted-foreground">
                    {ragStats.totalChunks > 0
                      ? ((article.chunkCount / ragStats.totalChunks) * 100).toFixed(1) + '%'
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-sm">
            {ragLoading ? 'Loading...' : 'No RAG documents indexed'}
          </div>
        )}
      </div>

      {/* RAG Debug Test */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">RAG Debug Test</h3>
          <button
            onClick={runRagTest}
            disabled={ragTestRunning}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {ragTestRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>
        
        {ragTestResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                ragTestResult.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                ragTestResult.status === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {ragTestResult.status}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(ragTestResult.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Test Results */}
            {ragTestResult.tests && (
              <div className="space-y-2">
                {ragTestResult.tests.map((test: any, idx: number) => (
                  <div key={idx} className="bg-background/50 rounded p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        test.status === 'success' ? 'bg-green-400' :
                        test.status === 'error' ? 'bg-red-400' :
                        'bg-yellow-400'
                      }`} />
                      <span className="font-medium text-foreground">{test.name}</span>
                    </div>
                    {test.details && (
                      <pre className="text-[10px] text-muted-foreground overflow-x-auto mt-1 p-2 bg-background rounded">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    )}
                    {test.error && (
                      <div className="text-red-400 text-[10px] mt-1">{test.error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Logs */}
            {ragTestResult.logs && ragTestResult.logs.length > 0 && (
              <details className="bg-background/50 rounded p-2">
                <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                  View Logs ({ragTestResult.logs.length} entries)
                </summary>
                <pre className="text-[10px] text-muted-foreground overflow-x-auto mt-2 p-2 bg-background rounded max-h-96 overflow-y-auto">
                  {ragTestResult.logs.join('\n')}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Model pricing reference */}
      <div className="bg-card border border-white/[0.06] rounded-lg p-3 sm:p-4">
        <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Model Costs Reference (per 1M tokens)</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-muted-foreground py-2 px-2 font-medium">Model</th>
              <th className="text-right text-muted-foreground py-2 px-2 font-medium">Input</th>
              <th className="text-right text-muted-foreground py-2 px-2 font-medium">Output</th>
              <th className="text-left text-muted-foreground py-2 px-2 font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_PRICING.map(m => (
              <tr key={m.model} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                <td className="py-2 px-2 text-foreground font-medium whitespace-nowrap">{m.model}</td>
                <td className="py-2 px-2 text-right text-muted-foreground">{m.input}</td>
                <td className="py-2 px-2 text-right text-muted-foreground">{m.output}</td>
                <td className="py-2 px-2 text-muted-foreground">{m.use}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
