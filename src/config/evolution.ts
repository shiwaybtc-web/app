import type { Affinity } from '@/types/creature'
import type { DayPeriod, WeatherKind } from '@/types/world'

export type AffinityMeta = {
  id: Affinity
  nom: string
  devise: string
  /** Main and secondary accent colours. */
  couleur: string
  couleurDouce: string
  /** Simple line symbol id rendered by <AffinitySymbol />. */
  symbole: 'soleil' | 'goutte' | 'lune' | 'feuille' | 'eclair'
}

export const affinityMeta: Record<Affinity, AffinityMeta> = {
  solaire: {
    id: 'solaire',
    nom: 'Solaire',
    devise: 'Lumière · Chaleur · Équilibre',
    couleur: '#f2c97a',
    couleurDouce: 'rgba(242,201,122,0.35)',
    symbole: 'soleil',
  },
  aquatique: {
    id: 'aquatique',
    nom: 'Aquatique',
    devise: 'Fluidité · Pureté · Adaptation',
    couleur: '#7fc0ff',
    couleurDouce: 'rgba(127,192,255,0.35)',
    symbole: 'goutte',
  },
  nocturne: {
    id: 'nocturne',
    nom: 'Nocturne',
    devise: 'Mystère · Sagesse · Intuition',
    couleur: '#a48cff',
    couleurDouce: 'rgba(164,140,255,0.35)',
    symbole: 'lune',
  },
  sylvestre: {
    id: 'sylvestre',
    nom: 'Sylvestre',
    devise: 'Vie · Croissance · Harmonie',
    couleur: '#9ed49a',
    couleurDouce: 'rgba(158,212,154,0.35)',
    symbole: 'feuille',
  },
  fulgurante: {
    id: 'fulgurante',
    nom: 'Fulgurante',
    devise: 'Énergie · Mouvement · Liberté',
    couleur: '#8fa6ff',
    couleurDouce: 'rgba(143,166,255,0.35)',
    symbole: 'eclair',
  },
}

/** Ambient affinity granted by the weather while an action is performed. */
export const weatherAffinity: Partial<Record<WeatherKind, Affinity>> = {
  soleil: 'solaire',
  chaleur: 'solaire',
  pluie: 'aquatique',
  neige: 'aquatique',
  froid: 'nocturne',
  orage: 'fulgurante',
  nuageux: 'sylvestre',
}

/** Ambient affinity granted by the time of day. */
export const periodAffinity: Partial<Record<DayPeriod, Affinity>> = {
  aube: 'solaire',
  jour: 'solaire',
  crepuscule: 'sylvestre',
  nuit: 'nocturne',
}

/**
 * What the evolution screen reveals at each level. Order matters: the
 * highest threshold reached wins.
 */
export const revealSteps = [
  { niveau: 1, etape: 'symboles' as const, texte: 'Cinq voies existent. Aucune n’est encore tracée.' },
  { niveau: 3, etape: 'nom' as const, texte: 'Une tendance se dessine. Son nom se murmure.' },
  { niveau: 6, etape: 'silhouette' as const, texte: 'Une silhouette apparaît dans la brume.' },
  { niveau: 10, etape: 'voile' as const, texte: 'La forme se précise derrière le voile.' },
  { niveau: 15, etape: 'revelation' as const, texte: 'Votre Nexa connaît désormais sa voie.' },
]

export type RevealStep = (typeof revealSteps)[number]['etape']

/** Level at which the first evolution becomes possible (future). */
export const evolutionConfig = {
  niveauEvolution: 15,
  /** Dominance needed (share of total affinity) to lock a branch. */
  partDominante: 0.4,
}
