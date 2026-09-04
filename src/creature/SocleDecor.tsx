import { assets } from '@/config/assets'
import { useScene } from '@/world/SceneContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  preset: string
  /** Aura colour as "r, g, b". */
  couleur: string
}

/** Optional cosmetic decorations drawn on the socle around the creature. */
export function SocleDecor({ preset, couleur }: Props) {
  const t = useScene()
  const reduced = useReducedMotion()
  const rx = assets.world.socle.rx * 0.62 * t.scale
  const ry = assets.world.socle.ry * 0.62 * t.scale
  if (preset === 'nu') return null
  if (preset === 'runique') {
    return (
      <div className="pointer-events-none absolute" style={{ left: -rx, top: -ry, width: rx * 2, height: ry * 2, zIndex: 1 }} aria-hidden>
        <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="none" style={{ opacity: 0.85 }}>
          <g style={{ transformOrigin: '100px 100px', animation: reduced ? 'none' : 'spin-slow 60s linear infinite' }}>
            <circle cx="100" cy="100" r="94" fill="none" stroke={`rgba(${couleur},0.55)`} strokeWidth="0.8" strokeDasharray="3 7 12 7" />
            <circle cx="100" cy="100" r="82" fill="none" stroke={`rgba(${couleur},0.35)`} strokeWidth="0.5" strokeDasharray="1 5" />
          </g>
          <g style={{ transformOrigin: '100px 100px', animation: reduced ? 'none' : 'spin-slow 90s linear infinite reverse' }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke={`rgba(${couleur},0.4)`} strokeWidth="0.6" strokeDasharray="20 10 4 10" />
          </g>
        </svg>
      </div>
    )
  }
  if (preset === 'lueurs') {
    return (
      <div className="pointer-events-none absolute" style={{ left: -rx, top: -ry * 3, width: rx * 2, height: ry * 4, zIndex: 1 }} aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              left: `${8 + (i * 11) % 84}%`,
              bottom: `${10 + (i % 3) * 8}%`,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              background: `rgba(${couleur},0.9)`,
              boxShadow: `0 0 10px 2px rgba(${couleur},0.6)`,
              animation: reduced ? 'none' : `lueur-monte ${5 + (i % 4) * 1.5}s ease-in-out ${i * 0.7}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    )
  }
  return null
}
