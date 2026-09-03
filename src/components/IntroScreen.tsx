import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'
import { siteConfig } from '@/config/site'
import { sampleLetters } from '@/lib/textParticles'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  onEnter: () => void
}

type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  delay: number
  tint: number
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Full-screen introduction: the wordmark over the blurred, darkened world.
 * Clicking pulses the logo, dissolves it into light and hands over to the app.
 */
export function IntroScreen({ onEnter }: Props) {
  const logoRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'pulse' | 'dissolve' | 'done'>('idle')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.body.classList.add('intro-locked')
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && setReady(true)).catch(() => setReady(true))
    const fallback = window.setTimeout(() => setReady(true), 900)
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
      document.body.classList.remove('intro-locked')
    }
  }, [])

  const runDissolve = useCallback(() => {
    const logo = logoRef.current
    const canvas = canvasRef.current
    if (!logo || !canvas || reduced) {
      setPhase('done')
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setPhase('done')
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const step = window.innerWidth < 640 ? 2 : 3
    const points = sampleLetters(logo, step)
    const rect = logo.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const motes: Mote[] = points.map((p) => {
      const dx = p.x - cx
      const dy = p.y - cy
      const dist = Math.hypot(dx, dy) || 1
      const outward = 40 + Math.random() * 120
      return {
        x: p.x,
        y: p.y,
        vx: (dx / dist) * outward + (Math.random() - 0.5) * 60,
        vy: (dy / dist) * outward * 0.6 - 70 - Math.random() * 80,
        r: 0.8 + Math.random() * 1.4,
        delay: Math.random() * 0.14 + (Math.abs(dx) / (rect.width / 2)) * 0.22,
        tint: Math.random(),
      }
    })

    setPhase('dissolve')
    const duration = 1.45
    const t0 = performance.now()
    let frame = 0

    const draw = (now: number) => {
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      let alive = false
      for (const m of motes) {
        const lt = t - m.delay
        if (lt < 0) {
          // Not yet released: hold in place as a dense field of light.
          ctx.fillStyle = 'rgba(244,242,255,0.92)'
          ctx.beginPath()
          ctx.arc(m.x, m.y, step * 0.62, 0, Math.PI * 2)
          ctx.fill()
          alive = true
          continue
        }
        const p = lt / duration
        if (p >= 1) continue
        alive = true
        const ease = 1 - Math.pow(1 - p, 3)
        const x = m.x + m.vx * ease * 1.6
        const y = m.y + m.vy * ease * 1.6 + 30 * p * p
        const a = (1 - p) * 0.95
        const r = m.r * (1 + p * 0.6)
        const color = m.tint < 0.55 ? '244,242,255' : m.tint < 0.85 ? '201,184,255' : '169,216,255'
        ctx.fillStyle = `rgba(${color},${a})`
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (alive) {
        frame = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        setPhase('done')
      }
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  const enter = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('pulse')
    // Hand control to the main interface as soon as the dissolve starts:
    // the blur lifts while the letters are still scattering.
    window.setTimeout(() => {
      runDissolve()
      onEnter()
    }, reduced ? 0 : 260)
  }, [phase, runDissolve, onEnter, reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter])

  const introMs = siteConfig.animation.introTransitionMs

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          onClick={enter}
          role="button"
          tabIndex={0}
          aria-label={`${siteConfig.brand.enterHint} ${siteConfig.brand.name}`}
        >
          {/* Blur + darkness over the living world. Fades away on enter. */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(7,11,26,0.45) 0%, rgba(4,6,15,0.78) 100%)',
              willChange: 'opacity, backdrop-filter',
            }}
            initial={{ opacity: 1, backdropFilter: 'blur(18px) saturate(0.85)', WebkitBackdropFilter: 'blur(18px) saturate(0.85)' }}
            animate={
              phase === 'dissolve' || phase === 'pulse'
                ? { opacity: 0, backdropFilter: 'blur(0px) saturate(1)', WebkitBackdropFilter: 'blur(0px) saturate(1)' }
                : { opacity: 1, backdropFilter: 'blur(18px) saturate(0.85)', WebkitBackdropFilter: 'blur(18px) saturate(0.85)' }
            }
            transition={{ duration: introMs / 1000, ease: 'easeInOut', delay: phase === 'pulse' ? 0.3 : 0 }}
          />

          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              data-cursor="glow"
              className="group relative"
              initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
              animate={
                phase === 'pulse'
                  ? { opacity: 1, y: 0, scale: [1, 1.035, 0.99, 1.01], filter: 'blur(0px)' }
                  : ready
                    ? { opacity: phase === 'dissolve' ? 0 : 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    : {}
              }
              transition={
                phase === 'pulse'
                  ? { duration: 0.32, ease: 'easeOut' }
                  : phase === 'dissolve'
                    ? { duration: 0.05 }
                    : { duration: 1.6, ease: EASE, delay: 0.2 }
              }
            >
              {/* Aura */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(157,124,255,0.22) 0%, rgba(127,192,255,0.10) 40%, rgba(0,0,0,0) 70%)',
                  filter: 'blur(18px)',
                }}
              />
              <Logo ref={logoRef} variant="hero" shimmer={!reduced} />
            </motion.div>

            <motion.p
              className="mt-7 font-sans text-[0.78rem] font-light tracking-[0.32em] text-white/70 sm:mt-9 sm:text-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={ready ? { opacity: phase === 'idle' ? 1 : 0, y: 0 } : {}}
              transition={phase === 'idle' ? { duration: 1.2, ease: EASE, delay: 0.9 } : { duration: 0.3 }}
            >
              {siteConfig.brand.tagline}
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col items-center gap-3 sm:mt-16"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: phase === 'idle' ? 1 : 0 } : {}}
              transition={phase === 'idle' ? { duration: 1.2, ease: EASE, delay: 1.5 } : { duration: 0.25 }}
            >
              <motion.span
                className="font-sans text-[0.62rem] uppercase tracking-[0.36em] text-white/45"
                animate={reduced ? {} : { opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {siteConfig.brand.enterHint}
              </motion.span>
              <span className="hairline w-16 opacity-60" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
