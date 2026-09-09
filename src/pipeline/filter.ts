import type { Ping } from './types'

export interface FilteredUserDay {
  adId: string
  dayKey: string
  isWeekend: boolean
  pings: Ping[]
  halfHourSlots: Set<number>
}

/**
 * Section 4.3: Keep user-days with phone records in at least N distinct half-hour slots.
 */
export function filterUserDays(
  byUserDay: Map<string, Ping[]>,
  minHalfHourSlots: number,
  weekdaysOnly: boolean,
): FilteredUserDay[] {
  const result: FilteredUserDay[] = []

  for (const [key, pings] of byUserDay) {
    if (pings.length === 0) continue
    const [adId, dayKey] = key.split('|')
    const isWeekend = pings[0].isWeekend
    if (weekdaysOnly && isWeekend) continue

    const slots = new Set(pings.map((p) => p.halfHourSlot))
    if (slots.size < minHalfHourSlots) continue

    result.push({ adId, dayKey, isWeekend, pings, halfHourSlots: slots })
  }

  return result
}
