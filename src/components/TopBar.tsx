import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { IconEclat, IconMenu, IconMeteo } from './ui/Icons'
import { ProgressBar } from './ui/ProgressBar'
import { useGame } from '@/game/store'
import { progressionNiveau } from '@/game/progression'
import { t } from '@/config/texts'
import { useWeatherKind } from '@/world/useWeather'
import { useWorldClock } from '@/world/useWorldClock'

const EASE = [0.22, 1, 0.36, 1] as const

export function TopBar() {
  const joueur = useGame((s) => s.save.joueur)
  const nom = useGame((s) => s.save.creature.nom)
  const stage = useGame((s) => s.save.creature.stage)
  const ouvrir = useGame((s) => s.ouvrirPanneau)
  const meteo = useWeatherKind()
  const { periode } = useWorldClock()
  const { ratio } = progressionNiveau(joueur)

  return (
    <motion.header
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
    >
      <div className="pointer-events-auto flex flex-col gap-2.5">
        <Logo variant="small" />
        <div className="flex items-center gap-2 whitespace-nowrap font-sans text-[0.52rem] uppercase tracking-[0.22em] text-white/60 text-shadow-legible sm:text-[0.6rem] sm:tracking-[0.26em]">
          <span>{t.periodes[periode]}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="flex items-center gap-1.5">
            <IconMeteo kind={meteo} size={13} />
            {t.meteo[meteo]}
          </span>
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-night-950/40 px-3 py-1.5 font-sans text-[0.66rem] tracking-[0.16em] text-gold-200/90">
            <IconEclat size={13} />
            {joueur.pieces}
          </span>
          <button type="button" aria-label={t.barre.menu} data-cursor="glow" className="icon-button" onClick={() => ouvrir('menu')}>
            <IconMenu size={20} />
          </button>
        </div>
        {stage === 'bebe' && (
          <button type="button" data-cursor="glow" className="flex w-40 flex-col items-end gap-1.5 text-right sm:w-52" onClick={() => ouvrir('evolution')} aria-label={`${nom}, ${t.barre.niveau} ${joueur.niveau}`}>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[0.8rem] tracking-[0.2em] text-white">{nom}</span>
              <span className="font-sans text-[0.6rem] uppercase tracking-[0.26em] text-white/55">
                {t.barre.niveau} {joueur.niveau}
              </span>
            </span>
            <ProgressBar ratio={ratio} className="w-full" />
          </button>
        )}
      </div>
    </motion.header>
  )
}
