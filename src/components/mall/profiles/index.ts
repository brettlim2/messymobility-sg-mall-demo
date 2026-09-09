import type { MallProfile } from '../types'
import { jem } from './jem'
import { vivocity } from './vivocity'
import { waterwayPoint } from './waterwayPoint'

// Ordered by archetype: transit hub → destination → heartland.
export const MALL_PROFILES: MallProfile[] = [jem, vivocity, waterwayPoint]

export function getMallProfile(id: string): MallProfile {
  return MALL_PROFILES.find((m) => m.id === id) ?? jem
}
