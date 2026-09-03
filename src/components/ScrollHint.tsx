import { motion, useTransform, type MotionValue } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { scrollToHash } from '@/lib/scroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion()
  const opacity = useTransform(progress, [0, 0.12], [1, 0])
  return (
    <motion.button
      type="button"
      data-cursor="glow"
      style={{ opacity }}
      className="group absolute bottom-[calc(4.6rem+env(safe-area-inset-bottom))] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-sans text-[0.6rem] uppercase tracking-[0.34em] text-white/45 transition-colors duration-500 hover:text-white/80"
      onClick={() => scrollToHash('#world')}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.6 }}
      aria-label={siteConfig.hero.scrollHint}
    >
      <span>{siteConfig.hero.scrollHint}</span>
      <span
        className="block text-[0.7rem]"
        style={{ animation: reduced ? 'none' : 'hint-arrow 2.6s ease-in-out infinite' }}
        aria-hidden
      >
        ↓
      </span>
    </motion.button>
  )
}
