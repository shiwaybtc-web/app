import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '@/lib/scroll'

/** Smooth, inertial scrolling. Disabled when reduced motion is preferred or while locked. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    setLenis(lenis)
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])
}
