import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/game/store'
import { t } from '@/config/texts'
import { gameConfig } from '@/config/game'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/** Level-up celebration: rings of light, then the new level. Tap to dismiss. */
export function LevelUpOverlay() {
  const niveau = useGame((s) => s.ui.niveauSuperieur)
  const nom = useGame((s) => s.save.creature.nom)
  const fermer = useGame((s) => s.fermerNiveauSuperieur)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (niveau === null) return
    const id = window.setTimeout(fermer, 3800)
    return () => window.clearTimeout(id)
  }, [niveau, fermer])
  return (
    <AnimatePresence>
      {niveau !== null && (
        <motion.div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={fermer}
          role="dialog"
          aria-label={t.niveau.titre}
        >
          <div className="absolute inset-0 bg-night-950/35" />
          {!reduced &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute left-1/2 top-[55%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-crystal-300/70"
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 2.2, ease: EASE, delay: i * 0.35 }}
              />
            ))}
          <motion.div
            className="relative flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          >
            <span className="font-sans text-[0.62rem] uppercase tracking-[0.36em] text-crystal-300/80">{t.niveau.titre}</span>
            <span className="font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-none text-white text-glow-soft">{niveau}</span>
            <span className="font-sans text-sm font-light text-white/70">
              {nom} {t.niveau.texte}
            </span>
            <span className="mt-2 font-sans text-[0.62rem] uppercase tracking-[0.3em] text-gold-200/80">
              +{gameConfig.progression.piecesParNiveau} {t.niveau.recompense}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
