import type { Affinity } from './creature'
import type { FoodId } from './game'

export type MapPointKind = 'joueur' | 'coffre' | 'evenement' | 'lieu' | 'presence'

export type ChestReward =
  | { type: 'xp'; montant: number }
  | { type: 'pieces'; montant: number }
  | { type: 'aliment'; id: FoodId; quantite: number }
  | { type: 'fragment'; id: string }

export type MapPoint = {
  id: string
  kind: MapPointKind
  /** Position in percent of the demo map. */
  x: number
  y: number
  titre: string
  description: string
  /** Affinity granted when discovered / interacted with. */
  affinite?: Affinity
  /** Codex entry unlocked on discovery. */
  codex?: string
  recompenses?: ChestReward[]
}

/**
 * Future real-world chest, as it will come from the server.
 * Coordinates are only ever kept in memory, never persisted.
 */
export type GeoChest = {
  id: string
  latitude: number
  longitude: number
  rayonMetres: number
  expireLe: number
  rarete: 'commun' | 'rare' | 'legendaire'
}
