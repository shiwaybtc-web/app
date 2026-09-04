import type { DayPeriod, PeriodWeights } from '@/types/world'

/**
 * Real-time day periods with progressive blending.
 * Transitions last one hour around each boundary.
 */
const BOUNDARIES: Array<{ at: number; from: DayPeriod; to: DayPeriod }> = [
  { at: 5.5, from: 'nuit', to: 'aube' },
  { at: 8, from: 'aube', to: 'jour' },
  { at: 18, from: 'jour', to: 'crepuscule' },
  { at: 21, from: 'crepuscule', to: 'nuit' },
]
const TRANSITION_HOURS = 1

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function heureDecimale(date = new Date()) {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
}

/** Weights (summing to 1) of each period for a given decimal hour. */
export function poidsPeriodes(heure: number): PeriodWeights {
  const w: PeriodWeights = { aube: 0, jour: 0, crepuscule: 0, nuit: 0 }
  for (const b of BOUNDARIES) {
    const start = b.at - TRANSITION_HOURS / 2
    const end = b.at + TRANSITION_HOURS / 2
    if (heure >= start && heure < end) {
      const t = smoothstep((heure - start) / TRANSITION_HOURS)
      w[b.from] = 1 - t
      w[b.to] = t
      return w
    }
  }
  w[periodeDominante(heure)] = 1
  return w
}

export function periodeDominante(heure: number): DayPeriod {
  if (heure >= 5.5 && heure < 8) return 'aube'
  if (heure >= 8 && heure < 18) return 'jour'
  if (heure >= 18 && heure < 21) return 'crepuscule'
  return 'nuit'
}

export function poidsFixes(periode: DayPeriod): PeriodWeights {
  return { aube: 0, jour: 0, crepuscule: 0, nuit: 0, [periode]: 1 }
}

export function cleDuJour(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}
