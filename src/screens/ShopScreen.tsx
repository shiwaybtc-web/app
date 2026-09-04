import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { IconEclat, IconVerrou } from '@/components/ui/Icons'
import { shopItems, auraPresets } from '@/config/shop'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import type { ShopCategory } from '@/types/shop'
import { cn } from '@/lib/cn'

const CATS: ShopCategory[] = ['auras', 'socle', 'colliers', 'ornements', 'environnements']

function Preview({ categorie, preset }: { categorie: ShopCategory; preset: string }) {
  if (categorie === 'auras') {
    const p = auraPresets[preset]
    return <span className="block h-10 w-10 rounded-full" style={{ background: `radial-gradient(circle, rgba(${p?.couleur ?? '255,255,255'},0.9), rgba(${p?.couleur ?? '255,255,255'},0) 70%)` }} />
  }
  if (categorie === 'socle') {
    return (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <ellipse cx="20" cy="22" rx="16" ry="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeDasharray={preset === 'runique' ? '2 3' : undefined} />
        {preset === 'lueurs' && [10, 20, 30].map((x, i) => <circle key={i} cx={x} cy={14 - i * 2} r="1.3" fill="rgba(201,184,255,0.9)" />)}
      </svg>
    )
  }
  return (
    <span className="text-white/35">
      <IconVerrou size={18} />
    </span>
  )
}

export function ShopScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pieces = useGame((s) => s.save.joueur.pieces)
  const possessions = useGame((s) => s.save.possessions)
  const cosmetiques = useGame((s) => s.save.cosmetiques)
  const acheter = useGame((s) => s.acheter)
  const equiper = useGame((s) => s.equiper)

  return (
    <Sheet
      open={open}
      onClose={onClose}
      titre={t.boutique.titre}
      sousTitre={t.boutique.sousTitre}
      large
      extra={
        <span className="flex items-center gap-1.5 font-sans text-[0.7rem] tracking-[0.16em] text-gold-200/90">
          <IconEclat size={13} /> {pieces}
        </span>
      }
    >
      {CATS.map((c) => {
        const items = shopItems.filter((i) => i.categorie === c)
        return (
          <section key={c} className="mb-6">
            <h3 className="mb-2.5 font-sans text-[0.58rem] uppercase tracking-[0.34em] text-white/45">{t.boutique.categories[c]}</h3>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {items.map((item) => {
                const possede = possessions.includes(item.id)
                const equipe = (c === 'auras' && cosmetiques.aura === item.preset) || (c === 'socle' && cosmetiques.socle === item.preset)
                return (
                  <li key={item.id} className={cn('flex items-center gap-3 rounded-2xl border p-3', equipe ? 'border-white/25 bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]')}>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-night-950/60">
                      <Preview categorie={c} preset={item.preset} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-display text-[0.68rem] uppercase tracking-[0.2em] text-white">{item.nom}</span>
                        {item.bientot && <Chip tone="gold">{t.commun.bientot}</Chip>}
                      </div>
                      <p className="mt-1 font-sans text-[0.66rem] font-light leading-snug text-white/50">{item.description}</p>
                      {item.bientot && <p className="mt-1 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-white/35">{t.boutique.premium}</p>}
                    </div>
                    <div className="shrink-0">
                      {item.bientot ? null : equipe ? (
                        <span className="font-sans text-[0.58rem] uppercase tracking-[0.24em] text-crystal-300">{t.boutique.equipe}</span>
                      ) : possede ? (
                        <Button size="sm" variant="subtle" onClick={() => equiper(item.id)}>
                          {t.boutique.equiper}
                        </Button>
                      ) : (
                        <Button size="sm" disabled={pieces < (item.prix ?? 0)} onClick={() => acheter(item.id)} title={pieces < (item.prix ?? 0) ? t.boutique.insuffisant : undefined}>
                          <IconEclat size={12} /> {item.prix}
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </Sheet>
  )
}
