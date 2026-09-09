import type { Campaign, Corridor, DemoData } from '../../demo/types'
import { formatPct } from '../../demo/analytics'
import { GlassPanel, TakeawayStat } from '../ui/GlassPanel'
import { CodeBlock } from './ApiComponents'
import { ConsumerBehaviorGraph } from './ConsumerBehaviorGraph'
import type { AppMode } from '../../demo/types'

interface Props {
  beatIndex: number
  demoData: DemoData | null
  campaign: Campaign | undefined
  topCorridor: Corridor | undefined
  isActive: boolean
  onNavigate: (mode: AppMode) => void
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
    <div className="rounded-lg border border-white/[0.05] bg-black/25 p-3">
      <div className="mb-1.5 flex items-end justify-between gap-2">
        <span className="text-[11px] text-[var(--vm-muted)]">{label}</span>
        <span className="font-mono text-sm font-semibold text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export function StoryBeatVisual({
  beatIndex,
  demoData,
  campaign,
  topCorridor,
  isActive,
  onNavigate,
}: Props) {
  const baseClass = `transition-all duration-500 ${
    isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
  }`

  if (beatIndex === 0) {
    return (
      <GlassPanel className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-400/80">
          Coverage
        </p>
        <h3 className="mt-2 font-display text-2xl text-white lg:text-3xl">NCR + CALABARZON</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--vm-muted)]">
          Metro Manila retail corridors, candidate land parcels, and fused social–mobility signal
          across 70 days of synthetic demo data.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <TakeawayStat value="48" label="Mobility users" sub="GPS pipeline" accent="teal" />
          <TakeawayStat value="15" label="Venues" sub="retail + candidates" accent="violet" />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Map highlights the region — zoom follows each story beat.
        </p>
      </GlassPanel>
    )
  }

  if (beatIndex === 1) {
    return (
      <GlassPanel className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-400/80">
          The gap
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">Three silos. One answer.</h3>
        <div className="mt-6 space-y-3">
          {[
            { label: 'Social listening', sub: 'Stops at engagement', color: 'border-violet-400/30 bg-violet-500/10' },
            { label: 'Mobility data', sub: 'No narrative layer', color: 'border-amber-400/30 bg-amber-500/10' },
            { label: 'Manual stitching', sub: 'Weeks to an answer', color: 'border-slate-500/30 bg-slate-500/10' },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border px-4 py-3 ${item.color}`}
            >
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-[var(--vm-muted)]">{item.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-lg text-slate-600">↓</p>
        <p className="text-center text-sm font-medium text-rose-300/90">Still too late for the decision</p>
      </GlassPanel>
    )
  }

  if (beatIndex === 2) {
    return (
      <div className={`grid gap-4 ${baseClass}`}>
        <GlassPanel className="border-violet-400/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400/80">CMO view</p>
          <h3 className="mt-2 font-display text-xl text-white">Did the campaign work?</h3>
          <p className="mt-2 text-sm text-[var(--vm-muted)]">
            Needs causal proof linking social buzz to store visits — not just impressions.
          </p>
        </GlassPanel>
        <GlassPanel className="border-amber-400/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">Strategy view</p>
          <h3 className="mt-2 font-display text-xl text-white">Where should we build next?</h3>
          <p className="mt-2 text-sm text-[var(--vm-muted)]">
            Needs forward-looking corridor scores before competitors move on land parcels.
          </p>
        </GlassPanel>
        <p className="text-center text-xs text-teal-400/80">One platform. Both questions.</p>
      </div>
    )
  }

  if (beatIndex === 3 && demoData) {
    return (
      <GlassPanel className={`overflow-hidden p-4 lg:p-5 ${baseClass}`}>
        <ConsumerBehaviorGraph graph={demoData.behaviorGraph} hero animate />
      </GlassPanel>
    )
  }

  if (beatIndex === 4) {
    return (
      <GlassPanel className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-400/80">
          Architecture
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-violet-200">
            MessyNet
          </span>
          <span className="text-slate-600">+</span>
          <span className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-amber-200">
            Mobility
          </span>
          <span className="text-slate-600">→</span>
          <span className="rounded-lg border border-teal-400/30 bg-teal-500/15 px-3 py-1.5 font-medium text-teal-200">
            Fusion
          </span>
          <span className="text-slate-600">→</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white">
            REST API
          </span>
        </div>
        <div className="mt-6">
          <CodeBlock label="Example response">
            {`{ "lift_pct": 21.0, "causal_lag_days": 3.2, "confidence": 91 }`}
          </CodeBlock>
        </div>
      </GlassPanel>
    )
  }

  if (beatIndex === 5 && campaign) {
    return (
      <GlassPanel variant="bright" className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-400/80">
          Attribution proof
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">{campaign.name}</h3>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TakeawayStat value={formatPct(campaign.liftPct)} label="Lift" sub="vs baseline" accent="teal" />
          <TakeawayStat
            value={`${campaign.causalLagDays}d`}
            label="Causal lag"
            sub="buzz → footfall"
            accent="violet"
          />
          <TakeawayStat
            value={`${campaign.confidence}%`}
            label="Confidence"
            sub="fusion model"
            accent="amber"
          />
        </div>
        <p className="mt-4 text-xs text-[var(--vm-muted)]">
          Map shows footfall uplift halos at campaign target venues.
        </p>
      </GlassPanel>
    )
  }

  if (beatIndex === 6 && topCorridor) {
    return (
      <GlassPanel variant="bright" className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400/80">
          Top corridor
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">{topCorridor.name}</h3>
        <p className="mt-1 text-sm capitalize text-[var(--vm-muted)]">{topCorridor.city}</p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-4xl text-amber-300">{topCorridor.forwardScore}</span>
          <span className="text-sm text-[var(--vm-muted)]">forward score · ROI #{topCorridor.roiRank}</span>
        </div>
        <div className="mt-6 space-y-3">
          <ScoreBar label="Foot-traffic growth" value={topCorridor.footTrafficGrowth} max={50} color="#a78bfa" />
          <ScoreBar label="Social growth" value={topCorridor.socialGrowth} max={50} color="#2dd4bf" />
          <ScoreBar label="Mobility trend" value={topCorridor.mobilityTrend} max={100} color="#fbbf24" />
        </div>
      </GlassPanel>
    )
  }

  if (beatIndex === 7) {
    const ev = demoData?.meta.ev
    const candidates = (demoData?.evStations ?? [])
      .filter((s) => s.status === 'candidate')
      .sort((a, b) => (a.roiRank ?? 99) - (b.roiRank ?? 99))
    const top = candidates[0]
    return (
      <GlassPanel variant="bright" className={`p-6 lg:p-8 ${baseClass}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/80">
          EV network ops
        </p>
        <h3 className="mt-2 font-display text-2xl text-white">VoltGrid PH</h3>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TakeawayStat
            value={ev ? `${Math.round(ev.avgUtilization * 100)}%` : '—'}
            label="Utilization"
            sub="live network"
            accent="teal"
          />
          <TakeawayStat
            value={ev ? String(ev.liveStations) : '—'}
            label="Live hubs"
            sub="NCR"
            accent="violet"
          />
          <TakeawayStat
            value={ev ? String(ev.candidateSites) : '—'}
            label="Candidate sites"
            sub="ranked"
            accent="amber"
          />
        </div>
        {top && (
          <div className="mt-5">
            <ScoreBar label={`Top site — ${top.name}`} value={top.opportunityScore ?? 0} max={130} color="#34d399" />
          </div>
        )}
        <p className="mt-4 text-xs text-[var(--vm-muted)]">
          Map shows live hubs by utilization + candidate-corridor opportunity.
        </p>
      </GlassPanel>
    )
  }

  if (beatIndex === 8) {
    const dives: { mode: AppMode; label: string; sub: string }[] = [
      { mode: 'api', label: 'API catalog', sub: 'The product' },
      { mode: 'attribution', label: 'CMO view', sub: 'Campaign attribution' },
      { mode: 'site', label: 'Strategy view', sub: 'Site intelligence' },
      { mode: 'ev', label: 'Network ops view', sub: 'EV charging' },
      { mode: 'analyst', label: 'Data science view', sub: 'Mobility pipeline' },
    ]
    return (
      <div className={`grid gap-3 sm:grid-cols-2 ${baseClass}`}>
        {dives.map((d) => (
          <button
            key={d.mode}
            type="button"
            onClick={() => onNavigate(d.mode)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition hover:border-teal-400/30 hover:bg-teal-500/[0.06]"
          >
            <p className="text-sm font-semibold text-white">{d.label}</p>
            <p className="mt-0.5 text-xs text-[var(--vm-muted)]">{d.sub}</p>
            <span className="mt-2 inline-block text-xs font-medium text-teal-400">Explore →</span>
          </button>
        ))}
      </div>
    )
  }

  return null
}
