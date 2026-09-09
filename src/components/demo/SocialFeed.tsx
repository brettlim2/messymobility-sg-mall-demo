import type { Narrative } from '../../demo/types'

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
  instagram: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300',
  facebook: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
  x: 'border-slate-400/30 bg-slate-500/10 text-slate-300',
}

interface Props {
  narratives: Narrative[]
  narrativeId?: string
}

export function SocialFeed({ narratives, narrativeId }: Props) {
  const posts = narratives
    .filter((n) => !narrativeId || n.id === narrativeId)
    .flatMap((n) =>
      n.samplePosts.map((p) => ({
        ...p,
        narrative: n.label,
        brand: n.brand,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--vm-muted)]">
        Live social signal
      </p>
      <p className="mt-0.5 text-sm font-medium text-white">MessyNet narrative feed</p>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {posts.map((p, i) => (
          <article
            key={`${p.platform}-${p.date}-${i}`}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PLATFORM_COLORS[p.platform] ?? 'border-slate-600 bg-slate-800 text-slate-300'}`}
              >
                {p.platform}
              </span>
              <span className="shrink-0 text-[11px] text-slate-600">{p.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{p.text}</p>
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate text-[var(--vm-muted)]">{p.narrative}</span>
              <span
                className={`shrink-0 font-mono font-medium ${p.sentiment > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {p.sentiment > 0 ? '+' : ''}
                {(p.sentiment * 100).toFixed(0)}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
