interface MotifGraphProps {
  nodeCount: number
  edges: Array<[number, number]>
  size?: number
  highlight?: boolean
}

function nodePositions(n: number, size: number): Array<[number, number]> {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.32
  if (n <= 1) return [[cx, cy]]
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })
}

export function MotifGraph({ nodeCount, edges, size = 64, highlight }: MotifGraphProps) {
  const positions = nodePositions(Math.max(nodeCount, 1), size)
  const stroke = highlight ? '#22d3ee' : '#64748b'
  const fill = highlight ? '#0891b2' : '#334155'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {edges.map(([from, to], i) => {
        const [x1, y1] = positions[from - 1] ?? [0, 0]
        const [x2, y2] = positions[to - 1] ?? [0, 0]
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
            opacity={0.8}
          />
        )
      })}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={stroke} />
        </marker>
      </defs>
      {positions.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={size * 0.1} fill={fill} stroke={stroke} strokeWidth={1.5} />
      ))}
    </svg>
  )
}
