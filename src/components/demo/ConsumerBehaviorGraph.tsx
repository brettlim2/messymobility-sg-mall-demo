import { useMemo, useState } from 'react'
import type { BehaviorGraphEdge, BehaviorGraphNode } from '../../demo/types'

const COLORS = {
  narrative: '#2dd4bf',
  audience: '#a78bfa',
  venue: '#fbbf24',
}

interface LayoutNode extends BehaviorGraphNode {
  x: number
  y: number
}

interface Props {
  graph: { nodes: BehaviorGraphNode[]; edges: BehaviorGraphEdge[] }
  compact?: boolean
  hero?: boolean
  animate?: boolean
}

function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

export function ConsumerBehaviorGraph({
  graph,
  compact = false,
  hero = false,
  animate = false,
}: Props) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const layout = useMemo(() => {
    const narratives = graph.nodes.filter((n) => n.type === 'narrative')
    const audiences = graph.nodes.filter((n) => n.type === 'audience')
    const venues = graph.nodes.filter((n) => n.type === 'venue')

    const w = hero ? 560 : compact ? 340 : 520
    const h = hero ? 360 : compact ? 220 : 300
    const colX = [w * 0.12, w * 0.5, w * 0.88]

    const placeCol = (items: BehaviorGraphNode[], col: number): LayoutNode[] =>
      items.map((n, i) => ({
        ...n,
        x: colX[col],
        y: 36 + ((i + 1) / (items.length + 1)) * (h - 72),
      }))

    return {
      w,
      h,
      nodes: [
        ...placeCol(narratives, 0),
        ...placeCol(audiences, 1),
        ...placeCol(venues, 2),
      ],
    }
  }, [graph, compact, hero])

  const nodeMap = new Map(layout.nodes.map((n) => [n.id, n]))

  const connectedEdges = useMemo(() => {
    if (!hoveredNode) return new Set<string>()
    const ids = new Set<string>()
    for (const e of graph.edges) {
      if (e.source === hoveredNode || e.target === hoveredNode) {
        ids.add(`${e.source}-${e.target}`)
      }
    }
    return ids
  }, [hoveredNode, graph.edges])

  const maxWeight = Math.max(...graph.edges.map((e) => e.weight), 0.1)

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--vm-muted)]">
        Consumer Behavior Graph
      </p>
      <p className="mt-0.5 text-sm text-slate-400">
        Narrative → audience → venue
        {!compact && <span className="text-slate-600"> · hover to trace paths</span>}
      </p>

      <svg
        viewBox={`0 0 ${layout.w} ${layout.h}`}
        className="mt-3 w-full"
        role="img"
        aria-label="Consumer behavior graph"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {graph.edges.map((e, i) => {
          const s = nodeMap.get(e.source)
          const t = nodeMap.get(e.target)
          if (!s || !t) return null
          const key = `${e.source}-${e.target}`
          const isHighlighted =
            hoveredEdge === key || connectedEdges.has(key) || (!hoveredEdge && !hoveredNode)
          const dimmed = (hoveredEdge || hoveredNode) && !isHighlighted
          return (
            <path
              key={key}
              d={curvePath(s.x, s.y, t.x, t.y)}
              fill="none"
              stroke={COLORS.audience}
              strokeOpacity={dimmed ? 0.08 : 0.15 + (e.weight / maxWeight) * 0.55}
              strokeWidth={1 + (e.weight / maxWeight) * 3}
              className={animate && !dimmed ? 'vm-graph-edge-pulse' : undefined}
              style={{ animationDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredEdge(key)}
              onMouseLeave={() => setHoveredEdge(null)}
            />
          )
        })}

        {layout.nodes.map((n) => {
          const r = hero ? 10 : compact ? 7 : 9
          const isConnectedToHover =
            hoveredNode &&
            graph.edges.some(
              (e) =>
                (e.source === hoveredNode && e.target === n.id) ||
                (e.target === hoveredNode && e.source === n.id),
            )
          const dimmed = Boolean(hoveredNode && hoveredNode !== n.id && !isConnectedToHover)
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.35 : 1}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r + (hoveredNode === n.id ? 3 : 0)}
                fill={COLORS[n.type]}
                fillOpacity={0.95}
                filter={hoveredNode === n.id ? 'url(#glow)' : undefined}
              />
              {(hero || !compact) && (
                <text
                  x={n.x}
                  y={n.y + r + 14}
                  textAnchor="middle"
                  fill={hoveredNode === n.id ? '#e8edf5' : '#8b9cb8'}
                  fontSize={hero ? 10 : 9}
                >
                  {n.label.length > 18 ? n.label.slice(0, 16) + '…' : n.label}
                </text>
              )}
            </g>
          )
        })}

        <text x={layout.w * 0.12} y={18} textAnchor="middle" fill="#2dd4bf" fontSize={10} fontWeight={600}>
          Narrative
        </text>
        <text x={layout.w * 0.5} y={18} textAnchor="middle" fill="#a78bfa" fontSize={10} fontWeight={600}>
          Audience
        </text>
        <text x={layout.w * 0.88} y={18} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
          Venue
        </text>
      </svg>

      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
        <span>Edge weight</span>
        <div className="flex items-center gap-1">
          <div className="h-0.5 w-3 rounded bg-violet-400/30" />
          <div className="h-0.5 w-5 rounded bg-violet-400/60" />
          <div className="h-1 w-7 rounded bg-violet-400" />
        </div>
        <span>low → high</span>
      </div>
    </div>
  )
}
