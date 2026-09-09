import type { SchematicFloor } from './types'
import { TEAL, DEEP, MIST, FAINT } from './palette'

// Renders a self-drawn, MessyNet-styled floor plan (viewBox 0 0 100 100) that
// stands in for an official published plan. Hotspot buttons are overlaid on top
// by the parent using the same 0–100 percentage space.
export function SchematicFloorPlan({ floor }: { floor: SchematicFloor }) {
  const outline = floor.outline ?? 'M4 4 H96 A2 2 0 0 1 98 6 V94 A2 2 0 0 1 96 96 H4 A2 2 0 0 1 2 94 V6 A2 2 0 0 1 4 4 Z'
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label="Synthetic mall floor plan" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="100" height="100" fill="var(--mn-abyss)" />
      <path d={outline} fill="var(--mn-night)" stroke={DEEP} strokeWidth="0.6" />
      {floor.corridors.map((d, i) => (
        <path key={`c-${i}`} d={d} fill="none" stroke={DEEP} strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.7" />
      ))}
      {floor.blocks.map((b, i) => (
        <g key={`b-${i}`}>
          <rect
            x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5"
            fill="var(--mn-card)"
            stroke={b.kind === 'transit' ? TEAL : b.kind === 'atrium' ? DEEP : 'var(--mn-wire)'}
            strokeWidth={b.kind === 'transit' ? 0.8 : 0.6}
          />
          <text
            x={b.x + b.w / 2} y={b.y + b.h / 2}
            fill={b.kind === 'transit' ? TEAL : MIST}
            fontSize="2.6" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600"
            textAnchor="middle" dominantBaseline="middle"
          >
            {b.label}
          </text>
        </g>
      ))}
      {floor.entrances.map((e, i) => (
        <g key={`e-${i}`}>
          <circle cx={e.x} cy={e.y} r="1.4" fill={e.kind === 'transit' ? TEAL : 'var(--mn-panel)'} stroke={e.kind === 'transit' ? TEAL : MIST} strokeWidth="0.5" />
          <text x={e.x} y={e.y - 2.6} fill={FAINT} fontSize="2.2" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">{e.label}</text>
        </g>
      ))}
    </svg>
  )
}
