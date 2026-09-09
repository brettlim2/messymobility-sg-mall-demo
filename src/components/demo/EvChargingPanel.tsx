import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EvStation } from '../../demo/types'
import { formatCompact, formatNumber } from '../../demo/format'
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

function fmtHour(h: number): string {
  const ap = h < 12 ? 'a' : 'p'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}${ap}`
}

const STATUS_STYLES = {
  hot: 'border-rose-400/40 bg-rose-500/10 text-rose-300',
  warm: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
  watch: 'border-slate-500/40 bg-slate-500/10 text-slate-400',
}

/** Recent (last-N-day) per-station rollup of the daily session feed. */
interface StationStats {
  utilization: number
  sessions: number
  avgDwellMin: number
  energyKwh: number
}

export function EvChargingPanel() {
  const demoData = useAppStore((s) => s.demoData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [daypart, setDaypart] = useState<'weekday' | 'weekend'>('weekday')

  const stations = useMemo(() => demoData?.evStations ?? [], [demoData?.evStations])
  const liveStations = useMemo(() => stations.filter((s) => s.status === 'live'), [stations])
  const candidates = useMemo(
    () =>
      stations
        .filter((s) => s.status === 'candidate')
        .sort((a, b) => (a.roiRank ?? 99) - (b.roiRank ?? 99)),
    [stations],
  )

  // Last-7-day rollup per live station
  const statsByStation = useMemo(() => {
    const map = new Map<string, StationStats>()
    const sessions = demoData?.evSessions ?? []
    for (const st of liveStations) {
      const recent = sessions.filter((s) => s.stationId === st.id).slice(-7)
      if (recent.length === 0) continue
      const n = recent.length
      map.set(st.id, {
        utilization: recent.reduce((s, x) => s + x.utilization, 0) / n,
        sessions: recent.reduce((s, x) => s + x.sessions, 0) / n,
        avgDwellMin: recent.reduce((s, x) => s + x.avgDwellMin, 0) / n,
        energyKwh: recent.reduce((s, x) => s + x.energyKwh, 0) / n,
      })
    }
    return map
  }, [demoData?.evSessions, liveStations])

  const rankedStations = useMemo(
    () =>
      [...liveStations].sort(
        (a, b) => (statsByStation.get(b.id)?.utilization ?? 0) - (statsByStation.get(a.id)?.utilization ?? 0),
      ),
    [liveStations, statsByStation],
  )

  const active: EvStation | undefined =
    rankedStations.find((s) => s.id === selectedId) ?? rankedStations[0]
  const activeStats = active ? statsByStation.get(active.id) : undefined

  // Demand curve: selected station profile, or network average when none picked
  const demandData = useMemo(() => {
    const hourly = demoData?.evHourly ?? []
    const profiles = selectedId
      ? hourly.filter((h) => h.stationId === selectedId)
      : hourly
    if (profiles.length === 0) return []
    return Array.from({ length: 24 }, (_, h) => {
      const avg =
        profiles.reduce((s, p) => s + (p[daypart][h] ?? 0), 0) / profiles.length
      return { hour: fmtHour(h), util: Math.round(avg * 1000) / 10 }
    })
  }, [demoData?.evHourly, selectedId, daypart])

  const peakHourPct = useMemo(
    () => (demandData.length ? Math.max(...demandData.map((d) => d.util)) : 0),
    [demandData],
  )

  if (!demoData) {
    return (
      <GlassPanel className="p-8 text-center text-[var(--vm-muted)]">Loading demo data…</GlassPanel>
    )
  }

  if (liveStations.length === 0) {
    return (
      <GlassPanel className="p-8 text-center text-[var(--vm-muted)]">
        EV charging dataset not found — run <code className="font-mono text-teal-300/80">npm run generate:demo</code>.
      </GlassPanel>
    )
  }

  const ev = demoData.meta.ev
  const avgUtilPct = ev
    ? Math.round(ev.avgUtilization * 100)
    : Math.round(
        ([...statsByStation.values()].reduce((s, x) => s + x.utilization, 0) /
          Math.max(1, statsByStation.size)) *
          100,
      )
  const sessionsPerDay =
    ev?.sessionsPerDay ??
    Math.round([...statsByStation.values()].reduce((s, x) => s + x.sessions, 0))
  const kwhPerDay =
    ev?.totalKwhPerDay ??
    Math.round([...statsByStation.values()].reduce((s, x) => s + x.energyKwh, 0))

  const maxSessions = Math.max(...[...statsByStation.values()].map((s) => s.sessions), 1)
  const maxEnergy = Math.max(...[...statsByStation.values()].map((s) => s.energyKwh), 1)
  const topCandidate = candidates[0]

  return (
    <div className="space-y-5">
      <ReferenceImplBanner
        mode="ev"
        endpoint="GET /v1/ev/stations?region=ncr&include=utilization"
      />

      <GlassPanel variant="bright" className="p-6 lg:p-8">
        <SectionEyebrow>VoltGrid PH Network · 70-day operations PoC</SectionEyebrow>
        <div className="mt-2">
          <PersonaChip persona="reyes" />
        </div>
        <h2 className="mt-3 font-display text-3xl text-white lg:text-4xl">Is the network keeping up?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--vm-muted)]">
          Track utilization, peak-hour demand, and energy delivered across {liveStations.length} live
          charging hubs — then use the same mobility graph to rank where to build next.
        </p>
        {topCandidate && (
          <div className="mt-4">
            <KeyTakeaway>
              Demand peaks at <strong className="text-white">{peakHourPct.toFixed(0)}%</strong> utilization on{' '}
              {daypart === 'weekday' ? 'weekdays' : 'weekends'}.{' '}
              <strong className="text-white">{topCandidate.name}</strong> is the top expansion site —
              opportunity score {topCandidate.opportunityScore} (#{topCandidate.roiRank}).
            </KeyTakeaway>
          </div>
        )}
      </GlassPanel>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TakeawayStat value={`${avgUtilPct}%`} label="Network utilization" sub="last 7 days" accent="teal" />
        <TakeawayStat value={formatNumber(sessionsPerDay)} label="Sessions / day" sub="across live hubs" accent="violet" />
        <TakeawayStat value={`${formatCompact(kwhPerDay)} kWh`} label="Energy / day" sub="delivered" accent="amber" />
        <TakeawayStat value={`${peakHourPct.toFixed(0)}%`} label="Peak-hour demand" sub={daypart} accent="rose" />
      </div>

      {/* Demand curve */}
      <GlassPanel variant="bright" className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionEyebrow>Peak-hour demand</SectionEyebrow>
            <h3 className="mt-1 font-display text-xl text-white">
              {active && selectedId ? active.name : 'Network-wide'} demand curve
            </h3>
            <p className="mt-1 text-xs text-[var(--vm-muted)]">
              Connector utilization by hour of day. {selectedId ? 'Selected hub' : 'Averaged across all live hubs'} ·
              {' '}select a hub below to drill in.
            </p>
          </div>
          <div className="inline-flex shrink-0 rounded-lg border border-white/10 bg-black/30 p-0.5">
            {(['weekday', 'weekend'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDaypart(d)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  daypart === d ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/30' : 'text-[var(--vm-muted)] hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="vm-chart-box mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
              <defs>
                <linearGradient id="evDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#8b9cb8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: '#8b9cb8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  background: '#0c1220',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#e8edf5', marginBottom: 4 }}
                formatter={(v) => [`${v}%`, 'Utilization']}
              />
              <Area
                type="monotone"
                dataKey="util"
                name="Utilization"
                stroke="#2dd4bf"
                fill="url(#evDemand)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {/* Station ranking + detail */}
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {active && (
            <GlassPanel variant="bright" className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-400/80">
                    Selected hub
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-white">{active.name}</h3>
                  <p className="mt-0.5 text-sm text-[var(--vm-muted)]">
                    {formatCity(active.city)} · {active.operator} · {active.connectors} connectors ·{' '}
                    {active.type === 'dcfc' ? `${active.powerKw} kW DC fast` : `${active.powerKw} kW AC`}
                  </p>
                </div>
                <TakeawayStat
                  value={`${Math.round((activeStats?.utilization ?? 0) * 100)}%`}
                  label="Utilization"
                  sub="last 7 days"
                  accent="teal"
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <ScoreBar
                  label="Sessions / day"
                  value={activeStats?.sessions ?? 0}
                  max={maxSessions}
                  display={formatNumber(activeStats?.sessions ?? 0)}
                  color="#a78bfa"
                />
                <ScoreBar
                  label="Avg dwell (min)"
                  value={activeStats?.avgDwellMin ?? 0}
                  max={180}
                  display={`${Math.round(activeStats?.avgDwellMin ?? 0)}m`}
                  color="#fbbf24"
                />
                <ScoreBar
                  label="Energy / day (kWh)"
                  value={activeStats?.energyKwh ?? 0}
                  max={maxEnergy}
                  display={formatCompact(Math.round(activeStats?.energyKwh ?? 0))}
                  color="#2dd4bf"
                />
              </div>
            </GlassPanel>
          )}

          {/* Expansion opportunity */}
          <GlassPanel className="p-6">
            <SectionEyebrow>Expansion opportunity</SectionEyebrow>
            <h3 className="mt-1 font-display text-xl text-white">Where to build next</h3>
            <p className="mt-1 text-xs text-[var(--vm-muted)]">
              Candidate sites ranked by fused mobility demand and charger-coverage gap — the same
              forward-looking signal used for retail siting, applied to charging infrastructure.
            </p>
            <div className="mt-4 space-y-2">
              {candidates.map((c, i) => {
                const status = i === 0 ? 'hot' : i < 3 ? 'warm' : 'watch'
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
                        >
                          {status}
                        </span>
                        <p className="mt-2 truncate font-medium text-white">{c.name}</p>
                        <p className="text-xs text-[var(--vm-muted)]">{formatCity(c.city)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-lg font-semibold text-teal-300">#{c.roiRank}</p>
                        <p className="text-[11px] text-[var(--vm-muted)]">{c.opportunityScore} pts</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <MiniStat label="Nearby demand" value={c.nearbyDemand ?? 0} suffix="" />
                      <MiniStat label="Coverage gap" value={c.coverageGap ?? 0} suffix="%" />
                      <MiniStat label="Proj. sessions/day" value={c.projectedSessionsDay ?? 0} suffix="" />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassPanel>

          <Disclaimer />
        </div>

        <GlassPanel className="p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--vm-muted)]">
            Hubs by utilization
          </p>
          <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {rankedStations.map((st) => {
              const util = statsByStation.get(st.id)?.utilization ?? 0
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedId(st.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    st.id === active?.id
                      ? 'border-teal-400/40 bg-teal-500/[0.08] ring-1 ring-teal-400/20'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{st.name}</p>
                      <p className="text-xs text-[var(--vm-muted)]">
                        {formatCity(st.city)} ·{' '}
                        <span className={st.type === 'dcfc' ? 'text-teal-300/80' : 'text-slate-400'}>
                          {st.type === 'dcfc' ? 'DC fast' : 'AC L2'}
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-base font-semibold text-teal-300">
                        {Math.round(util * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, util * 100)}%` }}
                    />
                  </div>
                </button>
              )
            })}
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
  display,
  color,
}: {
  label: string
  value: number
  max: number
  display: string
  color: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
      <div className="mb-2 flex items-end justify-between gap-2">
        <span className="text-xs leading-tight text-[var(--vm-muted)]">{label}</span>
        <span className="shrink-0 font-mono text-sm font-semibold text-white">{display}</span>
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

function MiniStat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--vm-muted)]">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-white">
        {formatNumber(value)}
        {suffix}
      </p>
    </div>
  )
}
