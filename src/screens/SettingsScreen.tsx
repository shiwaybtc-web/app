import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import { useRealWeather } from '@/world/useWeather'
import { cn } from '@/lib/cn'

function Toggle({ actif, onChange, label }: { actif: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={actif} aria-label={label} data-cursor="glow" onClick={onChange} className={cn('relative h-6 w-11 rounded-full border transition-colors duration-500', actif ? 'border-crystal-300/60 bg-crystal-500/40' : 'border-white/15 bg-white/5')}>
      <span className={cn('absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all duration-500 ease-premium', actif ? 'left-6' : 'left-1')} />
    </button>
  )
}

export function SettingsScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reglages = useGame((s) => s.save.reglages)
  const definir = useGame((s) => s.definirReglages)
  const reinitialiser = useGame((s) => s.reinitialiser)
  const weather = useRealWeather()
  const [confirm, setConfirm] = useState(false)

  return (
    <Sheet open={open} onClose={onClose} titre={t.reglages.titre} sousTitre={t.reglages.version}>
      <ul className="flex flex-col gap-2.5">
        <li className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div>
            <span className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-white/85">{t.reglages.son}</span>
            <p className="mt-1 font-sans text-[0.68rem] font-light text-white/50">{t.reglages.sonDetail}</p>
          </div>
          <Toggle actif={reglages.son} onChange={() => definir({ son: !reglages.son })} label={t.reglages.son} />
        </li>
        <li className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div>
            <span className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-white/85">{t.reglages.meteo}</span>
            <p className="mt-1 font-sans text-[0.68rem] font-light text-white/50">{t.explorer.meteoExplication}</p>
          </div>
          <Toggle actif={weather.actif} onChange={() => (weather.actif ? weather.desactiver() : void weather.actualiser())} label={t.reglages.meteo} />
        </li>
        <li className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <span className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-white/85">{t.reglages.reinitialiser}</span>
          {confirm ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-sans text-[0.7rem] text-white/60">{t.reglages.reinitialiserConfirm}</span>
              <Button size="sm" variant="subtle" onClick={() => setConfirm(false)}>
                {t.commun.annuler}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setConfirm(false)
                  void reinitialiser()
                }}
              >
                {t.commun.confirmer}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="subtle" className="self-start" onClick={() => setConfirm(true)}>
              {t.reglages.reinitialiser}
            </Button>
          )}
        </li>
      </ul>
    </Sheet>
  )
}
