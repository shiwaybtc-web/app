import { gameConfig } from '@/config/game'
import type { SaveData } from '@/types/game'

export function nouvelleSauvegarde(now = Date.now()): SaveData {
  return {
    version: gameConfig.sauvegarde.version,
    creeLe: now,
    derniereVisite: now,
    introVue: false,
    eclosionTerminee: false,
    joueur: { niveau: 1, xp: 0, pieces: gameConfig.progression.piecesDepart, xpTotal: 0 },
    creature: {
      nom: 'Nexa',
      stage: 'oeuf',
      affinites: { ...gameConfig.affinites.depart },
      humeur: 'calme',
      neLe: null,
      fissures: 0,
    },
    cosmetiques: { aura: 'ivoire', socle: 'nu', collier: null },
    possessions: ['aura-ivoire', 'socle-nu'],
    inventaire: { aliments: { ...gameConfig.nourrir.inventaireDepart }, objets: [] },
    recharges: {
      appetit: gameConfig.nourrir.appetitMax,
      appetitDepuis: now,
      dernierJeu: 0,
      coffres: {},
      rationDuJour: null,
    },
    codex: ['crea-oeuf'],
    journal: [],
    meteo: null,
    reglages: { geoConsent: 'inconnu', meteoReelle: false, son: false },
  }
}

/** Upgrades an older save to the current shape. Add a case per version bump. */
export function migrer(data: SaveData): SaveData {
  const base = nouvelleSauvegarde(data.creeLe)
  // Shallow-merge unknown / missing keys so new fields get defaults.
  return {
    ...base,
    ...data,
    version: gameConfig.sauvegarde.version,
    joueur: { ...base.joueur, ...data.joueur },
    creature: { ...base.creature, ...data.creature, affinites: { ...base.creature.affinites, ...data.creature?.affinites } },
    cosmetiques: { ...base.cosmetiques, ...data.cosmetiques },
    inventaire: {
      aliments: { ...base.inventaire.aliments, ...data.inventaire?.aliments },
      objets: data.inventaire?.objets ?? [],
    },
    recharges: { ...base.recharges, ...data.recharges },
    reglages: { ...base.reglages, ...data.reglages },
  }
}
