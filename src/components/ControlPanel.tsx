import { useAppStore } from '../store'

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  paperRef,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
  paperRef?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-cyan-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
      {paperRef && <p className="text-xs text-slate-500">{paperRef}</p>}
    </div>
  )
}

export function ControlPanel() {
  const params = useAppStore((s) => s.params)
  const setParam = useAppStore((s) => s.setParam)
  const layers = useAppStore((s) => s.layers)
  const toggleLayer = useAppStore((s) => s.toggleLayer)
  const result = useAppStore((s) => s.result)
  const selectedMotif = useAppStore((s) => s.selectedMotif)
  const setSelectedMotif = useAppStore((s) => s.setSelectedMotif)

  const dates: string[] = result
    ? [...new Set(result.pings.map((p) => p.dayKey))].sort()
    : []

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Pipeline Controls</h2>
        <p className="text-xs text-slate-400">Jiang et al. (2015) method parameters</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">§4.1 Stay Detection</h3>
        <SliderControl
          label="Distance threshold (Δd)"
          value={params.dd}
          min={50}
          max={800}
          step={25}
          unit="m"
          onChange={(v) => setParam('dd', v)}
          paperRef="Paper default: 300m"
        />
        <SliderControl
          label="Dwell time (Δt)"
          value={params.dt}
          min={5}
          max={60}
          step={5}
          unit=" min"
          onChange={(v) => setParam('dt', v)}
          paperRef="Paper default: 10 min"
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">§4.2 Home Detection</h3>
        <SliderControl
          label="Night start"
          value={params.nightStartHour}
          min={17}
          max={23}
          step={1}
          unit=":00 SGT"
          onChange={(v) => setParam('nightStartHour', v)}
        />
        <SliderControl
          label="Night end"
          value={params.nightEndHour}
          min={4}
          max={10}
          step={1}
          unit=":00 SGT"
          onChange={(v) => setParam('nightEndHour', v)}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">§4.3 Sample Filter</h3>
        <SliderControl
          label="Min half-hour slots"
          value={params.minHalfHourSlots}
          min={2}
          max={24}
          step={1}
          onChange={(v) => setParam('minHalfHourSlots', v)}
          paperRef="Paper default: 8 of 48 slots"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={params.weekdaysOnly}
            onChange={(e) => setParam('weekdaysOnly', e.target.checked)}
            className="accent-cyan-500"
          />
          Weekdays only
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data Quality</h3>
        <SliderControl
          label="Max GPS accuracy"
          value={params.maxAccuracy}
          min={5}
          max={100}
          step={5}
          unit="m"
          onChange={(v) => setParam('maxAccuracy', v)}
        />
        <SliderControl
          label="Min circle score"
          value={params.minCircleScore}
          min={0}
          max={0.5}
          step={0.05}
          onChange={(v) => setParam('minCircleScore', v)}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date Range</h3>
        <select
          value={params.dateStart ?? ''}
          onChange={(e) => setParam('dateStart', e.target.value || null)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          <option value="">All dates (start)</option>
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={params.dateEnd ?? ''}
          onChange={(e) => setParam('dateEnd', e.target.value || null)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          <option value="">All dates (end)</option>
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">User Explorer</h3>
        <select
          value={params.selectedUserId ?? ''}
          onChange={(e) => setParam('selectedUserId', e.target.value || null)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          <option value="">All users</option>
          {(result?.users ?? []).map((u) => (
            <option key={u} value={u}>
              {u.slice(0, 8)}…
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">§5 LQ Motif</h3>
        <select
          value={selectedMotif}
          onChange={(e) => setSelectedMotif(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          {['1-node', '2-node', '3-node', '4-node', '5-node', '6-node', '7+-node'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Map Layers</h3>
        {(Object.keys(layers) as Array<keyof typeof layers>).map((layer) => (
          <label key={String(layer)} className="flex cursor-pointer items-center gap-2 text-sm capitalize text-slate-300">
            <input
              type="checkbox"
              checked={layers[layer]}
              onChange={() => toggleLayer(layer)}
              className="accent-cyan-500"
            />
            {String(layer).replace(/([A-Z])/g, ' $1').trim()}
          </label>
        ))}
      </section>
    </div>
  )
}
