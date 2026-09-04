import { gameConfig } from '@/config/game'
import type { WeatherKind, WeatherSnapshot } from '@/types/world'

/**
 * Real weather through Open-Meteo (no API key). Coordinates are rounded
 * before the request and never leave memory.
 */
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

export function arrondir(valeur: number, decimales: number) {
  const f = Math.pow(10, decimales)
  return Math.round(valeur * f) / f
}

/** Map WMO weather codes + temperature to NEXA weather kinds. */
export function classerMeteo(code: number, temperatureC: number | null): WeatherKind {
  let kind: WeatherKind
  if (code === 0 || code === 1) kind = 'soleil'
  else if (code === 2 || code === 3 || code === 45 || code === 48) kind = 'nuageux'
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) kind = 'pluie'
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86) kind = 'neige'
  else if (code >= 95) kind = 'orage'
  else kind = 'nuageux'

  if (temperatureC !== null) {
    if (kind === 'soleil' && temperatureC >= gameConfig.meteo.seuilChaleurC) kind = 'chaleur'
    if ((kind === 'soleil' || kind === 'nuageux') && temperatureC <= gameConfig.meteo.seuilFroidC) kind = 'froid'
  }
  return kind
}

export async function recupererMeteo(latitude: number, longitude: number): Promise<WeatherSnapshot> {
  const d = gameConfig.meteo.decimalesPosition
  const params = new URLSearchParams({
    latitude: String(arrondir(latitude, d)),
    longitude: String(arrondir(longitude, d)),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto',
  })
  const res = await fetch(`${ENDPOINT}?${params.toString()}`)
  if (!res.ok) throw new Error(`Service météo : ${res.status}`)
  const json = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number; is_day?: number }
  }
  const cur = json.current ?? {}
  const temp = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : null
  const code = typeof cur.weather_code === 'number' ? cur.weather_code : 3
  return {
    kind: classerMeteo(code, temp),
    temperatureC: temp,
    isDay: typeof cur.is_day === 'number' ? cur.is_day === 1 : null,
    at: Date.now(),
    source: 'reel',
  }
}

export function meteoInconnue(): WeatherSnapshot {
  return { kind: 'inconnu', temperatureC: null, isDay: null, at: Date.now(), source: 'aucune' }
}
