import { useAppStore } from '../store'
import { formatNumber } from '../demo/format'
import { motifEdgesForDisplay } from '../pipeline/motifs'
import { MotifGraph } from './MotifGraph'

export function MotifGallery() {
  const result = useAppStore((s) => s.result)

  if (!result) return null

  const byNodes = new Map<number, typeof result.motifCatalog>()
  for (const m of result.motifCatalog) {
    const list = byNodes.get(m.nodeCount) ?? []
    list.push(m)
    byNodes.set(m.nodeCount, list)
  }

  const nodeCounts = [...byNodes.keys()].sort((a, b) => a - b)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Daily Motif Gallery (Fig 5)</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {nodeCounts.map((nc) => {
          const top = byNodes.get(nc)?.[0]
          const edges = top?.edges.length ? top.edges : motifEdgesForDisplay(nc)
          return (
            <div
              key={nc}
              className="flex flex-col items-center rounded-xl border border-slate-700/50 bg-slate-900/60 p-3"
            >
              <MotifGraph nodeCount={nc} edges={edges} size={72} highlight={nc === 2 || nc === 3} />
              <p className="mt-2 text-xs font-medium text-slate-300">{nc}-node</p>
              <p className="text-lg font-semibold text-cyan-400">
                {top ? `${top.pct.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-xs text-slate-500">
                {top ? `${formatNumber(top.count)} weighted` : '0 weighted'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
