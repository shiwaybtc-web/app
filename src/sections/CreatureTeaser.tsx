import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/Reveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Built-in vector silhouette used until real creature artwork is provided. */
function VectorSilhouette() {
  return (
    <svg viewBox="0 0 400 360" className="h-full w-full" aria-hidden>
      <defs>
        <filter id="silhouette-blur" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <linearGradient id="silhouette-fill" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="330">
          <stop offset="0" stopColor="#101a3d" />
          <stop offset="1" stopColor="#04060f" />
        </linearGradient>
        <radialGradient id="eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#eae4ff" stopOpacity="1" />
          <stop offset="0.45" stopColor="#b49bff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9d7cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rim-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9b8ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9b8ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7fc0ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter="url(#silhouette-blur)" fill="url(#silhouette-fill)" stroke="none">
        {/* Tail: a thick curve sweeping up behind the body */}
        <path
          d="M236 292 C 290 300, 335 268, 338 212 C 340 172, 318 150, 300 148"
          fill="none"
          stroke="url(#silhouette-fill)"
          strokeWidth="34"
          strokeLinecap="round"
        />
        {/* Body (seated) */}
        <path d="M130 318 C 118 262, 132 196, 178 168 C 214 148, 252 166, 266 210 C 282 256, 270 300, 258 318 Z" />
        {/* Neck + head */}
        <path d="M168 176 C 160 150, 166 118, 190 104 C 214 90, 246 100, 254 130 C 260 154, 248 178, 226 186 C 206 194, 178 192, 168 176 Z" />
        {/* Ears */}
        <path d="M184 110 C 176 84, 160 52, 150 22 C 174 38, 196 62, 206 94 Z" />
        <path d="M232 104 C 240 80, 256 52, 268 30 C 268 60, 260 88, 246 112 Z" />
        {/* Crystal spines along the back */}
        <path d="M160 214 L 150 184 L 172 204 Z" />
        <path d="M148 246 L 134 220 L 158 236 Z" />
        {/* Front paws */}
        <path d="M154 318 C 150 296, 156 268, 168 258 C 178 268, 180 300, 176 318 Z" />
        <path d="M188 318 C 184 300, 190 272, 202 262 C 212 272, 214 300, 210 318 Z" />
      </g>
      {/* Faint rim light on the head so the shape reads in the dark */}
      <path
        d="M186 106 C 208 92, 240 100, 252 128"
        fill="none"
        stroke="url(#rim-light)"
        strokeWidth="1.2"
        opacity="0.8"
      />
      {/* Eyes */}
      <g style={{ mixBlendMode: 'screen' }}>
        <ellipse cx="204" cy="134" rx="8" ry="3.6" fill="url(#eye-glow)" transform="rotate(-8 204 134)" />
        <ellipse cx="234" cy="138" rx="7" ry="3.2" fill="url(#eye-glow)" transform="rotate(-8 234 138)" />
      </g>
    </svg>
  )
}

export function CreatureTeaser() {
  const reduced = useReducedMotion()
  const img = siteConfig.creature.silhouetteImage

  return (
    <section id="creature" className="relative overflow-hidden px-6 py-28 sm:px-10 sm:py-40">
      {/* Deep haze */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(11,18,38,0.85) 0%, rgba(4,6,15,0.2) 60%, rgba(4,6,15,0) 100%)' }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 sm:gap-16 lg:flex-row lg:justify-between">
        {/* Silhouette in the mist */}
        <Reveal className="relative aspect-[10/9] w-full max-w-[420px] lg:w-[46%]" y={40}>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 70%, rgba(157,124,255,0.16), rgba(4,6,15,0) 70%)',
              filter: 'blur(24px)',
            }}
          />
          <div
            className="relative h-full w-full"
            style={{
              animation: reduced ? 'none' : 'breathe 7s ease-in-out infinite',
              transformOrigin: '50% 100%',
              willChange: 'transform',
              maskImage: 'radial-gradient(ellipse 55% 60% at 50% 48%, #000 45%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 55% 60% at 50% 48%, #000 45%, transparent 100%)',
            }}
          >
            {img ? (
              <img src={img} alt="" className="h-full w-full object-contain" style={{ filter: 'blur(1.2px) brightness(0.3)' }} />
            ) : (
              <VectorSilhouette />
            )}
          </div>
          {/* Mist layers */}
          {[
            { anim: 'mist-drift-a', top: '48%', opacity: 0.9, duration: 26 },
            { anim: 'mist-drift-b', top: '62%', opacity: 0.75, duration: 34 },
            { anim: 'mist-drift-a', top: '76%', opacity: 1, duration: 40 },
          ].map((m, i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute inset-x-[-25%] h-[55%]"
              style={{
                top: m.top,
                opacity: m.opacity,
                background:
                  'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,184,255,0.16) 0%, rgba(169,216,255,0.08) 40%, rgba(4,6,15,0) 100%)',
                filter: 'blur(18px)',
                animation: reduced ? 'none' : `${m.anim} ${m.duration}s ease-in-out infinite`,
              }}
            />
          ))}
        </Reveal>

        {/* Copy */}
        <div className="flex flex-col items-center text-center lg:w-[46%] lg:items-start lg:text-left">
          <Reveal as="h2" className="font-display text-[clamp(1.3rem,3vw,2.3rem)] uppercase leading-snug tracking-wide2 text-white text-glow-soft">
            {siteConfig.creature.title}
          </Reveal>
          <Reveal delay={0.15} className="hairline my-8 w-20 opacity-70" />
          <div className="flex flex-col gap-2">
            {siteConfig.creature.lines.map((line, i) => (
              <Reveal as="p" key={line} delay={0.25 + i * 0.16} className="font-sans text-lg font-light tracking-wide text-white/75 sm:text-xl">
                {line}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
