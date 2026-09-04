import { useEffect, useMemo, useState } from 'react'
import { useGame } from '@/game/store'
import { heureDecimale, periodeDominante, poidsFixes, poidsPeriodes } from '@/services/clock'
import type { DayPeriod, PeriodWeights } from '@/types/world'

export type WorldClock = { heure: number; periode: DayPeriod; poids: PeriodWeights }

/** Local time of day, blended, with the dev override applied. */
export function useWorldClock(): WorldClock {
  const override = useGame((s) => s.ui.dev.periode)
  const [heure, setHeure] = useState(() => heureDecimale())
  useEffect(() => {
    const id = window.setInterval(() => setHeure(heureDecimale()), 20000)
    return () => window.clearInterval(id)
  }, [])
  return useMemo(() => {
    if (override) return { heure, periode: override, poids: poidsFixes(override) }
    return { heure, periode: periodeDominante(heure), poids: poidsPeriodes(heure) }
  }, [heure, override])
}
