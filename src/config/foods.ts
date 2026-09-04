import type { Affinity } from '@/types/creature'
import type { FoodId } from '@/types/game'

export type FoodDef = {
  id: FoodId
  nom: string
  description: string
  xp: number
  affinite: Affinity
  rarete: 'commun' | 'rare'
  /** Icon drawn by <FoodIcon />. */
  icone: 'baie' | 'nectar' | 'feuille' | 'goutte' | 'eclat'
  reaction: string
}

export const foods: FoodDef[] = [
  {
    id: 'baie-de-lune',
    nom: 'Baie de lune',
    description: 'Cueillie à la tombée du jour. Éveille la part nocturne.',
    xp: 14,
    affinite: 'nocturne',
    rarete: 'commun',
    icone: 'baie',
    reaction: 'ronronne doucement',
  },
  {
    id: 'nectar-solaire',
    nom: 'Nectar solaire',
    description: 'Un nectar tiède gorgé de lumière du matin.',
    xp: 14,
    affinite: 'solaire',
    rarete: 'commun',
    icone: 'nectar',
    reaction: 'rayonne un instant',
  },
  {
    id: 'feuille-argentee',
    nom: 'Feuille argentée',
    description: 'Une feuille de l’arbre ancien, croquante et fraîche.',
    xp: 12,
    affinite: 'sylvestre',
    rarete: 'commun',
    icone: 'feuille',
    reaction: 'mâchonne avec application',
  },
  {
    id: 'goutte-de-source',
    nom: 'Goutte de source',
    description: 'Eau pure des cascades du sanctuaire.',
    xp: 12,
    affinite: 'aquatique',
    rarete: 'commun',
    icone: 'goutte',
    reaction: 'frissonne de plaisir',
  },
  {
    id: 'eclat-orage',
    nom: 'Éclat d’orage',
    description: 'Un fragment chargé de foudre. Rare et électrisant.',
    xp: 20,
    affinite: 'fulgurante',
    rarete: 'rare',
    icone: 'eclat',
    reaction: 'crépite d’énergie',
  },
]

export const foodById = Object.fromEntries(foods.map((f) => [f.id, f])) as Record<FoodId, FoodDef>
