import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...rest,
})

export const IconNourrir = ({ size = 22, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="M12 20c-4 0-7-3-7-7 0-4.5 4-8 7-9 3 1 7 4.5 7 9 0 4-3 7-7 7Z" />
    <path d="M12 20V9M9 13c1 .5 2 1.3 3 2.5M15 12c-1 .4-2 1.2-3 2.3" />
  </svg>
)
export const IconJouer = ({ size = 22, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />
    <path d="M18.5 15.5c.3 1.6 1.1 2.4 2.5 2.5-1.4.2-2.2 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.1 2.3-.9 2.5-2.5Z" />
  </svg>
)
export const IconExplorer = ({ size = 22, ...r }: P) => (
  <svg {...base(size, r)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
)
export const IconEvolution = ({ size = 22, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="M12 21v-8M12 13c0-4 3-5 6-7M12 13c0-4-3-5-6-7" />
    <circle cx="18" cy="6" r="1.2" /> <circle cx="6" cy="6" r="1.2" /> <circle cx="12" cy="21" r="1.2" />
    <path d="M12 13c0-2.5 1.2-4 3-5.5M12 13c0-2.5-1.2-4-3-5.5" opacity=".5" />
  </svg>
)
export const IconMenu = ({ size = 22, ...r }: P) => (
  <svg {...base(size, r)}>
    <circle cx="5" cy="12" r="1" fill="currentColor" /> <circle cx="12" cy="12" r="1" fill="currentColor" /> <circle cx="19" cy="12" r="1" fill="currentColor" />
  </svg>
)
export const IconFermer = ({ size = 20, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)
export const IconRetour = ({ size = 20, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="m14 6-6 6 6 6" />
  </svg>
)
export const IconEclat = ({ size = 16, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="M12 3l5 8-5 10-5-10 5-8Z" />
    <path d="M12 3v18M7 11h10" opacity=".5" />
  </svg>
)
export const IconSon = ({ size = 18, actif = false, ...r }: P & { actif?: boolean }) => (
  <svg {...base(size, r)}>
    <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
    {actif && <path d="M15 9c1.3 1.5 1.3 4.5 0 6M18 7c2.5 3 2.5 7 0 10" />}
  </svg>
)
export const IconCoffre = ({ size = 18, ...r }: P) => (
  <svg {...base(size, r)}>
    <rect x="4" y="8" width="16" height="11" rx="2" />
    <path d="M4 12h16M12 12v3M6 8V6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5V8" />
  </svg>
)
export const IconLieu = ({ size = 18, ...r }: P) => (
  <svg {...base(size, r)}>
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z" />
    <circle cx="12" cy="10" r="2" />
  </svg>
)
export const IconVerrou = ({ size = 16, ...r }: P) => (
  <svg {...base(size, r)}>
    <rect x="6" y="10" width="12" height="10" rx="2" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </svg>
)

/** Weather glyphs. */
export function IconMeteo({ kind, size = 18, ...r }: P & { kind: string }) {
  const b = base(size, r)
  switch (kind) {
    case 'soleil':
    case 'chaleur':
      return (
        <svg {...b}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </svg>
      )
    case 'pluie':
      return (
        <svg {...b}>
          <path d="M7 15a4 4 0 0 1-.5-8A6 6 0 0 1 18 8.5 3.5 3.5 0 0 1 17 15H7Z" />
          <path d="M9 17.5 8 20M13 17.5l-1 2.5M17 17.5l-1 2.5" />
        </svg>
      )
    case 'orage':
      return (
        <svg {...b}>
          <path d="M7 14a4 4 0 0 1-.5-8A6 6 0 0 1 18 7.5 3.5 3.5 0 0 1 17 14H7Z" />
          <path d="m13 14-2 4h3l-2 4" />
        </svg>
      )
    case 'neige':
    case 'froid':
      return (
        <svg {...b}>
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" opacity=".8" />
        </svg>
      )
    case 'nuageux':
      return (
        <svg {...b}>
          <path d="M7 17a4 4 0 0 1-.5-8A6 6 0 0 1 18 10.5 3.5 3.5 0 0 1 17 17H7Z" />
        </svg>
      )
    default:
      return (
        <svg {...b}>
          <circle cx="12" cy="12" r="8.5" strokeDasharray="2 3" />
        </svg>
      )
  }
}
