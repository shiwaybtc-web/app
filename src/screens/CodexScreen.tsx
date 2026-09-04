import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { codexEntries, type CodexCategory } from '@/config/codex'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import { cn } from '@/lib/cn'

const CATS: CodexCategory[] = ['creatures', 'formes', 'mutations', 'objets', 'accessoires', 'decouvertes']

function Silhouette({ kind }: { kind: string }) {
  const common = { viewBox: '0 0 40 40', className: 'h-10 w-10', fill: 'rgba(255,255,255,0.12)', 'aria-hidden': true }
  switch (kind) {
    case 'oeuf':
      return <svg {...common}><path d="M20 4c7 8 12 15 12 22a12 12 0 0 1-24 0c0-7 5-14 12-22Z" /></svg>
    case 'creature':
      return <svg {...common}><path d="M12 34c-3-6-2-13 4-17-1-4 0-8 2-10 1 3 3 4 6 4 3 0 5 1 7 4 3 3 4 8 2 12-2 5-6 7-11 7-4 0-8 0-10 0Z" /></svg>
    case 'lieu':
      return <svg {...common}><path d="M20 36c-6-8-10-13-10-19a10 10 0 0 1 20 0c0 6-4 11-10 19Z" /></svg>
    case 'aura':
      return <svg {...common}><circle cx="20" cy="20" r="12" /></svg>
    case 'fragment':
      return <svg {...common}><path d="M20 4l9 12-9 20-9-20 9-12Z" /></svg>
    default:
      return <svg {...common}><rect x="10" y="10" width="20" height="20" rx="5" /></svg>
  }
}

export function CodexScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const decouverts = useGame((s) => s.save.codex)
  const [cat, setCat] = useState<CodexCategory>('creatures')
  const total = codexEntries.length
  const nb = codexEntries.filter((e) => decouverts.includes(e.id)).length
  const entries = codexEntries.filter((e) => e.categorie === cat)

  return (
    <Sheet open={open} onClose={onClose} titre={t.codex.titre} sousTitre={`${nb} / ${total} ${t.codex.decouvertes}`} large>
      <div className="scroll-area -mx-2 mb-4 flex gap-1 overflow-x-auto px-2 pb-1">
        {CATS.map((c) => {
          const n = codexEntries.filter((e) => e.categorie === c).length
          const d = codexEntries.filter((e) => e.categorie === c && decouverts.includes(e.id)).length
          return (
            <button
              key={c}
              type="button"
              data-cursor="glow"
              onClick={() => setCat(c)}
              className={cn('shrink-0 rounded-full border px-3.5 py-1.5 font-sans text-[0.58rem] uppercase tracking-[0.24em] transition-all duration-500', cat === c ? 'border-white/40 text-white' : 'border-white/10 text-white/50 hover:text-white/80')}
            >
              {t.codex.categories[c]} <span className="ml-1 text-white/35">{d}/{n}</span>
            </button>
          )
        })}
      </div>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {entries.map((e) => {
          const ok = decouverts.includes(e.id)
          return (
            <li key={e.id} className={cn('flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors duration-500', ok ? 'border-white/20 bg-white/[0.05]' : 'border-white/8 bg-white/[0.02]')}>
              <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-xl bg-night-950/50">
                {ok && e.image ? <img src={e.image} alt="" className="h-full w-full object-contain p-1" /> : <Silhouette kind={e.silhouette} />}
              </div>
              <span className={cn('font-display text-[0.6rem] uppercase tracking-[0.2em]', ok ? 'text-white' : 'text-white/40')}>{ok ? e.nom : t.codex.inconnu}</span>
              <span className="font-sans text-[0.6rem] font-light leading-snug text-white/45">{e.indice}</span>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
