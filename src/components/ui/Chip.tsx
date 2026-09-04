import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Tiny uppercase label: "Bientôt", "Démonstration", "Simulation"… */
export function Chip({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'violet' | 'blue'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-sans text-[0.55rem] uppercase tracking-[0.26em]',
        tone === 'neutral' && 'border-white/15 text-white/55',
        tone === 'gold' && 'border-gold-300/40 text-gold-200/90',
        tone === 'violet' && 'border-crystal-400/40 text-crystal-300',
        tone === 'blue' && 'border-aurora-400/40 text-aurora-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
