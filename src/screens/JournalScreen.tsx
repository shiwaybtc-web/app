import { Sheet } from '@/components/ui/Sheet'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'

function formater(at: number) {
  const d = new Date(at)
  return d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function JournalScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const journal = useGame((s) => s.save.journal)
  return (
    <Sheet open={open} onClose={onClose} titre={t.journal.titre}>
      {journal.length === 0 ? (
        <p className="font-sans text-sm font-light text-white/50">{t.journal.vide}</p>
      ) : (
        <ul className="flex flex-col">
          {journal.map((e, i) => (
            <li key={`${e.at}-${i}`} className="flex items-baseline gap-3 border-b border-white/5 py-2.5 last:border-0">
              <span className="w-24 shrink-0 font-sans text-[0.58rem] uppercase tracking-[0.14em] text-white/35">{formater(e.at)}</span>
              <span className="flex-1 font-sans text-[0.78rem] font-light text-white/75">{e.label}</span>
              {e.xp ? <span className="font-sans text-[0.62rem] tracking-[0.12em] text-crystal-300">+{e.xp} XP</span> : null}
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}
