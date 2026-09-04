/**
 * Core tuning of the game loop. Every number a designer may want to change.
 */
export const gameConfig = {
  sauvegarde: {
    cle: 'nexa.save.v1',
    version: 1,
  },

  progression: {
    /** XP needed to go from `niveau` to `niveau + 1`. */
    xpPourNiveau: (niveau: number) => Math.round(80 * Math.pow(niveau, 1.25)),
    niveauMax: 50,
    piecesParNiveau: 40,
    piecesDepart: 60,
  },

  nourrir: {
    appetitMax: 3,
    /** One appetite slot regenerates every N minutes. */
    regenerationMinutes: 12,
    /** Daily ration added to the inventory on the first visit of the day. */
    rationQuotidienne: {
      'baie-de-lune': 2,
      'nectar-solaire': 2,
      'feuille-argentee': 2,
      'goutte-de-source': 2,
      'eclat-orage': 0,
    },
    inventaireDepart: {
      'baie-de-lune': 3,
      'nectar-solaire': 2,
      'feuille-argentee': 2,
      'goutte-de-source': 2,
      'eclat-orage': 1,
    },
  },

  jouer: {
    dureeSecondes: 20,
    /** Full reward once per this many minutes; otherwise a reduced reward. */
    rechargeMinutes: 8,
    xpBase: 8,
    xpParLueur: 2,
    xpMax: 44,
    facteurReduit: 0.3,
    chanceAliment: 0.3,
    /** Every lure lives this long (ms) before fading. */
    dureeLueurMs: 1700,
    intervalleApparitionMs: 650,
  },

  explorer: {
    /** A demo chest can be reopened after this delay. */
    rechargeCoffreMinutes: 45,
  },

  affinites: {
    /** Points given by an explicit player choice (food, activity). */
    choix: 3,
    /** Points given by the ambient context (weather, time of day). */
    ambiance: 1,
    /** Above this level, the dominant branch name is revealed. */
    depart: { solaire: 4, aquatique: 4, nocturne: 4, sylvestre: 4, fulgurante: 4 },
  },

  meteo: {
    /** Re-fetch real weather after this many minutes. */
    rafraichissementMinutes: 30,
    /** Coordinates are rounded to this many decimals before the request (~1 km). */
    decimalesPosition: 2,
    seuilChaleurC: 29,
    seuilFroidC: 3,
  },

  publicite: {
    /** Simulated rewarded ad length, in seconds. */
    dureeSimulationSecondes: 5,
    multiplicateur: 2,
  },

  journal: { taille: 60 },
} as const
