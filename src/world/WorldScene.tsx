import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { assets } from '@/config/assets'
import { useScene } from './SceneContext'
import { AmbientLayers } from './AmbientLayers'
import { WeatherEffects } from './WeatherEffects'
import { useAmbience } from './useAmbience'
import { ParticleLayer } from '@/components/ParticleLayer'
import { getPointer } from '@/lib/pointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  children?: ReactNode
  /** Extra zoom used by the intro "dolly" (1 = rest). */
  zoom?: number
  interactif?: boolean
}

/**
 * The sanctuary: scene image framed on the socle, ambient light following the
 * real time of day, weather, floating light. Children are placed in scene
 * coordinates (see <SceneAnchor />) so they sit on the socle at any size.
 */
export function WorldScene({ children, zoom = 1, interactif = true }: Props) {
  const t = useScene()
  const amb = useAmbience()
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const { width: W, height: H } = assets.world.sanctuaireSize

  // Subtle pointer parallax (desktop only).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 30, damping: 20 })
  const sy = useSpring(py, { stiffness: 30, damping: 20 })
  const frame = useRef(0)
  useEffect(() => {
    const pointer = getPointer()
    if (reduced || !interactif || pointer.coarse) return
    const tick = () => {
      px.set(-pointer.nx * 7)
      py.set(-pointer.ny * 4)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [reduced, interactif, px, py])

  return (
    <div className="absolute inset-0 overflow-hidden bg-night-950" aria-hidden={!interactif}>
      <motion.div
        className="absolute inset-0"
        animate={{ scale: zoom }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${t.x + assets.world.socle.x * t.scale}px ${t.y + assets.world.socle.y * t.scale}px` }}
      >
        <motion.div className="absolute inset-0" style={{ x: sx, y: sy, scale: reduced ? 1 : 1.02 }}>
          <div
            className="absolute"
            style={{ left: t.x, top: t.y, width: W * t.scale, height: H * t.scale }}
          >
            <img
              src={assets.world.sanctuairePreview}
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ filter: 'blur(14px)', transform: 'scale(1.04)' }}
              aria-hidden
            />
            <img
              src={assets.world.sanctuaire}
              alt="Le sanctuaire de NEXA"
              className="absolute inset-0 h-full w-full transition-opacity duration-1000"
              style={{ opacity: loaded ? 1 : 0 }}
              onLoad={() => setLoaded(true)}
              decoding="async"
            />
            <AmbientLayers poids={amb.poids} meteo={amb.meteo} />
            {/* Living light drifting across the socle surface. */}
            {!reduced && (
              <div
                className="pointer-events-none absolute"
                style={{
                  left: `${((assets.world.socle.x - assets.world.socle.rx) / W) * 100}%`,
                  top: `${((assets.world.socle.y - assets.world.socle.ry * 1.6) / H) * 100}%`,
                  width: `${((assets.world.socle.rx * 2) / W) * 100}%`,
                  height: `${((assets.world.socle.ry * 3.2) / H) * 100}%`,
                  background: `radial-gradient(ellipse at 50% 50%, rgba(${amb.cristal},0.22), rgba(${amb.cristal},0) 60%)`,
                  mixBlendMode: 'screen',
                  animation: 'socle-light 14s ease-in-out infinite',
                }}
              />
            )}
            {children}
          </div>
        </motion.div>
      </motion.div>
      <WeatherEffects meteo={amb.meteo} />
      <ParticleLayer active={interactif} celeste={amb.poids.nuit} />
      {/* Legibility gradients for the top bar and the action bar. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36" style={{ background: 'linear-gradient(180deg, rgba(4,6,15,0.55), rgba(4,6,15,0))' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44" style={{ background: 'linear-gradient(0deg, rgba(4,6,15,0.62), rgba(4,6,15,0))' }} />
    </div>
  )
}

/** Places children at a point of the scene (scene pixel coordinates). */
export function SceneAnchor({ x, y, children, z = 2 }: { x: number; y: number; children: ReactNode; z?: number }) {
  const t = useScene()
  return (
    <div className="absolute" style={{ left: x * t.scale, top: y * t.scale, zIndex: z }}>
      {children}
    </div>
  )
}
