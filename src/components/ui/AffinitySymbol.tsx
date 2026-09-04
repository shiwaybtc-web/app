import { affinityMeta } from '@/config/evolution'
import type { Affinity } from '@/types/creature'

/** Thin line symbols for the five affinities. */
export function AffinitySymbol({ id, size = 18, color }: { id: Affinity; size?: number; color?: string }) {
  const c = color ?? affinityMeta[id].couleur
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (affinityMeta[id].symbole) {
    case 'soleil':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
        </svg>
      )
    case 'goutte':
      return (
        <svg {...common}>
          <path d="M12 3c3 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-6.5 6-11Z" />
          <path d="M9 14c0 1.5 1 2.6 2.4 3" opacity=".6" />
        </svg>
      )
    case 'lune':
      return (
        <svg {...common}>
          <path d="M15 3.5A8.5 8.5 0 1 0 20.5 12 6.5 6.5 0 0 1 15 3.5Z" />
        </svg>
      )
    case 'feuille':
      return (
        <svg {...common}>
          <path d="M5 19C5 9 11 5 19 5c0 8-4 14-14 14Z" />
          <path d="M5 19c3-4 6-7 10-10" opacity=".7" />
        </svg>
      )
    case 'eclair':
      return (
        <svg {...common}>
          <path d="M13 3 6 13h5l-1 8 8-11h-5l1-7Z" />
        </svg>
      )
  }
}
