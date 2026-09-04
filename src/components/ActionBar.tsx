import { motion } from 'framer-motion'
import { IconEvolution, IconExplorer, IconJouer, IconNourrir } from './ui/Icons'
import { useGame, type Panel } from '@/game/store'
import { t } from '@/config/texts'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

const ACTIONS: Array<{ id: Panel; label: string; Icon: typeof IconNourrir }> = [
  { id: 'nourrir', label: t.actions.nourrir, Icon: IconNourrir },
  { id: 'jouer', label: t.actions.jouer, Icon: IconJouer },
  { id: 'explorer', label: t.actions.explorer, Icon: IconExplorer },
  { id: 'evolution', label: t.actions.evolution, Icon: IconEvolution },
]

/** The four main actions, thumb-reachable, restrained. */
export function ActionBar({ hidden }: { hidden?: boolean }) {
  const panneau = useGame((s) => s.ui.panneau)
  const ouvrir = useGame((s) => s.ouvrirPanneau)
  return (
    <motion.nav
      className={cn('absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]', hidden && 'pointer-events-none')}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? 8 : 0 }}
      transition={{ duration: hidden ? 0.4 : 1.2, ease: EASE, delay: hidden ? 0 : 0.6 }}
      aria-label="Actions"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-night-950/45 px-2 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3">
        {ACTIONS.map(({ id, label, Icon }) => {
          const actif = panneau === id
          return (
            <button
              key={id}
              type="button"
              data-cursor="glow"
              onClick={() => ouvrir(actif ? null : id)}
              aria-pressed={actif}
              className={cn(
                'group flex min-w-[68px] flex-col items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-500 ease-premium sm:min-w-[84px] sm:px-5',
                actif ? 'text-white' : 'text-white/60 hover:text-white',
              )}
            >
              <span className={cn('transition-all duration-500 ease-premium group-hover:-translate-y-0.5', actif && 'drop-shadow-[0_0_10px_rgba(201,184,255,0.8)]')}>
                <Icon size={22} />
              </span>
              <span className="font-sans text-[0.55rem] uppercase tracking-[0.24em]">{label}</span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
