import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { foods } from '@/config/foods'
import { gameConfig } from '@/config/game'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import { FoodIcon } from '@/components/ui/FoodIcon'
import { IconFermer } from '@/components/ui/Icons'
import { affinityMeta } from '@/config/evolution'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

function formaterDelai(ms: number) {
  const m = Math.max(1, Math.ceil(ms / 60000))
  return `${m} min`
}

/** Compact tray above the action bar: the creature stays visible while eating. */
export function FeedTray({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inventaire = useGame((s) => s.save.inventaire.aliments)
  const recharges = useGame((s) => s.save.recharges)
  const nourrir = useGame((s) => s.nourrir)
  const [vol, setVol] = useState<{ id: string; key: number } | null>(null)
  const [, force] = useState(0)

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => force((v) => v + 1), 5000)
    return () => window.clearInterval(id)
  }, [open])

  const appetitPlein = recharges.appetit >= gameConfig.nourrir.appetitMax
  const prochainMs = appetitPlein ? 0 : gameConfig.nourrir.regenerationMinutes * 60000 - (Date.now() - recharges.appetitDepuis)

  const donner = (id: (typeof foods)[number]['id']) => {
    const res = nourrir(id)
    if (res.ok) setVol({ id, key: Date.now() })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex w-full max-w-md items-center justify-between gap-3 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
            <span className="flex items-center gap-3">
            <span>{t.nourrir.appetit}</span>
            <span className="flex items-center gap-1.5">
              {Array.from({ length: gameConfig.nourrir.appetitMax }).map((_, i) => (
                <span key={i} className={cn('h-1.5 w-1.5 rounded-full transition-colors duration-500', i < recharges.appetit ? 'bg-crystal-300 shadow-[0_0_6px_rgba(201,184,255,0.8)]' : 'bg-white/15')} />
              ))}
            </span>
            {recharges.appetit === 0 && (
              <span className="text-white/40">
                · {t.nourrir.rassasie} {formaterDelai(prochainMs)}
              </span>
            )}
            </span>
            <button type="button" onClick={onClose} aria-label={t.commun.fermer} data-cursor="glow" className="icon-button !h-8 !w-8">
              <IconFermer size={14} />
            </button>
          </div>
          <div className="relative flex max-w-full items-center gap-0.5 rounded-full border border-white/10 bg-night-950/55 px-1.5 py-2 backdrop-blur-md sm:gap-2 sm:px-2">
            {foods.map((f) => {
              const qte = inventaire[f.id] ?? 0
              const dispo = qte > 0 && recharges.appetit > 0
              return (
                <button
                  key={f.id}
                  type="button"
                  data-cursor="glow"
                  disabled={!dispo}
                  onClick={() => donner(f.id)}
                  title={`${f.nom} — ${f.description}`}
                  aria-label={`${f.nom}, ${qte} disponibles, +${f.xp} XP`}
                  className={cn(
                    'group relative flex flex-col items-center gap-1 rounded-full px-1.5 py-1.5 transition-all duration-500 ease-premium sm:px-4',
                    dispo ? 'hover:-translate-y-0.5' : 'opacity-35',
                  )}
                >
                  <span className="relative">
                    <FoodIcon food={f} size={28} />
                    <span className="absolute -right-2 -top-1 rounded-full bg-night-900/90 px-1.5 font-sans text-[0.55rem] tracking-wider text-white/80">{qte}</span>
                  </span>
                  <span className="max-w-[54px] truncate font-sans text-[0.46rem] uppercase tracking-[0.14em] text-white/60 sm:max-w-none sm:text-[0.5rem] sm:tracking-[0.18em]" style={{ color: dispo ? affinityMeta[f.affinite].couleur : undefined }}>
                    {f.nom}
                  </span>
                </button>
              )
            })}
            {/* Food flying towards the creature */}
            <AnimatePresence>
              {vol && (
                <motion.span
                  key={vol.key}
                  className="pointer-events-none absolute left-1/2 top-0"
                  initial={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                  animate={{ opacity: [1, 1, 0], y: -220, scale: 0.6 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  onAnimationComplete={() => setVol(null)}
                >
                  <FoodIcon food={foods.find((f) => f.id === vol.id)!} size={30} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="font-sans text-[0.58rem] tracking-[0.2em] text-white/35">{t.nourrir.sousTitre}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
