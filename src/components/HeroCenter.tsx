import { motion } from 'framer-motion'
import { AwakenButton } from './AwakenButton'
import { siteConfig } from '@/config/site'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  onAwaken: () => void
}

export function HeroCenter({ onAwaken }: Props) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end pb-[18vh] sm:pb-[15vh]">
      {/* Bottom gradient: keeps the call-to-action readable over crystals and grass. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,6,15,0) 0%, rgba(4,6,15,0.28) 40%, rgba(4,6,15,0.55) 100%)',
        }}
      />
      <motion.p
        className="relative mb-4 font-display text-[clamp(1.05rem,2.3vw,1.6rem)] font-normal tracking-[0.18em] text-white text-shadow-legible sm:mb-6"
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
      >
        {siteConfig.hero.title}
      </motion.p>
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.8 }}
      >
        <AwakenButton onAwaken={onAwaken} />
      </motion.div>
    </div>
  )
}
