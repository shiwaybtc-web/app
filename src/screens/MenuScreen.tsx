import { Sheet } from '@/components/ui/Sheet'
import { t } from '@/config/texts'
import { useGame, type Panel } from '@/game/store'
import { codexEntries } from '@/config/codex'

const ENTRIES: Array<{ id: Panel; label: string }> = [
  { id: 'codex', label: t.menu.codex },
  { id: 'boutique', label: t.menu.boutique },
  { id: 'amis', label: t.menu.amis },
  { id: 'journal', label: t.menu.journal },
  { id: 'reglages', label: t.menu.reglages },
]

export function MenuScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ouvrir = useGame((s) => s.ouvrirPanneau)
  const decouverts = useGame((s) => s.save.codex.length)
  const pieces = useGame((s) => s.save.joueur.pieces)
  return (
    <Sheet open={open} onClose={onClose} titre={t.marque}>
      <ul className="flex flex-col">
        {ENTRIES.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              data-cursor="glow"
              onClick={() => ouvrir(e.id)}
              className="nav-link flex w-full items-center justify-between border-b border-white/5 py-4 text-left font-display text-[0.8rem] uppercase tracking-[0.26em] text-white/80 hover:text-white"
            >
              <span>{e.label}</span>
              <span className="font-sans text-[0.58rem] tracking-[0.2em] text-white/35">
                {e.id === 'codex' && `${decouverts} / ${codexEntries.length}`}
                {e.id === 'boutique' && `${pieces} ${t.barre.pieces.toLowerCase()}`}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
