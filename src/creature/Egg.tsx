import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { assets } from '@/config/assets'
import { useScene } from '@/world/SceneContext'
import { useAmbience } from '@/world/useAmbience'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  fissures: number
  onTap: () => void
  /** 0 = resting, 1 = fully lit (hatching). */
  eclosion: number
  visible?: boolean
}

const CRACKS = [
  'M52 30 L49 38 L53 46 L48 55',
  'M40 48 L46 54 L44 62 L50 70 L47 78',
  'M61 40 L57 50 L62 58 L58 66 L63 74 M35 60 L41 66 L38 74',
]

/** The egg on the socle: breathing, inner light, cracks, tap reaction. */
export function Egg({ fissures, onTap, eclosion, visible = true }: Props) {
  const t = useScene()
  const amb = useAmbience()
  const reduced = useReducedMotion()
  const def = assets.creature.oeuf
  const h = def.hauteurScene * t.scale
  const w = h / def.ratio
  const pied = def.pied * h
  const [inner, setInner] = useState(0)
  const [wobble, setWobble] = useState(0)
  const mask = { WebkitMaskImage: `url(${def.src})`, maskImage: `url(${def.src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' } as const

  // Occasional inner light pulses.
  useEffect(() => {
    if (reduced) return
    let id = 0
    const loop = () => {
      id = window.setTimeout(() => {
        setInner(0.6 + Math.random() * 0.4)
        window.setTimeout(() => setInner(0), 900)
        loop()
      }, 3500 + Math.random() * 4500)
    }
    loop()
    return () => window.clearTimeout(id)
  }, [reduced])

  const tap = () => {
    setWobble((v) => v + 1)
    onTap()
  }

  const light = Math.max(inner, eclosion)

  return (
    <div className="absolute select-none" style={{ left: -w / 2, top: -pied, width: w, height: h, zIndex: 3 }} data-cursor="glow">
      <div
        aria-hidden
        className="absolute"
        style={{
          left: '10%',
          width: '80%',
          top: pied - h * 0.03,
          height: h * 0.07,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(8,10,30,0.6), rgba(8,10,30,0) 72%)',
          filter: 'blur(4px)',
        }}
      />
      <div
        aria-hidden
        className="absolute"
        style={{
          left: '-25%',
          width: '150%',
          top: pied - h * 0.2,
          height: h * 0.4,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(${amb.cristal},${0.3 + light * 0.5}), rgba(${amb.cristal},0) 65%)`,
          mixBlendMode: 'screen',
          filter: 'blur(8px)',
          transition: 'background 0.8s',
          animation: reduced ? 'none' : 'aura-breathe 6s ease-in-out infinite',
        }}
      />
      <motion.button
        type="button"
        aria-label="L’œuf"
        onClick={tap}
        className="absolute inset-0 outline-none"
        style={{ transformOrigin: '50% 98%' }}
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: visible ? 1 : 0, scale: 1, y: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          key={wobble}
          className="absolute inset-0"
          style={{ transformOrigin: '50% 98%' }}
          animate={wobble && !reduced ? { rotate: [0, -4, 3, -2, 1, 0], scaleX: [1, 1.03, 0.98, 1], scaleY: [1, 0.97, 1.02, 1] } : undefined}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformOrigin: '50% 98%',
              animation: reduced ? 'none' : eclosion > 0 ? `egg-shake ${0.5 - eclosion * 0.3}s linear infinite` : 'egg-breathe 5s ease-in-out infinite',
            }}
          >
            <img src={def.src} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            {/* Inner light, masked to the shell */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                ...mask,
                background: `radial-gradient(ellipse at 50% 60%, rgba(${amb.cristal},${(0.85 * light).toFixed(2)}), rgba(255,255,255,${(0.35 * light).toFixed(2)}) 35%, rgba(${amb.cristal},0) 70%)`,
                mixBlendMode: 'screen',
                transition: 'background 0.9s ease-in-out',
              }}
            />
            {/* Cracks */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
              <defs>
                <filter id="crack-glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="1.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {CRACKS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={`rgba(${amb.cristal},0.95)`}
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  filter="url(#crack-glow)"
                  style={{
                    strokeDasharray: 60,
                    strokeDashoffset: fissures > i ? 0 : 60,
                    transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)',
                    opacity: 0.6 + light * 0.4,
                  }}
                />
              ))}
            </svg>
          </div>
        </motion.div>
      </motion.button>
    </div>
  )
}
