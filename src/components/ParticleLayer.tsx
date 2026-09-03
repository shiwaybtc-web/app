import { useEffect, useRef } from 'react'
import { siteConfig } from '@/config/site'
import { getPointer } from '@/lib/pointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  phase: number
  speed: number
  hue: 'white' | 'violet' | 'blue' | 'gold'
  firefly: boolean
}

const COLORS = {
  white: [244, 242, 255],
  violet: [201, 184, 255],
  blue: [169, 216, 255],
  gold: [243, 228, 184],
} as const

/**
 * Floating light motes and a few fireflies drawn on a canvas.
 * Particles drift slowly, breathe, and lean gently away from the cursor.
 */
export function ParticleLayer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pointer = getPointer()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let last = performance.now()
    let running = true

    const isSmall = () => window.innerWidth < siteConfig.video.mobileMaxWidth

    const spawn = (firefly: boolean): Particle => {
      const hues: Particle['hue'][] = firefly ? ['gold', 'white'] : ['white', 'violet', 'blue']
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (firefly ? 18 : 6),
        vy: -(Math.random() * (firefly ? 10 : 7) + 2),
        r: firefly ? 1.6 + Math.random() * 1.2 : 0.7 + Math.random() * 1.3,
        alpha: 0.25 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
        hue: hues[Math.floor(Math.random() * hues.length)],
        firefly,
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const small = isSmall()
      const motes = small ? siteConfig.animation.particles.mobile : siteConfig.animation.particles.desktop
      const flies = small ? siteConfig.animation.fireflies.mobile : siteConfig.animation.fireflies.desktop
      particles = [
        ...Array.from({ length: motes }, () => spawn(false)),
        ...Array.from({ length: flies }, () => spawn(true)),
      ]
    }

    const draw = (now: number) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, width, height)

      const influence = 140
      for (const p of particles) {
        p.phase += dt * p.speed
        // Fireflies wander; motes drift.
        if (p.firefly) {
          p.vx += Math.sin(p.phase * 1.7) * 14 * dt
          p.vy += Math.cos(p.phase * 1.3) * 10 * dt
        }
        // Gentle repulsion from the pointer.
        if (pointer.active && !pointer.coarse) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < influence * influence && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const force = ((influence - d) / influence) * 26
            p.vx += (dx / d) * force * dt
            p.vy += (dy / d) * force * dt
          }
        }
        // Damping keeps velocities calm.
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.y < -20) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -20) p.x = width + 10
        if (p.x > width + 20) p.x = -10
        if (p.y > height + 20) p.y = -10

        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * (p.firefly ? 2.2 : 1) + p.phase)
        const a = p.alpha * twinkle
        const [r, g, b] = COLORS[p.hue]

        if (p.firefly) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
          glow.addColorStop(0, `rgba(${r},${g},${b},${a * 0.55})`)
          glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      frame = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running) {
        last = performance.now()
        frame = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, active])

  if (reduced) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-[1500ms]"
      style={{ opacity: active ? 1 : 0, mixBlendMode: 'screen' }}
    />
  )
}
