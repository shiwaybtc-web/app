import { AFFINITIES, type Affinities, type Affinity } from '@/types/creature'
import { periodAffinity, weatherAffinity } from '@/config/evolution'
import { gameConfig } from '@/config/game'
import type { DayPeriod, WeatherKind } from '@/types/world'

export function totalAffinites(a: Affinities) {
  return AFFINITIES.reduce((s, k) => s + a[k], 0)
}

export function affiniteDominante(a: Affinities): { id: Affinity; part: number; ecart: number } {
  const total = totalAffinites(a) || 1
  const sorted = [...AFFINITIES].sort((x, y) => a[y] - a[x])
  const first = sorted[0]
  const second = sorted[1]
  return { id: first, part: a[first] / total, ecart: (a[first] - a[second]) / total }
}

export function partsAffinites(a: Affinities): Record<Affinity, number> {
  const total = totalAffinites(a) || 1
  return Object.fromEntries(AFFINITIES.map((k) => [k, a[k] / total])) as Record<Affinity, number>
}

/**
 * Ambient affinity points for an action performed now. Player choices are
 * added separately and weigh more (see gameConfig.affinites).
 */
export function gainsAmbiance(meteo: WeatherKind, periode: DayPeriod): Partial<Affinities> {
  const gains: Partial<Affinities> = {}
  const m = weatherAffinity[meteo]
  const p = periodAffinity[periode]
  const amb = gameConfig.affinites.ambiance
  if (m) gains[m] = (gains[m] ?? 0) + amb
  if (p) gains[p] = (gains[p] ?? 0) + amb
  return gains
}

export function fusionnerGains(...parts: Array<Partial<Affinities> | undefined>): Partial<Affinities> {
  const out: Partial<Affinities> = {}
  for (const p of parts) {
    if (!p) continue
    for (const k of AFFINITIES) if (p[k]) out[k] = (out[k] ?? 0) + (p[k] as number)
  }
  return out
}

export function appliquerGains(a: Affinities, gains: Partial<Affinities>): Affinities {
  const out = { ...a }
  for (const k of AFFINITIES) if (gains[k]) out[k] = Math.max(0, out[k] + (gains[k] as number))
  return out
}
