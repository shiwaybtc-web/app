export type DayPeriod = 'aube' | 'jour' | 'crepuscule' | 'nuit'

export const DAY_PERIODS: DayPeriod[] = ['aube', 'jour', 'crepuscule', 'nuit']

export type PeriodWeights = Record<DayPeriod, number>

export type WeatherKind =
  | 'inconnu'
  | 'soleil'
  | 'nuageux'
  | 'pluie'
  | 'orage'
  | 'neige'
  | 'chaleur'
  | 'froid'

export type WeatherSnapshot = {
  kind: WeatherKind
  temperatureC: number | null
  isDay: boolean | null
  /** When the snapshot was taken. */
  at: number
  /** 'reel' = fetched from the weather service, 'simule' = dev panel. */
  source: 'reel' | 'simule' | 'aucune'
}

export type GeoConsent = 'inconnu' | 'accorde' | 'refuse'
