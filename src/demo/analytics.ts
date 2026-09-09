import type { FootfallDay, SocialDay } from './types'

export interface FusionPoint {
  date: string
  buzz: number
  sentiment: number
  footfall: number
  baseline: number
  inCampaign: boolean
}

export function buildFusionSeries(
  social: SocialDay[],
  footfall: FootfallDay[],
  narrativeId: string,
  venueId: string,
  campaignStart?: string,
  campaignEnd?: string,
): FusionPoint[] {
  const buzzByDate = new Map<string, { buzz: number; sentiment: number }>()
  for (const s of social) {
    if (s.narrativeId !== narrativeId) continue
    buzzByDate.set(s.date, { buzz: s.buzzVolume, sentiment: s.sentiment })
  }

  const footByDate = new Map<string, { footfall: number; baseline: number }>()
  for (const f of footfall) {
    if (f.venueId !== venueId) continue
    footByDate.set(f.date, { footfall: f.footfall, baseline: f.baseline })
  }

  const dates = [...new Set([...buzzByDate.keys(), ...footByDate.keys()])].sort()
  return dates.map((date) => {
    const b = buzzByDate.get(date)
    const f = footByDate.get(date)
    const inCampaign = Boolean(
      campaignStart && campaignEnd && date >= campaignStart && date <= campaignEnd,
    )
    return {
      date,
      buzz: b?.buzz ?? 0,
      sentiment: b?.sentiment ?? 0,
      footfall: f?.footfall ?? 0,
      baseline: f?.baseline ?? 0,
      inCampaign,
    }
  })
}

export function crossCorrelationLag(
  leading: number[],
  lagging: number[],
  maxLag = 7,
): { lag: number; correlation: number } {
  let bestLag = 0
  let bestCorr = -Infinity

  const norm = (arr: number[]) => {
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length
    const std = Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length) || 1
    return arr.map((v) => (v - mean) / std)
  }

  const a = norm(leading)
  const b = norm(lagging)

  for (let lag = 0; lag <= maxLag; lag++) {
    let sum = 0
    let count = 0
    for (let i = lag; i < Math.min(a.length, b.length); i++) {
      sum += a[i - lag] * b[i]
      count++
    }
    const corr = count > 0 ? sum / count : 0
    if (corr > bestCorr) {
      bestCorr = corr
      bestLag = lag
    }
  }

  return { lag: bestLag, correlation: bestCorr }
}

export function computeLift(
  footfall: FootfallDay[],
  venueId: string,
  campaignStart: string,
  campaignEnd: string,
  lagDays: number,
): number {
  const byDate = footfall.filter((f) => f.venueId === venueId)
  const lagStart = shiftDate(campaignStart, lagDays)
  const lagEnd = shiftDate(campaignEnd, lagDays)

  const campaignDays = byDate.filter((f) => f.date >= lagStart && f.date <= lagEnd)
  const preStart = shiftDate(campaignStart, -14)
  const preDays = byDate.filter((f) => f.date >= preStart && f.date < campaignStart)

  const avgCampaign =
    campaignDays.reduce((s, f) => s + f.footfall, 0) / Math.max(1, campaignDays.length)
  const avgPre = preDays.reduce((s, f) => s + f.footfall, 0) / Math.max(1, preDays.length)

  return avgPre > 0 ? ((avgCampaign - avgPre) / avgPre) * 100 : 0
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatPct(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(digits)}%`
}
