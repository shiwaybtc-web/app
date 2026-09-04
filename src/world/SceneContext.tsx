import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { assets } from '@/config/assets'

export type SceneTransform = {
  scale: number
  x: number
  y: number
  vw: number
  vh: number
  portrait: boolean
}

const SceneCtx = createContext<SceneTransform | null>(null)

/**
 * Computes a "focus cover" transform: the scene image covers the viewport
 * and the socle anchor is kept near a chosen point of the screen, so the
 * creature is always framed on the socle whatever the device.
 */
export function calculerTransform(vw: number, vh: number): SceneTransform {
  const { width: W, height: H } = assets.world.sanctuaireSize
  const { x: sx, y: sy } = assets.world.socle
  const portrait = vh > vw
  const scale = Math.max(vw / W, vh / H)
  const cibleX = 0.5 * vw
  const cibleY = (portrait ? 0.6 : 0.68) * vh
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
  const x = clamp(cibleX - sx * scale, vw - W * scale, 0)
  const y = clamp(cibleY - sy * scale, vh - H * scale, 0)
  return { scale, x, y, vw, vh, portrait }
}

export function SceneProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }))
    }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [])
  const value = useMemo(() => calculerTransform(size.w, size.h), [size])
  return <SceneCtx.Provider value={value}>{children}</SceneCtx.Provider>
}

export function useScene() {
  const ctx = useContext(SceneCtx)
  if (!ctx) throw new Error('useScene doit être utilisé dans <SceneProvider>')
  return ctx
}

/** Converts scene pixel coordinates to viewport pixels. */
export function useSceneToScreen() {
  const t = useScene()
  return (x: number, y: number) => ({ left: t.x + x * t.scale, top: t.y + y * t.scale })
}
