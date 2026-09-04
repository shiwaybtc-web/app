/**
 * Every visual / audio asset used by NEXA, in one place.
 * Paths are relative to /public. Replace a file, keep the key.
 */
export const assets = {
  world: {
    /** Main 16:9 scene with the central socle (1672×941). */
    sanctuaire: '/assets/world/nexa-sanctuaire.jpg',
    /** Tiny blurred preview painted before the full scene loads. */
    sanctuairePreview: '/assets/world/nexa-sanctuaire-preview.jpg',
    /** Dimensions of the scene image, used to anchor elements on the socle. */
    sanctuaireSize: { width: 1672, height: 941 },
    /**
     * Point (in scene pixels) where the creature's feet touch the socle,
     * plus the radii of the socle's top ellipse for shadows and halos.
     */
    socle: {
      x: 892,
      y: 664,
      rx: 392,
      ry: 45,
    },
    /** Animated valley used by the introduction. */
    introVideo: {
      webm: '/assets/world/nexa-vallee.webm',
      mp4: '/assets/world/nexa-vallee.mp4',
      poster: '/assets/world/nexa-vallee-poster.jpg',
    },
  },

  creature: {
    oeuf: {
      kind: 'sprite' as const,
      src: '/assets/creature/oeuf.png',
      /** Ratio height / width of the sprite once trimmed. */
      ratio: 1.462,
      /** Height of the egg in scene pixels. */
      hauteurScene: 190,
      /** Where the sprite touches the ground, as a fraction of its height. */
      pied: 0.981,
    },
    bebe: {
      kind: 'sprite' as const,
      src: '/assets/creature/bebe.png',
      ratio: 1.393,
      hauteurScene: 300,
      pied: 0.976,
      /**
       * Crystal / eye anchors in percent of the sprite box, used to place
       * ambient glows without recolouring the body.
       */
      cristaux: [
        { x: 40, y: 12, r: 13 },
        { x: 10, y: 28, r: 9 },
        { x: 60, y: 32, r: 9 },
        { x: 23, y: 58, r: 6 },
        { x: 50, y: 55, r: 8 },
        { x: 85, y: 52, r: 12 },
      ],
      yeux: [
        { x: 23, y: 37 },
        { x: 44, y: 37 },
      ],
      /** Future GLB model: set `model` and switch `kind` to 'model'. */
      model: null as string | null,
    },
  },

  evolution: {
    planche: '/assets/evolution/planche-evolutions.jpg',
    branches: {
      solaire: '/assets/evolution/branche-solaire.jpg',
      aquatique: '/assets/evolution/branche-aquatique.jpg',
      nocturne: '/assets/evolution/branche-nocturne.jpg',
      sylvestre: '/assets/evolution/branche-sylvestre.jpg',
      fulgurante: '/assets/evolution/branche-fulgurante.jpg',
    },
  },

  audio: {
    /** Ambient layers. Empty until files are added; nothing autoplays. */
    eau: '',
    vent: '',
    foret: '',
    musique: '',
  },
} as const

export type CreatureAssetKey = keyof typeof assets.creature
