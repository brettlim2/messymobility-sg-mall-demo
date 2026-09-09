import { buildDayStaySequence } from './stays'
import type { FilteredUserDay } from './filter'
import type { Stay, UserDayMotif, UserHome } from './types'

/**
 * Section 4.4: Extract daily mobility motifs as directed graph equivalence classes.
 */
export function extractMotifsForUserDays(
  filteredDays: FilteredUserDay[],
  staysByUser: Record<string, Stay[]>,
  homes: Record<string, UserHome>,
  dd: number,
): UserDayMotif[] {
  return filteredDays.map((day) => {
    const stays = staysByUser[day.adId] ?? []
    const home = homes[day.adId]
    let sequence = buildDayStaySequence(day.pings, stays, dd)

    if (home) {
      if (sequence.length === 0 || sequence[0] !== home.locationId) {
        sequence = [home.locationId, ...sequence]
      }
      if (sequence[sequence.length - 1] !== home.locationId) {
        sequence = [...sequence, home.locationId]
      }
    }

    const collapsed = collapseConsecutive(sequence)
    const { nodeCount, tripCount, edges, signature, motifId, motifLabel } =
      classifyMotif(collapsed)

    return {
      adId: day.adId,
      dayKey: day.dayKey,
      isWeekend: day.isWeekend,
      homeLocationId: home?.locationId ?? '',
      staySequence: collapsed,
      tripCount,
      nodeCount,
      motifSignature: signature,
      motifLabel,
      motifId,
      edges,
      expansionWeight: 1,
    }
  })
}

function collapseConsecutive(seq: string[]): string[] {
  const out: string[] = []
  for (const loc of seq) {
    if (out.length === 0 || out[out.length - 1] !== loc) out.push(loc)
  }
  return out
}

function classifyMotif(sequence: string[]): {
  nodeCount: number
  tripCount: number
  edges: Array<[number, number]>
  signature: string
  motifId: string
  motifLabel: string
} {
  const uniqueNodes = [...new Set(sequence)]
  const nodeCount = uniqueNodes.length

  // Full isomorphism search is only feasible for small graphs (paper buckets at 7+).
  if (nodeCount > 7) {
    const tripCount = Math.max(0, sequence.length - 1)
    return {
      nodeCount,
      tripCount,
      edges: [],
      signature: `7+:${nodeCount}`,
      motifId: `7plus${String(nodeCount).padStart(3, '0')}`,
      motifLabel: '7+-node',
    }
  }

  const indexMap = new Map(uniqueNodes.map((id, i) => [id, i + 1]))

  const edges: Array<[number, number]> = []
  for (let i = 0; i < sequence.length - 1; i++) {
    const from = indexMap.get(sequence[i])!
    const to = indexMap.get(sequence[i + 1])!
    if (from !== to) edges.push([from, to])
  }

  const tripCount = edges.length
  const adj = buildAdjacency(nodeCount, edges)
  const signature = canonicalSignature(nodeCount, adj)
  const motifId = encodeMotifId(nodeCount, adj)
  const motifLabel = `${nodeCount}-node`

  return { nodeCount, tripCount, edges, signature, motifId, motifLabel }
}

function buildAdjacency(n: number, edges: Array<[number, number]>): boolean[][] {
  const adj = Array.from({ length: n }, () => Array(n).fill(false))
  for (const [from, to] of edges) {
    adj[from - 1][to - 1] = true
  }
  return adj
}

/** Canonical form via brute-force permutation for small n (<=7) */
function canonicalSignature(n: number, adj: boolean[][]): string {
  if (n === 0) return '0'
  if (n === 1) return '1:'

  const arr = Array.from({ length: n }, (_, i) => i)
  const c = Array(n).fill(0)
  let best: string | null = null

  const visit = () => {
    const edges: string[] = []
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (adj[i][j]) edges.push(`${arr[i] + 1}->${arr[j] + 1}`)
      }
    }
    edges.sort()
    const sig = `${n}:${edges.join(',')}`
    if (best === null || sig < best) best = sig
  }

  visit()
  let i = 1
  while (i < n) {
    if (c[i] < i) {
      if (i % 2 === 0) {
        ;[arr[0], arr[i]] = [arr[i], arr[0]]
      } else {
        ;[arr[c[i]], arr[i]] = [arr[i], arr[c[i]]]
      }
      visit()
      c[i]++
      i = 1
    } else {
      c[i] = 0
      i++
    }
  }

  return best ?? `${n}:`
}

function encodeMotifId(n: number, adj: boolean[][]): string {
  if (n <= 1) return '1000'
  let edgeCode = 0
  let bit = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (adj[i][j]) edgeCode += 2 ** bit
      bit++
    }
  }
  return `${n}${String(edgeCode).padStart(3, '0')}`
}

export function motifEdgesForDisplay(nodeCount: number): Array<[number, number]> {
  if (nodeCount <= 1) return []
  if (nodeCount === 2) return [[1, 2], [2, 1]]
  if (nodeCount === 3) return [[1, 2], [2, 3], [3, 1]]
  const edges: Array<[number, number]> = []
  for (let i = 1; i < nodeCount; i++) edges.push([i, i + 1])
  edges.push([nodeCount, 1])
  return edges
}
