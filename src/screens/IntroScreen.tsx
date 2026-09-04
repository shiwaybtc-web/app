import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { assets } from '@/config/assets'
import { t } from '@/config/texts'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ParticleLayer } from '@/components/ParticleLayer'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = { onEnter: () => void }

/**
 * Title screen: the living valley (video), the wordmark, one button.
 * "Entrer" blooms into light; the sanctuary and its socle appear behind.
 */
export function IntroScreen({ onEnter }: Props) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced) return
    v.play().catch(() => undefined)
  }, [reduced])

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(onEnter, reduced ? 200 : 1500)
  }

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden bg-night-950"
      exit={{ opacity: 0, transition: { duration: 1.6, ease: EASE } }}
      onClick={enter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && enter()}
      aria-label={t.intro.entrer}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: leaving ? 1.12 : 1.04 }}
        transition={{ duration: leaving ? 1.8 : 12, ease: leaving ? EASE : 'linear' }}
      >
        <img src={assets.world.introVideo.poster} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
        {!reduced && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={assets.world.introVideo.poster}
            disablePictureInPicture
            aria-hidden
          >
            <source src={assets.world.introVideo.webm} type="video/webm" />
            <source src={assets.world.introVideo.mp4} type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(7,11,26,0.25) 0%, rgba(4,6,15,0.7) 100%)' }} />
      <ParticleLayer active={!leaving} celeste={0.3} />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
          animate={leaving ? { opacity: 0, y: -10, filter: 'blur(14px)', scale: 1.04 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: leaving ? 1 : 1.8, ease: EASE, delay: leaving ? 0 : 0.3 }}
        >
          <Logo variant="hero" shimmer={!reduced} />
        </motion.div>
        <motion.p
          className="mt-8 font-sans text-[0.78rem] font-light tracking-[0.3em] text-white/70 sm:text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={leaving ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: leaving ? 0.5 : 1.2, ease: EASE, delay: leaving ? 0 : 1 }}
        >
          {t.intro.accroche}
        </motion.p>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={leaving ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: leaving ? 0.4 : 1.2, delay: leaving ? 0 : 1.7 }}
        >
          <Button size="lg" onClick={enter}>
            {t.intro.entrer}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {leaving && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(255,255,255,1), rgba(230,222,255,0.85) 35%, rgba(150,130,255,0.3) 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
