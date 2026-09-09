import { aggregateResults } from './aggregate'
import { filterPings, groupPingsByUser, groupPingsByUserDay } from './csv'
import { filterUserDays } from './filter'
import { detectHomes } from './home'
import { extractMotifsForUserDays } from './motifs'
import { detectStaysForAllUsers } from './stays'
import type { Ping, PipelineParams, PipelineResult } from './types'

export function runPipeline(allPings: Ping[], params: PipelineParams): PipelineResult {
  const pings = filterPings(allPings, params)
  const byUser = groupPingsByUser(pings)
  const byUserDay = groupPingsByUserDay(pings)

  const staysByUser = detectStaysForAllUsers(byUser, params.dd, params.dt)
  const homes = detectHomes(byUser, staysByUser, params.nightStartHour, params.nightEndHour, params.dd)
  const filteredDays = filterUserDays(byUserDay, params.minHalfHourSlots, params.weekdaysOnly)
  const userDays = extractMotifsForUserDays(filteredDays, staysByUser, homes, params.dd)
  const aggregated = aggregateResults(pings, userDays, homes, staysByUser)

  return {
    pings,
    staysByUser,
    homes,
    userDays,
    ...aggregated,
  }
}
