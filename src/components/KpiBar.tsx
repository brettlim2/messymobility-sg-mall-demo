import { useAppStore } from '../store'

const METRICS = [
  { key: 'totalUsers' as const, label: 'Users', format: (v: number) => String(v) },
  { key: 'filteredUserDays' as const, label: 'User-days', format: (v: number) => String(v) },
  { key: 'avgTrips' as const, label: 'Avg trips', format: (v: number) => v.toFixed(1) },
  { key: 'avgDestinations' as const, label: 'Destinations', format: (v: number) => v.toFixed(1) },
  { key: 'stayAtHomePct' as const, label: 'Stay home', format: (v: number) => `${v.toFixed(1)}%` },
  { key: 'totalStays' as const, label: 'Stays', format: (v: number) => String(v) },
]

export function KpiBar() {
  const result = useAppStore((s) => s.result)
  const loading = useAppStore((s) => s.loading)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {METRICS.map(({ key, label, format }) => (
        <div
          key={key}
          className="rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2.5"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
            {label}
          </p>
          <p className="mt-0.5 font-mono text-lg font-semibold text-teal-300">
            {loading || !result ? '—' : format(result.kpi[key])}
          </p>
        </div>
      ))}
    </div>
  )
}
