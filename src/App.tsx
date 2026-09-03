import { useCallback, useRef, useState } from 'react'
import { useScroll } from 'framer-motion'
import { Cursor } from '@/components/Cursor'
import { VideoBackground } from '@/components/VideoBackground'
import { ParticleLayer } from '@/components/ParticleLayer'
import { IntroScreen } from '@/components/IntroScreen'
import { Navbar } from '@/components/Navbar'
import { HeroCenter } from '@/components/HeroCenter'
import { ScrollHint } from '@/components/ScrollHint'
import { SoundToggle } from '@/components/SoundToggle'
import { AwakenOverlay } from '@/components/AwakenOverlay'
import { WorldAlive } from '@/sections/WorldAlive'
import { CreatureTeaser } from '@/sections/CreatureTeaser'
import { MapPreview } from '@/sections/MapPreview'
import { Footer } from '@/sections/Footer'
import { useLenis } from '@/hooks/useLenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAmbientAudio } from '@/audio/useAmbientAudio'
import { cn } from '@/lib/cn'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [awakening, setAwakening] = useState(false)
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  // Hero scroll progress drives the background shade and the scroll hint.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  useLenis(entered && !reduced)
  const audio = useAmbientAudio()

  const handleEnter = useCallback(() => setEntered(true), [])
  const openAwaken = useCallback(() => setAwakening(true), [])
  const closeAwaken = useCallback(() => setAwakening(false), [])

  return (
    <>
      <Cursor />
      <VideoBackground entered={entered} scrollProgress={scrollYProgress} />
      <ParticleLayer active={entered} />

      <IntroScreen onEnter={handleEnter} />

      <div
        id="top"
        className={cn(
          'relative z-10 transition-opacity duration-[1200ms] ease-premium',
          entered ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!entered}
      >
        {entered && <Navbar />}

        <section ref={heroRef} className="relative h-[100svh] min-h-[560px]">
          {entered && (
            <>
              <HeroCenter onAwaken={openAwaken} />
              <ScrollHint progress={scrollYProgress} />
            </>
          )}
        </section>

        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,6,15,0) 0%, rgba(4,6,15,0.55) 12%, rgba(4,6,15,0.82) 30%, rgba(4,6,15,0.9) 100%)',
          }}
        >
          <WorldAlive />
          <CreatureTeaser />
          <MapPreview />
          <Footer />
        </div>
      </div>

      <SoundToggle enabled={audio.enabled} onToggle={audio.toggle} visible={entered} />
      <AwakenOverlay open={awakening} onClose={closeAwaken} />
    </>
  )
}
