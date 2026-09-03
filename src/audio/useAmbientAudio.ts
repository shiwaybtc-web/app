import { useCallback, useEffect, useRef, useState } from 'react'
import { AmbientAudio } from './AmbientAudio'
import { siteConfig } from '@/config/site'

export function useAmbientAudio() {
  const ref = useRef<AmbientAudio | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    ref.current = new AmbientAudio(
      siteConfig.sound.layers.map((l) => ({ ...l })),
      siteConfig.sound.masterVolume,
      siteConfig.sound.fadeMs,
    )
    return () => ref.current?.destroy()
  }, [])

  const toggle = useCallback(() => {
    const audio = ref.current
    if (!audio) return
    setEnabled(audio.toggle())
  }, [])

  return { enabled, toggle, hasSources: ref.current?.hasSources ?? false }
}
