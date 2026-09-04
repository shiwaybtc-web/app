import { useMemo } from 'react'
import { useWorldClock } from './useWorldClock'
import { useWeatherKind } from './useWeather'
import type { PeriodWeights, WeatherKind } from '@/types/world'

type RGB = [number, number, number]

/** Crystal / aura tints per period. The body colour is never touched. */
const CRISTAL: Record<keyof PeriodWeights, RGB> = {
  aube: [240, 182, 216],
  jour: [191, 224, 255],
  crepuscule: [217, 160, 120],
  nuit: [110, 120, 255],
}
const INTENSITE: Record<keyof PeriodWeights, number> = { aube: 0.6, jour: 0.4, crepuscule: 0.7, nuit: 1 }

function mix(poids: PeriodWeights): { rgb: RGB; intensite: number } {
  const rgb: RGB = [0, 0, 0]
  let intensite = 0
  for (const k of Object.keys(poids) as Array<keyof PeriodWeights>) {
    const w = poids[k]
    rgb[0] += CRISTAL[k][0] * w
    rgb[1] += CRISTAL[k][1] * w
    rgb[2] += CRISTAL[k][2] * w
    intensite += INTENSITE[k] * w
  }
  return { rgb, intensite }
}

function blend(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export type Ambience = {
  poids: PeriodWeights
  meteo: WeatherKind
  /** CSS colour string for crystal glows. */
  cristal: string
  cristalIntensite: number
  /** Warm / cool highlight applied on the creature as a screen-blended sheen. */
  reflet: string
  refletIntensite: number
  /** Electric pulse (storm). */
  pulsations: boolean
  /** Frost sheen at the base (cold). */
  givre: boolean
  /** Golden sheen (sun). */
  dore: boolean
}

export function useAmbience(): Ambience {
  const { poids } = useWorldClock()
  const meteo = useWeatherKind()
  return useMemo(() => {
    let { rgb, intensite } = mix(poids)
    let reflet: RGB = [255, 255, 255]
    let refletIntensite = 0
    switch (meteo) {
      case 'pluie':
        rgb = blend(rgb, [120, 180, 255], 0.5)
        reflet = [140, 190, 255]
        refletIntensite = 0.25
        break
      case 'neige':
        rgb = blend(rgb, [200, 225, 255], 0.5)
        reflet = [220, 235, 255]
        refletIntensite = 0.3
        break
      case 'orage':
        rgb = blend(rgb, [150, 120, 255], 0.55)
        intensite = Math.min(1, intensite + 0.3)
        reflet = [170, 150, 255]
        refletIntensite = 0.25
        break
      case 'soleil':
        reflet = [255, 214, 150]
        refletIntensite = 0.3
        break
      case 'chaleur':
        rgb = blend(rgb, [255, 190, 130], 0.35)
        reflet = [255, 190, 120]
        refletIntensite = 0.4
        break
      case 'froid':
        rgb = blend(rgb, [170, 210, 255], 0.45)
        reflet = [190, 225, 255]
        refletIntensite = 0.3
        break
      default:
        break
    }
    const c = (v: RGB) => `${Math.round(v[0])}, ${Math.round(v[1])}, ${Math.round(v[2])}`
    return {
      poids,
      meteo,
      cristal: c(rgb),
      cristalIntensite: intensite,
      reflet: c(reflet),
      refletIntensite,
      pulsations: meteo === 'orage',
      givre: meteo === 'froid' || meteo === 'neige',
      dore: meteo === 'soleil' || meteo === 'chaleur',
    }
  }, [poids, meteo])
}
