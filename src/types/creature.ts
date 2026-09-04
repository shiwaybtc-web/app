export type Affinity = 'solaire' | 'aquatique' | 'nocturne' | 'sylvestre' | 'fulgurante'

export const AFFINITIES: Affinity[] = ['solaire', 'aquatique', 'nocturne', 'sylvestre', 'fulgurante']

export type Affinities = Record<Affinity, number>

export type CreatureStage = 'oeuf' | 'bebe'

export type CreatureMood = 'calme' | 'heureuse' | 'curieuse' | 'endormie' | 'affamee'

/**
 * Animation clips the creature can play. The 2.5D sprite implements a subset
 * with CSS / Framer Motion; a future GLB model maps these names to its clips.
 */
export type CreatureClip =
  | 'idle'
  | 'marche'
  | 'course'
  | 'dort'
  | 'heureuse'
  | 'curieuse'
  | 'mange'
  | 'reaction'
  | 'evolution'
  | 'niveau_superieur'

export type CreatureState = {
  nom: string
  stage: CreatureStage
  affinites: Affinities
  humeur: CreatureMood
  /** Timestamp of the hatch, null while still an egg. */
  neLe: number | null
  /** Number of taps given to the egg before hatching. */
  fissures: number
}

export type Cosmetics = {
  aura: string
  socle: string
  collier: string | null
}
