import { useEffect, useRef, useState } from 'react'
import type { WeatherKind } from '@/types/world'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Drop = { x: number; y: number; vx: number; vy: number; l: number; a: number; r: number }

/** Precipitation on a canvas plus storm flashes. Nothing runs when the sky is calm. */
export function WeatherEffects({ meteo }: { meteo: WeatherKind }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [flash, setFlash] = useState(0)
  const precip = meteo === 'pluie' || meteo === 'orage' || meteo === 'neige'

  useEffect(() => {
    if (reduced || !precip) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let drops: Drop[] = []
    let frame = 0
    let last = performance.now()
    const snow = meteo === 'neige'
    const count = snow ? (window.innerWidth < 768 ? 60 : 110) : window.innerWidth < 768 ? 90 : 170

    const spawn = (init = false): Drop => ({
      x: Math.random() * w,
      y: init ? Math.random() * h : -20,
      vx: snow ? (Math.random() - 0.5) * 18 : -40 - Math.random() * 30,
      vy: snow ? 22 + Math.random() * 28 : 620 + Math.random() * 380,
      l: snow ? 0 : 10 + Math.random() * 16,
      a: snow ? 0.5 + Math.random() * 0.4 : 0.18 + Math.random() * 0.25,
      r: snow ? 1 + Math.random() * 2 : 0,
    })
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops = Array.from({ length: count }, () => spawn(true))
    }
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const d of drops) {
        if (snow) d.vx += Math.sin(now / 900 + d.y * 0.01) * 6 * dt
        d.x += d.vx * dt
        d.y += d.vy * dt
        if (d.y > h + 20 || d.x < -30) Object.assign(d, spawn())
        if (snow) {
          ctx.fillStyle = `rgba(235,242,255,${d.a})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.strokeStyle = `rgba(200,220,255,${d.a})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x + d.vx * 0.018, d.y + d.l)
          ctx.stroke()
        }
      }
      frame = requestAnimationFrame(draw)
    }
    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, w, h)
    }
  }, [meteo, precip, reduced])

  // Storm flashes: rare, short, never aggressive.
  useEffect(() => {
    if (meteo !== 'orage' || reduced) return
    let t = 0
    const schedule = () => {
      t = window.setTimeout(() => {
        setFlash(0.35 + Math.random() * 0.25)
        window.setTimeout(() => setFlash(0), 140)
        if (Math.random() < 0.4) window.setTimeout(() => setFlash(0.2), 260)
        window.setTimeout(() => setFlash(0), 420)
        schedule()
      }, 5000 + Math.random() * 9000)
    }
    schedule()
    return () => window.clearTimeout(t)
  }, [meteo, reduced])

  return (
    <>
      {precip && !reduced && <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-150"
        style={{ background: 'radial-gradient(ellipse at 70% 10%, rgba(220,225,255,0.9), rgba(180,190,255,0.35) 45%, rgba(0,0,0,0) 75%)', opacity: flash }}
      />
    </>
  )
}
