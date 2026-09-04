import { useEffect, useRef } from 'react'
import { AmbientAudio } from './AmbientAudio'
import { assets } from '@/config/assets'
import { useGame } from '@/game/store'

/** Follows the "son" setting: enables / disables the ambient layers. */
export function useAmbientAudio() {
  const son = useGame((s) => s.save?.reglages.son ?? false)
  const ref = useRef<AmbientAudio | null>(null)
  useEffect(() => {
    ref.current = new AmbientAudio(
      [
        { id: 'eau', src: assets.audio.eau, volume: 0.5 },
        { id: 'vent', src: assets.audio.vent, volume: 0.35 },
        { id: 'foret', src: assets.audio.foret, volume: 0.4 },
        { id: 'musique', src: assets.audio.musique, volume: 0.6 },
      ],
      0.8,
      1400,
    )
    return () => ref.current?.destroy()
  }, [])
  useEffect(() => {
    const a = ref.current
    if (!a) return
    if (son && !a.isEnabled) void a.enable()
    if (!son && a.isEnabled) a.disable()
  }, [son])
}
