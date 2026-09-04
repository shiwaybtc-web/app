import type { FoodDef } from '@/config/foods'
import { affinityMeta } from '@/config/evolution'

export function FoodIcon({ food, size = 28 }: { food: FoodDef; size?: number }) {
  const c = affinityMeta[food.affinite].couleur
  const common = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none', stroke: c, strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (food.icone) {
    case 'baie':
      return (
        <svg {...common}>
          <circle cx="13" cy="19" r="5" fill={`${c}33`} />
          <circle cx="20" cy="16" r="4.5" fill={`${c}33`} />
          <path d="M16 12c1-4 3-6 6-7" />
          <path d="M22 5c-2 0-3 1-4 3" />
        </svg>
      )
    case 'nectar':
      return (
        <svg {...common}>
          <path d="M11 6h10l-1.5 5.5c-.5 1.8-.5 3.5 0 5.5L21 26H11l1.5-9c.5-2 .5-3.7 0-5.5L11 6Z" fill={`${c}22`} />
          <path d="M12.5 17h7" opacity=".7" />
          <circle cx="16" cy="3.5" r="1" fill={c} />
        </svg>
      )
    case 'feuille':
      return (
        <svg {...common}>
          <path d="M6 26C6 13 13 7 26 6c-1 13-7 20-20 20Z" fill={`${c}22`} />
          <path d="M6 26c4-6 9-11 15-15" opacity=".7" />
        </svg>
      )
    case 'goutte':
      return (
        <svg {...common}>
          <path d="M16 4c4 6 8 10 8 15a8 8 0 0 1-16 0c0-5 4-9 8-15Z" fill={`${c}22`} />
          <path d="M11.5 19c0 2 1.3 3.5 3.2 4" opacity=".7" />
        </svg>
      )
    case 'eclat':
      return (
        <svg {...common}>
          <path d="M16 3 22 13l-6 16-6-16 6-10Z" fill={`${c}22`} />
          <path d="M16 3v26M10 13h12" opacity=".5" />
        </svg>
      )
  }
}
