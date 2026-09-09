import type { Corridor } from '../../demo/types'
import { useAppStore } from '../../store'
import {
  Disclaimer,
  GlassPanel,
  KeyTakeaway,
  PersonaChip,
  SectionEyebrow,
  TakeawayStat,
} from '../ui/GlassPanel'
import { ReferenceImplBanner } from './ApiComponents'

function formatCity(city: string): string {
  return city
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const STATUS_STYLES = {
  hot: 'border-rose-400/40 bg-rose-500/10 text-rose-300',
  warm: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
  watch: 'border-slate-500/40 bg-slate-500/10 text-slate-400',
}

export function SiteIntelligencePanel() {
  const demoData = useAppStore((s) => s.demoData)
  const selectedCorridor = useAppStore((s) => s.selectedCorridor)
  const setSelectedCorridor = useAppStore((s) => s.setSelectedCorridor)

  if (!demoData) {
    return (
      <GlassPanel className="p-8 text-center text-[var(--vm-muted)]">Loading demo data…</GlassPanel>
    )
  }

  const corridors = [...demoData.corridors].sort((a, b) => a.roiRank - b.roiRank)
  const active = corridors.find((c) => c.id === selectedCorridor) ?? corridors[0]

  return (
    <div className="space-y-5">
      <ReferenceImplBanner
        mode="site"
        endpoint="GET /v1/fusion/corridors?region=calabarzon&sort=forward_score_desc"
      />

      <GlassPanel variant="bright" className="p-6 lg:p-8">
        <SectionEyebrow>AyalaLand Land Bank Assessment · 60-day PoC</SectionEyebrow>
        <div className="mt-2">
          <PersonaChip persona="marco" />
        </div>
        <h2 className="mt-3 font-display text-3xl text-white lg:text-4xl">Where next?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--vm-muted)]">
          Forward-looking corridor identification — overlay foot-traffic patterns, neighborhood
          social-growth signals, and mobility trends onto candidate land parcels.
        </p>
        {active && (
          <div className="mt-4">
            <KeyTakeaway>
              <strong className="text-white">{active.name}</strong> leads with forward score{' '}
              {active.forwardScore} — ranked #{active.roiRank} ROI before competitors move.
            </KeyTakeaway>
          </div>
        )}
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {active && (
            <GlassPanel variant="bright" className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-400/80">
                    Selected corridor
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-white">{active.name}</h3>
                  <p className="mt-0.5 text-sm text-[var(--vm-muted)]">{formatCity(active.city)}</p>
                </div>
                <TakeawayStat
                  value={String(active.forwardScore)}
                  label="Forward score"
                  sub={`ROI rank #${active.roiRank}`}
                  accent="teal"
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <ScoreBar
                  label="Foot-traffic growth"
                  value={active.footTrafficGrowth}
                  max={50}
                  color="#a78bfa"
                />
                <ScoreBar label="Social growth" value={active.socialGrowth} max={50} color="#2dd4bf" />
                <ScoreBar
                  label="Mobility trend"
                  value={active.mobilityTrend}
                  max={100}
                  color="#fbbf24"
                />
              </div>
            </GlassPanel>
          )}

          <Disclaimer />
        </div>

        <GlassPanel className="p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--vm-muted)]">
            Ranked corridors
          </p>
          <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
            {corridors.map((c: Corridor) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCorridor(c.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                  c.id === active?.id
                    ? 'border-teal-400/40 bg-teal-500/[0.08] ring-1 ring-teal-400/20'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[c.status]}`}
                    >
                      {c.status}
                    </span>
                    <p className="mt-2 truncate font-medium text-white">{c.name}</p>
                    <p className="text-xs text-[var(--vm-muted)]">{formatCity(c.city)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-lg font-semibold text-teal-300">#{c.roiRank}</p>
                    <p className="text-[11px] text-[var(--vm-muted)]">{c.forwardScore} pts</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}

function ScoreBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
      <div className="mb-2 flex items-end justify-between gap-2">
        <span className="text-xs leading-tight text-[var(--vm-muted)]">{label}</span>
        <span className="shrink-0 font-mono text-sm font-semibold text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
