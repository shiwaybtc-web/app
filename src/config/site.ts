/**
 * Central configuration for the NEXA landing page.
 *
 * Everything an editor is likely to change lives here:
 * video files, texts, navigation links, animation intensities,
 * future creature artwork and ambient sound sources.
 */

export type NavLink = {
  label: string
  href: string
  /** Shows a tiny "soon" hint on hover and prevents navigation. */
  comingSoon?: boolean
}

export type MapMarkerKind = 'player' | 'chest' | 'unknown' | 'event' | 'creature'

export type MapMarker = {
  id: string
  kind: MapMarkerKind
  /** Position in percent of the map width / height. */
  x: number
  y: number
  title: string
  description: string
}

export type AmbientLayer = {
  id: 'water' | 'wind' | 'forest' | 'music'
  label: string
  /** Leave empty until an audio file is added to /public/audio. */
  src: string
  volume: number
}

export const siteConfig = {
  brand: {
    name: 'NEXA',
    tagline: 'Your world is waiting.',
    enterHint: 'Click to enter',
  },

  video: {
    /** Desktop / tablet sources (webm is tried first when supported). */
    desktop: {
      webm: '/media/nexa-world.webm',
      mp4: '/media/nexa-world.mp4',
    },
    /** Lighter file served below the `mobileMaxWidth` breakpoint. */
    mobile: {
      webm: '/media/nexa-world-mobile.webm',
      mp4: '/media/nexa-world-mobile.mp4',
    },
    poster: '/media/nexa-world-poster.jpg',
    mobileMaxWidth: 768,
    /**
     * Framing when the viewport ratio differs from 16:9.
     * The glowing egg sits centre-left, the castle upper-right.
     */
    objectPosition: {
      desktop: '50% 55%',
      mobile: '46% 55%',
    },
    /** Seconds of crossfade between the end and the restart of the loop. */
    loopCrossfadeSeconds: 1.1,
    /** Pause the video and show the poster when the user prefers reduced motion. */
    pauseOnReducedMotion: true,
  },

  nav: [
    { label: 'EXPLORER', href: '#explore' },
    { label: 'CREATURE', href: '#creature' },
    { label: 'CODEX', href: '#codex', comingSoon: true },
    { label: 'WORLD', href: '#world' },
  ] as NavLink[],

  hero: {
    title: 'Your creature is waiting.',
    cta: 'AWAKEN',
    scrollHint: 'Explore the world',
    awaken: {
      title: 'Something stirs.',
      subtitle: 'The awakening is not ready yet. Come back when the crystal sings.',
      dismiss: 'Return',
    },
  },

  world: {
    eyebrow: 'A living world',
    title: 'THE WORLD IS ALIVE',
    items: [
      {
        id: 'weather',
        title: 'WEATHER',
        text: 'Weather changes your world.',
      },
      {
        id: 'location',
        title: 'LOCATION',
        text: 'Discover what exists around you.',
      },
      {
        id: 'evolution',
        title: 'EVOLUTION',
        text: 'Your choices shape your creature.',
      },
    ],
  },

  creature: {
    title: 'NO TWO NEXA ARE THE SAME.',
    lines: ['Your environment.', 'Your choices.', 'Your story.'],
    /**
     * Optional artwork for the silhouette (PNG / SVG with transparency).
     * When null, a built-in vector silhouette is used.
     * Example: '/creature/silhouette.png'
     */
    silhouetteImage: null as string | null,
    /** Future reveal artwork, unused for now. */
    revealImage: null as string | null,
  },

  map: {
    eyebrow: 'Explorer preview',
    title: 'THE WORLD AROUND YOU BECOMES THE GAME.',
    subtitle: 'Move through your city, your forest, your coast. NEXA reads the world and writes it into the map.',
    legend: [
      { kind: 'player' as MapMarkerKind, label: 'You' },
      { kind: 'chest' as MapMarkerKind, label: 'Chest' },
      { kind: 'unknown' as MapMarkerKind, label: 'Unknown' },
      { kind: 'event' as MapMarkerKind, label: 'Event' },
      { kind: 'creature' as MapMarkerKind, label: 'Creature' },
    ],
    markers: [
      { id: 'you', kind: 'player', x: 50, y: 56, title: 'You', description: 'Crystal riverbank · 21:14' },
      { id: 'c1', kind: 'chest', x: 36, y: 42, title: 'Moss chest', description: '140 m · locked by rain' },
      { id: 'c2', kind: 'chest', x: 63, y: 70, title: 'Drowned cache', description: '260 m · opens at low tide' },
      { id: 'u1', kind: 'unknown', x: 22, y: 64, title: 'Unmapped ruins', description: 'Walk closer to reveal' },
      { id: 'u2', kind: 'unknown', x: 74, y: 30, title: 'Silent tower', description: 'Walk closer to reveal' },
      { id: 'e1', kind: 'event', x: 58, y: 24, title: 'Aurora surge', description: 'Begins in 18 min · rare spawns' },
      { id: 'e2', kind: 'event', x: 30, y: 26, title: 'Night market', description: 'Community event · 3 km' },
      { id: 'k1', kind: 'creature', x: 44, y: 78, title: 'Faint presence', description: 'Water affinity · shy' },
      { id: 'k2', kind: 'creature', x: 82, y: 58, title: 'Unknown Nexa', description: 'Storm affinity · alert' },
    ] as MapMarker[],
  },

  sound: {
    labelOn: 'SOUND ON',
    labelOff: 'SOUND OFF',
    /** Global master volume applied to every layer (0–1). */
    masterVolume: 0.8,
    fadeMs: 1400,
    /**
     * Ambient layers. Drop files into /public/audio and set the `src` values.
     * Nothing plays automatically: layers only start after the user turns sound on.
     */
    layers: [
      { id: 'water', label: 'Water', src: '', volume: 0.5 },
      { id: 'wind', label: 'Wind', src: '', volume: 0.35 },
      { id: 'forest', label: 'Forest', src: '', volume: 0.4 },
      { id: 'music', label: 'Ambient music', src: '', volume: 0.6 },
    ] as AmbientLayer[],
  },

  animation: {
    /** Maximum background displacement (px) driven by the pointer. */
    parallaxStrength: 12,
    /** Extra scale applied to the video so parallax never reveals edges. */
    parallaxScale: 1.05,
    particles: { desktop: 36, mobile: 16 },
    fireflies: { desktop: 9, mobile: 4 },
    /** Duration (ms) of the intro → main interface transition. */
    introTransitionMs: 1100,
  },

  footer: {
    line: 'NEXA is in development. The world is still forming.',
    copyright: '© 2026 NEXA',
  },
} as const

export type SiteConfig = typeof siteConfig
