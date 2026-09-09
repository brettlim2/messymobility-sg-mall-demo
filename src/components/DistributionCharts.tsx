import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAppStore } from '../store'
import { PAPER_MOTIF_REFERENCE, PAPER_SURVEY_REFERENCE } from '../pipeline/types'

export function MotifDistributionChart() {
  const result = useAppStore((s) => s.result)
  if (!result) return null

  const data = result.motifDistribution.map((d) => ({
    motif: d.label,
    veraset: Number(d.pct.toFixed(1)),
    paperPhone: PAPER_MOTIF_REFERENCE[d.label] ?? 0,
    paperSurvey: PAPER_SURVEY_REFERENCE[d.label] ?? 0,
  }))

  return (
    <div className="h-72">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Motif Distribution (Fig 10a)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="motif" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569' }}
            formatter={(v) => [`${v}%`, '']}
          />
          <Legend />
          <Bar dataKey="veraset" name="Singapore (Veraset)" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          <Bar dataKey="paperPhone" name="Paper (CDR)" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="paperSurvey" name="Paper (Survey)" fill="#f472b6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TripsChart() {
  const result = useAppStore((s) => s.result)
  if (!result) return null

  const data = result.tripsDistribution.slice(0, 12).map((d) => ({
    trips: d.label,
    pct: Number(d.pct.toFixed(1)),
  }))

  return (
    <div className="h-56">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Daily Trips (Fig 10b)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="trips" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
          <Bar dataKey="pct" name="Share" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DestinationsChart() {
  const result = useAppStore((s) => s.result)
  if (!result) return null

  const data = result.destinationsDistribution.map((d) => ({
    destinations: d.label,
    pct: Number(d.pct.toFixed(1)),
  }))

  return (
    <div className="h-56">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Unique Destinations (Fig 10c)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="destinations" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
          <Bar dataKey="pct" name="Share" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
