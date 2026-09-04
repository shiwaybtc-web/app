import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gameConfig } from '@/config/game'
import { t } from '@/config/texts'
import { foodById } from '@/config/foods'
import { useGame } from '@/game/store'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { FoodIcon } from '@/components/ui/FoodIcon'
import type { FoodId } from '@/types/game'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Lure = { id: number; x: number; y: number; born: number; caught?: boolean }
type Phase = 'pret' | 'jeu' | 'fin' | 'pub'

const EASE = [0.22, 1, 0.36, 1] as const

/** "Lueurs": tap the lights around the creature for 20 seconds. */
export function PlayScreen({ onClose }: { onClose: () => void }) {
  const cfg = gameConfig.jouer
  const terminerJeu = useGame((s) => s.terminerJeu)
  const doubler = useGame((s) => s.doublerRecompense)
  const recharges = useGame((s) => s.save.recharges)
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('pret')
  const [lures, setLures] = useState<Lure[]>([])
  const [score, setScore] = useState(0)
  const [reste, setReste] = useState<number>(cfg.dureeSecondes)
  const [resultat, setResultat] = useState<{ xp: number; reduit: boolean; aliment: FoodId | null } | null>(null)
  const [double, setDouble] = useState(false)
  const [pubReste, setPubReste] = useState<number>(gameConfig.publicite.dureeSimulationSecondes)
  const nextId = useRef(0)
  const pleineForme = Date.now() - recharges.dernierJeu >= cfg.rechargeMinutes * 60000
  const prochaineMin = Math.max(1, Math.ceil((cfg.rechargeMinutes * 60000 - (Date.now() - recharges.dernierJeu)) / 60000))

  // Spawn + expire lures, count down.
  useEffect(() => {
    if (phase !== 'jeu') return
    const spawn = window.setInterval(() => {
      setLures((l) => [
        ...l.filter((x) => !x.caught && Date.now() - x.born < cfg.dureeLueurMs),
        { id: ++nextId.current, x: 12 + Math.random() * 76, y: 20 + Math.random() * 55, born: Date.now() },
      ])
    }, cfg.intervalleApparitionMs)
    const timer = window.setInterval(() => setReste((r) => r - 1), 1000)
    return () => {
      window.clearInterval(spawn)
      window.clearInterval(timer)
    }
  }, [phase, cfg.dureeLueurMs, cfg.intervalleApparitionMs])

  useEffect(() => {
    if (phase === 'jeu' && reste <= 0) {
      setPhase('fin')
      setLures([])
      setResultat(terminerJeu(score))
    }
  }, [reste, phase, score, terminerJeu])

  const catchLure = useCallback((id: number) => {
    setLures((l) => l.map((x) => (x.id === id && !x.caught ? { ...x, caught: true } : x)))
    setScore((s) => s + 1)
  }, [])

  // Simulated rewarded ad countdown.
  useEffect(() => {
    if (phase !== 'pub') return
    setPubReste(gameConfig.publicite.dureeSimulationSecondes)
    const id = window.setInterval(() => setPubReste((r: number) => Math.max(0, r - 1)), 1000)
    return () => window.clearInterval(id)
  }, [phase, gameConfig.publicite.dureeSimulationSecondes])

  const start = () => {
    setScore(0)
    setReste(cfg.dureeSecondes)
    setPhase('jeu')
  }

  return (
    <div className="absolute inset-0 z-20" role="dialog" aria-label={t.jouer.titre}>
      {/* Play field over the world, leaving the creature visible */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(4,6,15,0) 30%, rgba(4,6,15,0.45) 100%)' }} />

      {phase === 'jeu' && (
        <div className="absolute inset-0">
          {lures.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-label="Lueur"
              onPointerDown={() => catchLure(l.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
              style={{ left: `${l.x}%`, top: `${l.y}%`, width: 56, height: 56 }}
            >
              <span
                className="block h-full w-full rounded-full"
                style={{
                  background: l.caught
                    ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(201,184,255,0) 60%)'
                    : 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(201,184,255,0.7) 18%, rgba(201,184,255,0) 55%)',
                  animation: l.caught ? 'lure-pop 0.35s ease-out forwards' : reduced ? 'none' : `lure-life ${cfg.dureeLueurMs}ms ease-in-out forwards`,
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* HUD */}
      <div className="absolute inset-x-0 top-[max(5.5rem,calc(env(safe-area-inset-top)+5rem))] flex flex-col items-center gap-2 text-center">
        <span className="font-display text-[0.9rem] uppercase tracking-[0.3em] text-white text-glow-soft">{t.jouer.titre}</span>
        {phase === 'jeu' && (
          <>
            <span className="font-display text-3xl text-white text-glow-soft">{score}</span>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-crystal-300 transition-[width] duration-1000 ease-linear" style={{ width: `${(reste / cfg.dureeSecondes) * 100}%` }} />
            </div>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'pret' && (
          <motion.div key="pret" className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <div className="panel flex w-full max-w-md flex-col items-center gap-4 rounded-[26px] px-6 py-6 text-center">
              <p className="font-sans text-sm font-light leading-relaxed text-white/70">{t.jouer.consigne}</p>
              <span className="font-sans text-[0.6rem] uppercase tracking-[0.26em] text-white/45">
                {pleineForme ? t.jouer.pleineForme : `${t.jouer.recompenseReduite} ${t.jouer.prochaine} ${prochaineMin} min.`}
              </span>
              <div className="flex gap-3">
                <Button variant="subtle" onClick={onClose}>
                  {t.commun.retour}
                </Button>
                <Button onClick={start}>{t.jouer.commencer}</Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'fin' && resultat && (
          <motion.div key="fin" className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <div className="panel flex w-full max-w-md flex-col items-center gap-4 rounded-[26px] px-6 py-6 text-center">
              <span className="font-display text-[0.9rem] uppercase tracking-[0.3em] text-white">{t.jouer.fin}</span>
              <span className="font-sans text-sm text-white/70">
                {score} {t.jouer.lueurs} · <span className="text-crystal-300">+{resultat.xp} XP</span>
                {double && <span className="text-gold-200"> ×2</span>}
              </span>
              {resultat.reduit && <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-white/40">{t.jouer.recompenseReduite}</span>}
              {resultat.aliment && (
                <span className="flex items-center gap-2 font-sans text-[0.68rem] tracking-[0.16em] text-white/75">
                  {t.jouer.trouve} <FoodIcon food={foodById[resultat.aliment]} size={22} /> {foodById[resultat.aliment].nom}
                </span>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!double && !resultat.reduit && (
                  <Button variant="subtle" onClick={() => setPhase('pub')}>
                    {t.jouer.doubler}
                    <Chip tone="gold">{t.commun.simulation}</Chip>
                  </Button>
                )}
                <Button onClick={onClose}>{t.commun.continuer}</Button>
              </div>
              {!double && !resultat.reduit && <span className="font-sans text-[0.55rem] tracking-[0.2em] text-white/35">{t.jouer.doublerDetail}</span>}
            </div>
          </motion.div>
        )}

        {phase === 'pub' && resultat && (
          <motion.div key="pub" className="absolute inset-0 flex items-center justify-center bg-night-950/85 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="panel flex w-full max-w-sm flex-col items-center gap-5 rounded-[26px] px-6 py-8 text-center">
              <Chip tone="gold">{t.jouer.pubTitre}</Chip>
              <p className="font-sans text-sm font-light leading-relaxed text-white/65">{t.jouer.pubTexte}</p>
              <span className="font-display text-3xl text-white">{pubReste}</span>
              <Button
                disabled={pubReste > 0}
                onClick={() => {
                  doubler(resultat.xp)
                  setDouble(true)
                  setPhase('fin')
                }}
              >
                {t.jouer.pubFermer}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
