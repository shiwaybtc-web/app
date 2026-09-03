# NEXA — landing page

Cinematic, interactive landing page for NEXA. React + Vite + TypeScript, Tailwind CSS, Framer Motion, Lenis (smooth scroll).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build in dist/
npm run preview   # serve the production build
```

## Where to change things

| What | Where |
| --- | --- |
| Video files, poster, mobile breakpoint, framing, loop crossfade | `src/config/site.ts` → `video` and `public/media/` |
| All texts (intro, hero, sections, footer) | `src/config/site.ts` |
| Navigation links | `src/config/site.ts` → `nav` (`comingSoon: true` shows a "soon" hint) |
| Logo / wordmark | `src/components/Logo.tsx` + `.logo-wordmark` styles in `src/index.css` |
| Animation intensities (parallax, particle counts, intro timing) | `src/config/site.ts` → `animation` |
| Creature artwork | `src/config/site.ts` → `creature.silhouetteImage` / `revealImage` |
| Map markers and legend | `src/config/site.ts` → `map` |
| Ambient sound layers | `src/config/site.ts` → `sound.layers` (drop files into `public/audio/`, set `src`) |
| Colours, fonts, easing | `tailwind.config.js` |

## Structure

```
src/
  App.tsx                 # composition: intro → hero → sections, overlays
  config/site.ts          # single source of truth for content & settings
  components/
    IntroScreen.tsx       # blurred world + wordmark, click → particle dissolve
    VideoBackground.tsx   # fixed full-screen video, dual-element crossfade loop,
                          # pointer parallax, scroll-driven shade
    ParticleLayer.tsx     # canvas motes + fireflies reacting to the cursor
    Cursor.tsx            # luminous custom cursor (fine pointers only)
    Navbar.tsx            # small wordmark + nav (glass menu on mobile)
    HeroCenter.tsx        # "Your creature is waiting." + AWAKEN sigil
    AwakenButton.tsx      # rune ring / crystal shard button
    AwakenOverlay.tsx     # placeholder for the future egg / creature reveal
    ScrollHint.tsx, SoundToggle.tsx, Reveal.tsx, SectionHeading.tsx, Logo.tsx
  sections/
    WorldAlive.tsx        # WEATHER / LOCATION / EVOLUTION with micro-animations
    CreatureTeaser.tsx    # silhouette breathing in the mist
    MapPreview.tsx        # interactive SVG map with fog of war + markers
    Footer.tsx
  audio/
    AmbientAudio.ts       # layered ambient engine (water, wind, forest, music)
    useAmbientAudio.ts    # React hook; nothing plays until the user opts in
  hooks/                  # useReducedMotion, useMediaQuery, useLenis
  lib/                    # pointer store, scroll helper, text → particles sampler
```

## Video

The source clip lives in `public/media/`:

- `nexa-world.webm` / `nexa-world.mp4` — desktop (1280×720)
- `nexa-world-mobile.webm` / `nexa-world-mobile.mp4` — served under 768 px
- `nexa-world-poster.jpg` — first frame, shown while loading and under reduced motion

To replace the clip, encode the new file the same way (H.264 + VP9, no audio, `-movflags +faststart`) and update the paths in `src/config/site.ts`.

## Accessibility & performance

- `prefers-reduced-motion`: particles, parallax, shimmer, smooth scroll and the dissolve are disabled; the video is paused on its poster (`video.pauseOnReducedMotion`).
- The video is muted, `playsInline`, and never starts sound. The sound toggle defaults to OFF.
- Canvases cap the device pixel ratio and pause when the tab is hidden.
