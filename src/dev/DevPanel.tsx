import { useState } from 'react'
import { useGame } from '@/game/store'
import { t } from '@/config/texts'
import { affinityMeta } from '@/config/evolution'
import { AFFINITIES } from '@/types/creature'
import { DAY_PERIODS, type WeatherKind } from '@/types/world'
import { cn } from '@/lib/cn'

const METEOS: WeatherKind[] = ['soleil', 'nuageux', 'pluie', 'orage', 'neige', 'chaleur', 'froid']

/** Development-only controls. Never rendered in production builds. */
export function DevPanel() {
  const [open, setOpen] = useState(false)
  const dev = useGame((s) => s.ui.dev)
  const niveau = useGame((s) => s.save.joueur.niveau)
  const affinites = useGame((s) => s.save.creature.affinites)
  const devDefinir = useGame((s) => s.devDefinir)
  const devNiveau = useGame((s) => s.devNiveau)
  const devAffinite = useGame((s) => s.devAffinite)
  const gagnerXp = useGame((s) => s.gagnerXp)
  const devRecharges = useGame((s) => s.devRecharges)
  const devRejouer = useGame((s) => s.devRejouerEclosion)
  const reinitialiser = useGame((s) => s.reinitialiser)
  if (!import.meta.env.DEV) return null

  const pill = (actif: boolean) => cn('rounded-full border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.16em] transition-colors', actif ? 'border-gold-300/60 text-gold-200' : 'border-white/15 text-white/55 hover:text-white')

  return (
    <div className="fixed left-2 top-[44%] z-50 font-sans">
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full border border-gold-300/40 bg-night-950/80 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.3em] text-gold-200/80" aria-expanded={open} aria-label={t.dev.titre}>
        DEV
      </button>
      {open && (
        <div className="mt-2 flex w-72 flex-col gap-3 rounded-2xl border border-white/10 bg-night-950/92 p-3 text-white backdrop-blur-md">
          <div>
            <span className="text-[0.55rem] uppercase tracking-[0.26em] text-white/40">{t.dev.periode}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              <button type="button" className={pill(dev.periode === null)} onClick={() => devDefinir({ periode: null })}>{t.dev.auto}</button>
              {DAY_PERIODS.map((p) => (
                <button key={p} type="button" className={pill(dev.periode === p)} onClick={() => devDefinir({ periode: p })}>{t.periodes[p]}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[0.55rem] uppercase tracking-[0.26em] text-white/40">{t.dev.meteo}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              <button type="button" className={pill(dev.meteo === null)} onClick={() => devDefinir({ meteo: null })}>{t.dev.auto}</button>
              {METEOS.map((m) => (
                <button key={m} type="button" className={pill(dev.meteo === m)} onClick={() => devDefinir({ meteo: m })}>{t.meteo[m]}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.55rem] uppercase tracking-[0.26em] text-white/40">{t.dev.niveau} {niveau}</span>
            <button type="button" className={pill(false)} onClick={() => devNiveau(-1)}>−</button>
            <button type="button" className={pill(false)} onClick={() => devNiveau(1)}>+</button>
            <button type="button" className={pill(false)} onClick={() => gagnerXp(100, 'XP de développement.')}>{t.dev.xp}</button>
          </div>
          <div>
            <span className="text-[0.55rem] uppercase tracking-[0.26em] text-white/40">{t.dev.affinites}</span>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {AFFINITIES.map((a) => (
                <button key={a} type="button" className="rounded-lg border border-white/10 px-1 py-1 text-center text-[0.55rem]" style={{ color: affinityMeta[a].couleur }} onClick={() => devAffinite(a, 5)} title={`+5 ${affinityMeta[a].nom}`}>
                  {affinityMeta[a].nom.slice(0, 3)} {affinites[a]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            <button type="button" className={pill(false)} onClick={devRecharges}>{t.dev.recharges}</button>
            <button type="button" className={pill(false)} onClick={devRejouer}>{t.dev.eclosion}</button>
            <button type="button" className={pill(false)} onClick={() => void reinitialiser()}>{t.dev.reset}</button>
          </div>
        </div>
      )}
    </div>
  )
}
