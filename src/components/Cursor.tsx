import { useEffect, useRef } from 'react'
import { getPointer } from '@/lib/pointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * A small luminous cursor that follows the pointer with a little inertia and
 * blooms when hovering elements marked with data-cursor="glow".
 * Only enabled for fine pointers (mouse / trackpad).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const pointer = getPointer()
    if (pointer.coarse) return
    document.body.classList.add('has-custom-cursor')

    let hx = pointer.x
    let hy = pointer.y
    let frame = 0
    const lerp = reduced ? 1 : 0.16

    const tick = () => {
      const dot = dotRef.current
      const halo = haloRef.current
      if (dot && halo) {
        hx += (pointer.x - hx) * lerp
        hy += (pointer.y - hy) * lerp
        const visible = pointer.active ? 1 : 0
        const scale = pointer.hovering ? 2.6 : 1
        dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
        dot.style.opacity = String(visible)
        halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%) scale(${scale})`
        halo.style.opacity = String(visible * (pointer.hovering ? 0.95 : 0.55))
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full opacity-0 mix-blend-screen transition-[width,height] duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(214,198,255,0.55) 0%, rgba(157,124,255,0.28) 35%, rgba(127,192,255,0) 70%)',
          willChange: 'transform, opacity',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-white opacity-0 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
        style={{ willChange: 'transform, opacity' }}
      />
    </>
  )
}
