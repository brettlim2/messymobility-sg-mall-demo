import Papa from 'papaparse'
import type { GeoFields, Ping, PipelineParams, QualityFields } from './types'

const PHT_OFFSET_MS = 8 * 60 * 60 * 1000 // SGT (UTC+8), same offset as former Manila demo

function toPht(dateUtc: Date): Date {
  return new Date(dateUtc.getTime() + PHT_OFFSET_MS)
}

function dayKeyPht(datePht: Date): string {
  const y = datePht.getUTCFullYear()
  const m = String(datePht.getUTCMonth() + 1).padStart(2, '0')
  const d = String(datePht.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function loadPingsFromCsv(url: string): Promise<Ping[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          resolve(rowsToPings(results.data))
        } catch (err) {
          reject(err)
        }
      },
      error: (err: Error) => reject(err),
    })
  })
}

function rowsToPings(rows: Record<string, string>[]): Ping[] {
  return rows.map((row) => parseRow(row)).filter((p): p is Ping => p !== null)
}

export function parseRow(row: Record<string, string>): Ping | null {
  if (!row.ad_id || !row.utc_timestamp) return null

  const timestampUtc = new Date(row.utc_timestamp)
  if (Number.isNaN(timestampUtc.getTime())) return null

  const timestampPht = toPht(timestampUtc)
  const hourPht = timestampPht.getUTCHours()
  const minutePht = timestampPht.getUTCMinutes()
  const halfHourSlot = hourPht * 2 + (minutePht >= 30 ? 1 : 0)
  const dayOfWeek = timestampPht.getUTCDay()

  let geo: GeoFields = {
    city: 'unknown',
    region: '',
    h3_res10: '',
    h3_res12: '',
    geohash: '',
  }
  let quality: QualityFields = {}

  try {
    geo = JSON.parse(row.geo_fields || '{}')
  } catch {
    /* ignore */
  }
  try {
    quality = JSON.parse(row.quality_fields || '{}')
  } catch {
    /* ignore */
  }

  return {
    adId: row.ad_id,
    timestampUtc,
    timestampPht,
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    accuracy: Number(row.horizontal_accuracy) || 999,
    city: (geo.city || 'unknown').toLowerCase(),
    h3: geo.h3_res10 || '',
    circleScore: Number(quality.ping_circle_score) || 0,
    sourceType: quality.source_type || 'unknown',
    dayKey: dayKeyPht(timestampPht),
    hourPht,
    halfHourSlot,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
  }
}

export function filterPings(pings: Ping[], params: PipelineParams): Ping[] {
  return pings.filter((p) => {
    if (p.accuracy > params.maxAccuracy) return false
    if (p.circleScore < params.minCircleScore) return false
    if (params.dateStart && p.dayKey < params.dateStart) return false
    if (params.dateEnd && p.dayKey > params.dateEnd) return false
    if (params.selectedUserId && p.adId !== params.selectedUserId) return false
    return true
  })
}

export function groupPingsByUser(pings: Ping[]): Map<string, Ping[]> {
  const map = new Map<string, Ping[]>()
  for (const ping of pings) {
    const list = map.get(ping.adId) ?? []
    list.push(ping)
    map.set(ping.adId, list)
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.timestampUtc.getTime() - b.timestampUtc.getTime())
  }
  return map
}

export function groupPingsByUserDay(pings: Ping[]): Map<string, Ping[]> {
  const map = new Map<string, Ping[]>()
  for (const ping of pings) {
    const key = `${ping.adId}|${ping.dayKey}`
    const list = map.get(key) ?? []
    list.push(ping)
    map.set(key, list)
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.timestampUtc.getTime() - b.timestampUtc.getTime())
  }
  return map
}
