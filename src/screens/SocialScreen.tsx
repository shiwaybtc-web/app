import { Sheet } from '@/components/ui/Sheet'
import { Chip } from '@/components/ui/Chip'
import { t } from '@/config/texts'

const ITEMS = [
  { titre: t.amis.ajouter, texte: 'Un code d’ami, une demande, une amitié.' },
  { titre: t.amis.visiter, texte: 'Voir le sanctuaire et le Nexa d’un ami, tel qu’il vit à cet instant.' },
  { titre: t.amis.comparer, texte: 'Deux histoires côte à côte : affinités, niveaux, découvertes.' },
  { titre: t.amis.missions, texte: 'Des objectifs partagés qui progressent à plusieurs.' },
  { titre: t.amis.jumelage, texte: t.amis.jumelageTexte },
  { titre: t.amis.activites, texte: t.amis.activitesTexte },
]

/**
 * Social hub. Everything here is architecture for later (see types/social.ts):
 * nothing pretends to work, each entry is labelled as future.
 */
export function SocialScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} titre={t.amis.titre} sousTitre={t.amis.intro}>
      <ul className="flex flex-col gap-2.5">
        {ITEMS.map((i) => (
          <li key={i.titre} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div>
              <span className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-white/85">{i.titre}</span>
              <p className="mt-1 font-sans text-[0.7rem] font-light leading-relaxed text-white/50">{i.texte}</p>
            </div>
            <Chip className="shrink-0">{t.commun.futur}</Chip>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
