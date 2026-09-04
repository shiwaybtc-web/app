import { Sheet } from '@/components/ui/Sheet'
import { AffinitySymbol } from '@/components/ui/AffinitySymbol'
import { assets } from '@/config/assets'
import { affinityMeta, revealSteps, type RevealStep } from '@/config/evolution'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import { affiniteDominante, partsAffinites } from '@/game/affinities'
import { AFFINITIES, type Affinity } from '@/types/creature'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

function etapeActuelle(niveau: number): { etape: RevealStep; texte: string; prochain: number | null } {
  let current = revealSteps[0]
  let prochain: number | null = null
  for (const s of revealSteps) {
    if (niveau >= s.niveau) current = s
    else {
      prochain = s.niveau
      break
    }
  }
  return { etape: current.etape, texte: current.texte, prochain }
}

const ORDER: Record<RevealStep, number> = { symboles: 0, nom: 1, silhouette: 2, voile: 3, revelation: 4 }

/** A branch tile: "?" → silhouette → veiled → revealed, according to the level. */
function BranchTile({ id, etape, dominante, part }: { id: Affinity; etape: RevealStep; dominante: boolean; part: number }) {
  const meta = affinityMeta[id]
  const rank = ORDER[etape]
  // Non-dominant branches lag one step behind.
  const effective = dominante ? rank : Math.max(0, rank - 1)
  const showImage = effective >= 2
  const filter = effective === 2 ? 'brightness(0) blur(2px)' : effective === 3 ? 'blur(10px) saturate(0.7) brightness(0.6)' : 'none'
  const reduced = useReducedMotion()
  return (
    <div className={cn('relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-colors duration-700', dominante ? 'border-white/25 bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]')}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-night-950/60">
        {showImage ? (
          <img
            src={assets.evolution.branches[id]}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter, opacity: effective === 2 ? 0.9 : 1, animation: effective === 2 && !reduced ? 'breathe 7s ease-in-out infinite' : 'none' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-white/20">?</span>
          </div>
        )}
        {effective === 2 && <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%, ${meta.couleurDouce}, rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen' }} />}
        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(0deg, rgba(4,6,15,0.85), rgba(4,6,15,0))' }} />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <AffinitySymbol id={id} size={18} />
        </span>
      </div>
      <span className="font-display text-[0.62rem] uppercase tracking-[0.24em] text-white/85">{effective >= 1 ? meta.nom : t.evolution.inconnue}</span>
      <span className="font-sans text-[0.6rem] tracking-[0.16em]" style={{ color: meta.couleur }}>
        {Math.round(part * 100)} %
      </span>
      {effective === 3 && <span className="absolute right-2 top-2 rounded-full bg-night-950/70 px-2 py-0.5 font-sans text-[0.5rem] uppercase tracking-[0.2em] text-white/60">{t.evolution.voile}</span>}
    </div>
  )
}

export function EvolutionScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const affinites = useGame((s) => s.save.creature.affinites)
  const niveau = useGame((s) => s.save.joueur.niveau)
  const nom = useGame((s) => s.save.creature.nom)
  const dom = affiniteDominante(affinites)
  const parts = partsAffinites(affinites)
  const { etape, texte, prochain } = etapeActuelle(niveau)
  const nomRevele = ORDER[etape] >= 1
  const equilibre = dom.ecart < 0.04

  return (
    <Sheet open={open} onClose={onClose} titre={t.evolution.titre} sousTitre={`${nom} · ${t.barre.niveau} ${niveau}`} large>
      {/* Dominant affinity */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center">
        <span className="font-sans text-[0.58rem] uppercase tracking-[0.34em] text-white/45">{t.evolution.dominante}</span>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/15 p-2" style={{ boxShadow: `0 0 24px ${affinityMeta[dom.id].couleurDouce}` }}>
            <AffinitySymbol id={dom.id} size={22} color={nomRevele ? undefined : 'rgba(255,255,255,0.5)'} />
          </span>
          <span className="font-display text-[1.4rem] uppercase tracking-[0.26em] text-white text-glow-soft">{nomRevele && !equilibre ? affinityMeta[dom.id].nom : t.evolution.inconnue}</span>
        </div>
        <span className="font-display text-3xl text-white/90">{Math.round(dom.part * 100)} %</span>
        <span className="font-sans text-[0.7rem] font-light text-white/50">{equilibre ? t.evolution.equilibre : nomRevele ? affinityMeta[dom.id].devise : texte}</span>
      </div>

      {/* Tendencies */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.34em] text-white/45">{t.evolution.tendances}</span>
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-white/35">{t.evolution.voies}</span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {AFFINITIES.map((id) => (
            <li key={id} className="flex items-center gap-3">
              <AffinitySymbol id={id} size={16} />
              <span className="w-24 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-white/70">{nomRevele ? affinityMeta[id].nom : t.evolution.inconnue}</span>
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full transition-[width] duration-1000 ease-premium" style={{ width: `${parts[id] * 100}%`, background: affinityMeta[id].couleur, boxShadow: `0 0 8px ${affinityMeta[id].couleurDouce}` }} />
              </div>
              <span className="w-10 text-right font-sans text-[0.62rem] tracking-[0.1em] text-white/60">{Math.round(parts[id] * 100)} %</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hints and branches */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.34em] text-white/45">{t.evolution.indice}</span>
          {prochain && (
            <span className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-white/35">
              {t.evolution.prochainIndice} {prochain}
            </span>
          )}
        </div>
        <p className="mb-4 font-sans text-[0.8rem] font-light italic leading-relaxed text-white/60">{texte}</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {AFFINITIES.map((id) => (
            <BranchTile key={id} id={id} etape={etape} dominante={id === dom.id && !equilibre} part={parts[id]} />
          ))}
        </div>
      </div>
    </Sheet>
  )
}
