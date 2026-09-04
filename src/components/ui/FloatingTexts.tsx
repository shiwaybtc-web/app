import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/game/store'

/** "+12 XP"-style texts rising above the creature. */
export function FloatingTexts() {
  const flottants = useGame((s) => s.ui.flottants)
  return (
    <div className="pointer-events-none absolute left-0 top-0" aria-live="polite">
      <AnimatePresence>
        {flottants.map((f) => (
          <motion.span
            key={f.id}
            className="absolute whitespace-nowrap font-display text-[0.95rem] tracking-[0.18em] text-white text-glow-soft"
            style={{ left: f.dx ?? 0, color: f.couleur }}
            initial={{ opacity: 0, y: 0, x: '-50%', scale: 0.9 }}
            animate={{ opacity: [0, 1, 1, 0], y: -70, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.7, ease: 'easeOut' }}
          >
            {f.texte}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
