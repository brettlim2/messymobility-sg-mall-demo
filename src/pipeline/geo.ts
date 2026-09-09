const EARTH_RADIUS_M = 6_371_000

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

export function isNightHour(hour: number, start: number, end: number): boolean {
  if (start > end) return hour >= start || hour < end
  return hour >= start && hour < end
}

export function medoidIndex<T extends { lat: number; lng: number }>(points: T[]): number {
  if (points.length === 1) return 0
  let best = 0
  let bestScore = Infinity
  for (let i = 0; i < points.length; i++) {
    let maxDist = 0
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue
      maxDist = Math.max(
        maxDist,
        haversineMeters(points[i].lat, points[i].lng, points[j].lat, points[j].lng),
      )
    }
    if (maxDist < bestScore) {
      bestScore = maxDist
      best = i
    }
  }
  return best
}
