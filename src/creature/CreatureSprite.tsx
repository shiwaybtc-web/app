import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { assets } from '@/config/assets'
import { auraPresets } from '@/config/shop'
import { useScene } from '@/world/SceneContext'
import { useAmbience } from '@/world/useAmbience'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spriteReactions, clipDurationsMs } from './animations'
import type { Reaction } from '@/game/store'

type Props = {
  reaction: Reaction | null
  aura: string
  onTap?: () => void
  humeur?: string
  visible?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Samples the sprite colour just above each eye so the eyelids match the skin. */
function useEyelidColors(src: string, yeux: ReadonlyArray<{ x: number; y: number }>) {
  const [colors, setColors] = useState<string[]>([])
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width
      c.height = img.height
      const ctx = c.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      setColors(
        yeux.map((e) => {
          const x = Math.round((e.x / 100) * img.width)
          const y = Math.round((e.y / 100 - 0.035) * img.height)
          const d = ctx.getImageData(x, y, 1, 1).data
          return `rgb(${d[0]},${d[1]},${d[2]})`
        }),
      )
    }
  }, [src, yeux])
  return colors
}

/**
 * The 2.5D creature: image + contact shadow + reflection + aura + crystal glows,
 * with breathing, bobbing, blinking, ambience sheens and one-shot reactions.
 */
export function CreatureSprite({ reaction, aura, onTap, visible = true }: Props) {
  const t = useScene()
  const amb = useAmbience()
  const reduced = useReducedMotion()
  const def = assets.creature.bebe
  const h = def.hauteurScene * t.scale
  const w = h / def.ratio
  const pied = def.pied * h
  const auraPreset = auraPresets[aura] ?? auraPresets.ivoire
  const eyelids = useEyelidColors(def.src, def.yeux)
  const [blink, setBlink] = useState(false)
  const mask = { WebkitMaskImage: `url(${def.src})`, maskImage: `url(${def.src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' } as const

  // Blink every few seconds.
  useEffect(() => {
    if (reduced || !visible) return
    let id = 0
    const loop = () => {
      id = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 130)
        if (Math.random() < 0.25) {
          window.setTimeout(() => setBlink(true), 300)
          window.setTimeout(() => setBlink(false), 430)
        }
        loop()
      }, 2800 + Math.random() * 3800)
    }
    loop()
    return () => window.clearTimeout(id)
  }, [reduced, visible])

  // One-shot reaction keyframes.
  const reactionAnim = useMemo(() => {
    if (!reaction || reduced) return undefined
    const kf = spriteReactions[reaction.clip]
    if (!kf) return undefined
    return { ...kf, transition: { duration: clipDurationsMs[reaction.clip] / 1000, ease: 'easeOut' as const } }
  }, [reaction, reduced])
  const bodyRef = useRef<HTMLDivElement>(null)

  const brightness = 1 - amb.poids.nuit * 0.18 - (amb.meteo === 'orage' || amb.meteo === 'pluie' ? 0.06 : 0)

  return (
    <div
      className="absolute select-none"
      style={{ left: -w / 2, top: -pied, width: w, height: h, zIndex: 3 }}
      data-cursor="glow"
    >
      {/* Contact shadow on the socle */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: '12%',
          width: '76%',
          top: pied - h * 0.035,
          height: h * 0.075,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(8,10,30,0.62), rgba(8,10,30,0.25) 50%, rgba(8,10,30,0) 75%)',
          filter: 'blur(5px)',
        }}
      />
      {/* Aura under and behind the body */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: '-10%',
          width: '120%',
          top: pied - h * 0.16,
          height: h * 0.3,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 55%, rgba(${auraPreset.couleur},${auraPreset.intensite * (0.7 + amb.cristalIntensite * 0.5)}), rgba(${auraPreset.couleur},0) 65%)`,
          mixBlendMode: 'screen',
          filter: 'blur(6px)',
          animation: reduced ? 'none' : 'aura-breathe 5.5s ease-in-out infinite',
        }}
      />
      {/* Reflection on the polished socle */}
      <div
        aria-hidden
        className="absolute left-0 w-full overflow-hidden"
        style={{ top: pied - 2, height: h * 0.42, opacity: 0.16 + amb.poids.nuit * 0.06 }}
      >
        <img
          src={def.src}
          alt=""
          className="absolute left-0 w-full"
          style={{
            top: -h * 0.58,
            height: h,
            transform: 'scaleY(-0.42)',
            transformOrigin: '50% 100%',
            filter: 'blur(1.5px)',
            WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 60%)',
            maskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 60%)',
          }}
        />
      </div>

      {/* Body */}
      <motion.button
        type="button"
        ref={bodyRef as never}
        aria-label="Votre Nexa"
        onClick={onTap}
        className="absolute inset-0 origin-bottom outline-none"
        style={{ transformOrigin: '50% 97%' }}
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: visible ? 1 : 0, scale: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <motion.div
          key={reaction?.id ?? 'idle'}
          className="absolute inset-0"
          style={{ transformOrigin: '50% 97%' }}
          animate={reactionAnim}
        >
          <div
            className="absolute inset-0"
            style={{
              transformOrigin: '50% 97%',
              animation: reduced ? 'none' : 'creature-idle 4.6s ease-in-out infinite',
            }}
          >
            <img
              src={def.src}
              alt=""
              className="absolute inset-0 h-full w-full"
              draggable={false}
              style={{ filter: `brightness(${brightness.toFixed(3)})`, transition: 'filter 2s' }}
            />
            {/* Crystal glows: screen-blended, tinted by the hour and the weather. */}
            {def.cristaux.map((c, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute block rounded-full"
                style={{
                  left: `${c.x - c.r}%`,
                  top: `${(c.y - c.r / def.ratio) - 1}%`,
                  width: `${c.r * 2}%`,
                  paddingTop: `${c.r * 2}%`,
                  background: `radial-gradient(circle, rgba(${amb.cristal},${(0.55 * amb.cristalIntensite).toFixed(2)}), rgba(${amb.cristal},0) 68%)`,
                  mixBlendMode: 'screen',
                  filter: 'blur(3px)',
                  transition: 'background 2s',
                  animation: reduced ? 'none' : `crystal-pulse ${4 + (i % 3)}s ease-in-out ${i * 0.6}s infinite`,
                }}
              />
            ))}
            {/* Sheen (sun / rain / cold), masked to the body silhouette. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                ...mask,
                background: `linear-gradient(135deg, rgba(${amb.reflet},${amb.refletIntensite}) 0%, rgba(${amb.reflet},0) 55%)`,
                mixBlendMode: 'screen',
                transition: 'background 2s',
              }}
            />
            {/* Frost at the base when it is cold. */}
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-[2000ms]"
              style={{
                ...mask,
                background: 'linear-gradient(0deg, rgba(205,232,255,0.45) 0%, rgba(205,232,255,0) 38%)',
                mixBlendMode: 'screen',
                opacity: amb.givre ? 1 : 0,
              }}
            />
            {/* Electric pulses during storms. */}
            {amb.pulsations && !reduced && (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  ...mask,
                  background: 'radial-gradient(ellipse at 45% 30%, rgba(190,170,255,0.6), rgba(190,170,255,0) 60%)',
                  mixBlendMode: 'screen',
                  animation: 'storm-pulse 3.2s ease-in-out infinite',
                }}
              />
            )}
            {/* Night: the body dims slightly but the luminous parts stay. */}
            {/* Eyelids */}
            {eyelids.length === 2 &&
              def.yeux.map((e, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute block"
                  style={{
                    left: `${e.x - 4.2}%`,
                    top: `${e.y - 3.4}%`,
                    width: '8.4%',
                    height: '6.2%',
                    borderRadius: '50% 50% 45% 45%',
                    background: eyelids[i],
                    filter: 'blur(0.6px)',
                    transformOrigin: '50% 0%',
                    transform: blink ? 'scaleY(1)' : 'scaleY(0)',
                    transition: 'transform 70ms ease-in',
                  }}
                />
              ))}
          </div>
        </motion.div>
      </motion.button>

      {/* Sparkles drifting up around the creature */}
      {!reduced &&
        Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute block rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              bottom: `${8 + (i % 2) * 6}%`,
              width: 3,
              height: 3,
              background: `rgba(${amb.cristal},0.95)`,
              boxShadow: `0 0 8px 1px rgba(${amb.cristal},0.7)`,
              animation: `lueur-monte ${6 + (i % 3) * 2}s ease-in-out ${i * 1.1}s infinite`,
              opacity: 0,
            }}
          />
        ))}
    </div>
  )
}
