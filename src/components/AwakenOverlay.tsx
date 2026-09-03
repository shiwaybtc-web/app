import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Placeholder for the future awakening sequence. Currently: a bloom of light,
 * an egg-shaped glow breathing in the dark, and a short message.
 * Swap the inner content for the egg / creature reveal when it is ready.
 */
export function AwakenOverlay({ open, onClose }: Props) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal
          aria-label={siteConfig.hero.awaken.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={onClose}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 55%, rgba(11,18,38,0.82), rgba(4,6,15,0.96))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Light bloom */}
          {!reduced && (
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.85), rgba(201,184,255,0.35) 30%, rgba(0,0,0,0) 70%)' }}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
          )}

          <div className="relative flex flex-col items-center gap-8 px-6 text-center">
            {/* Egg-shaped glow: future home of the creature reveal. */}
            <motion.div
              aria-hidden
              className="relative h-40 w-32 sm:h-52 sm:w-40"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  background:
                    'radial-gradient(ellipse at 42% 32%, rgba(255,250,235,0.95), rgba(243,228,184,0.55) 28%, rgba(180,155,255,0.35) 58%, rgba(157,124,255,0) 76%)',
                  filter: 'blur(6px)',
                }}
                animate={reduced ? {} : { scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                className="absolute inset-[18%]"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  border: '1px solid rgba(255,255,255,0.45)',
                  background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.25), rgba(233,211,154,0.08) 45%, rgba(4,6,15,0) 80%)',
                  boxShadow: 'inset 0 0 34px rgba(243,228,184,0.35), 0 0 60px rgba(157,124,255,0.35)',
                }}
              />
            </motion.div>

            <motion.h2
              className="font-display text-2xl uppercase tracking-wide2 text-white text-glow-soft sm:text-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            >
              {siteConfig.hero.awaken.title}
            </motion.h2>
            <motion.p
              className="max-w-sm font-sans text-sm font-light leading-relaxed text-white/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.95 }}
            >
              {siteConfig.hero.awaken.subtitle}
            </motion.p>
            <motion.button
              type="button"
              data-cursor="glow"
              className="nav-link mt-2 font-sans text-[0.62rem] uppercase tracking-[0.36em] text-white/55"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              {siteConfig.hero.awaken.dismiss}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
