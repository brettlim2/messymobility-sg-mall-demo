import { useAppStore } from '../store'

export function TimeOfDayHeatmap() {
  const result = useAppStore((s) => s.result)
  if (!result) return null

  const max = Math.max(...result.hourlyActivity, 1)

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Activity by Hour (SGT)</h3>
      <div className="flex items-end gap-1" style={{ height: 80 }}>
        {result.hourlyActivity.map((count, hour) => {
          const h = (count / max) * 100
          const intensity = count / max
          return (
            <div key={hour} className="group flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${Math.max(h, 4)}%`,
                  background: `rgba(34, 211, 238, ${0.2 + intensity * 0.8})`,
                }}
                title={`${hour}:00 — ${count} pings`}
              />
              <span className="text-[9px] text-slate-500">{hour % 6 === 0 ? hour : ''}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
