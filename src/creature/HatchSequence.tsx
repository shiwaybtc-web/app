import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '@/config/texts'
import { Button } from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type HatchPhase = 'vibration' | 'lumiere' | 'flash' | 'naissance' | 'nom'

type Props = {
  phase: HatchPhase
  onPhase: (p: HatchPhase) => void
  onNommer: (nom: string) => void
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Orchestrates the hatching: shaking egg → inner light → flash → creature →
 * naming. The egg / creature themselves are rendered on the socle by the
 * home screen; this component drives timing and full-screen light.
 */
export function HatchSequence({ phase, onPhase, onNommer }: Props) {
  const reduced = useReducedMotion()
  const [nom, setNom] = useState('')

  useEffect(() => {
    const fast = reduced ? 0.3 : 1
    const timers: number[] = []
    if (phase === 'vibration') timers.push(window.setTimeout(() => onPhase('lumiere'), 1500 * fast))
    if (phase === 'lumiere') timers.push(window.setTimeout(() => onPhase('flash'), 1400 * fast))
    if (phase === 'flash') timers.push(window.setTimeout(() => onPhase('naissance'), 900 * fast))
    if (phase === 'naissance') timers.push(window.setTimeout(() => onPhase('nom'), 2600 * fast))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [phase, onPhase, reduced])

  return (
    <>
      {/* Full-screen light bloom */}
      <AnimatePresence>
        {(phase === 'flash' || phase === 'naissance') && (
          <motion.div
            key="flash"
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,1), rgba(230,220,255,0.9) 30%, rgba(160,140,255,0.4) 60%, rgba(0,0,0,0) 80%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'flash' ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === 'flash' ? 0.5 : 1.8, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* Naming card */}
      <AnimatePresence>
        {phase === 'nom' && (
          <motion.div
            key="nom"
            className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <form
              className="panel flex w-full max-w-md flex-col items-center gap-4 rounded-[26px] px-6 py-6 text-center"
              onSubmit={(e) => {
                e.preventDefault()
                onNommer(nom.trim() || t.oeuf.nomParDefaut)
              }}
            >
              <span className="font-display text-[1.05rem] uppercase tracking-[0.24em] text-white text-glow-soft">{t.oeuf.naissance}</span>
              <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-white/50">{t.oeuf.nommer}</span>
              <input
                autoFocus
                value={nom}
                onChange={(e) => setNom(e.target.value.slice(0, 16))}
                placeholder={t.oeuf.nomParDefaut}
                className="w-full max-w-[240px] border-b border-white/25 bg-transparent pb-2 text-center font-display text-lg tracking-[0.2em] text-white outline-none placeholder:text-white/25 focus:border-crystal-300/70"
                aria-label={t.oeuf.nommer}
              />
              <div className="flex items-center gap-3">
                <Button type="submit">{t.oeuf.confirmerNom}</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
