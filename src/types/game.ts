import type { Affinity, CreatureState, Cosmetics } from './creature'
import type { GeoConsent, WeatherSnapshot } from './world'

export type FoodId = 'baie-de-lune' | 'nectar-solaire' | 'feuille-argentee' | 'goutte-de-source' | 'eclat-orage'

export type Inventory = {
  aliments: Record<FoodId, number>
  objets: string[]
}

export type Cooldowns = {
  /** Remaining appetite "slots" and the last time one regenerated. */
  appetit: number
  appetitDepuis: number
  /** Timestamp of the last fully rewarded play session. */
  dernierJeu: number
  /** Chest id -> timestamp when it can be opened again. */
  coffres: Record<string, number>
  /** Day key (YYYY-MM-DD) of the last daily ration. */
  rationDuJour: string | null
}

export type GameEventKind =
  | 'eclosion'
  | 'nourrir'
  | 'jouer'
  | 'coffre'
  | 'decouverte'
  | 'niveau'
  | 'achat'
  | 'meteo'

export type GameEvent = {
  at: number
  kind: GameEventKind
  label: string
  xp?: number
  affinites?: Partial<Record<Affinity, number>>
}

export type PlayerProgress = {
  niveau: number
  xp: number
  pieces: number
  /** Total XP ever earned, for stats and codex milestones. */
  xpTotal: number
}

export type Settings = {
  geoConsent: GeoConsent
  meteoReelle: boolean
  son: boolean
}

export type SaveData = {
  version: number
  creeLe: number
  derniereVisite: number
  introVue: boolean
  eclosionTerminee: boolean
  joueur: PlayerProgress
  creature: CreatureState
  cosmetiques: Cosmetics
  possessions: string[]
  inventaire: Inventory
  recharges: Cooldowns
  codex: string[]
  journal: GameEvent[]
  meteo: WeatherSnapshot | null
  reglages: Settings
}
