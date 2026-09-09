import { useMemo } from 'react'
import { useAppStore } from '../store'
import { MotifGraph } from './MotifGraph'

export function UserExplorer() {
  const result = useAppStore((s) => s.result)
  const selectedUserId = useAppStore((s) => s.params.selectedUserId)

  const userData = useMemo(() => {
    if (!result || !selectedUserId) return null
    const stays = result.staysByUser[selectedUserId] ?? []
    const home = result.homes[selectedUserId]
    const days = result.userDays.filter((d) => d.adId === selectedUserId)
    const pings = result.pings.filter((p) => p.adId === selectedUserId)
    return { stays, home, days, pings }
  }, [result, selectedUserId])

  if (!selectedUserId) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
        Select a user in the control panel to explore their trajectory and motifs
      </div>
    )
  }

  if (!userData) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">User Explorer</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-800/60 p-3">
          <p className="text-xs text-slate-400">Pings</p>
          <p className="text-xl font-semibold text-white">{userData.pings.length}</p>
        </div>
        <div className="rounded-lg bg-slate-800/60 p-3">
          <p className="text-xs text-slate-400">Stays</p>
          <p className="text-xl font-semibold text-white">{userData.stays.length}</p>
        </div>
        <div className="rounded-lg bg-slate-800/60 p-3">
          <p className="text-xs text-slate-400">Active Days</p>
          <p className="text-xl font-semibold text-white">{userData.days.length}</p>
        </div>
      </div>

      {userData.home && (
        <p className="text-xs text-slate-400">
          Home: <span className="text-cyan-400">{userData.home.city}</span> ({userData.home.nightVisits}{' '}
          night visits)
        </p>
      )}

      <div className="max-h-48 space-y-2 overflow-y-auto">
        {userData.days.map((day) => (
          <div
            key={day.dayKey}
            className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 p-2"
          >
            <MotifGraph nodeCount={day.nodeCount} edges={day.edges} size={48} highlight />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200">{day.dayKey}</p>
              <p className="text-xs text-slate-400">
                {day.nodeCount} destinations · {day.tripCount} trips · {day.motifLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
