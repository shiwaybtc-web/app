import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

/** Restrained buttons: hairline borders, soft glow on hover, never cartoon. */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button
      type="button"
      data-cursor="glow"
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 rounded-full font-sans uppercase tracking-[0.22em] transition-all duration-500 ease-premium disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' && 'px-4 py-2 text-[0.6rem]',
        size === 'md' && 'px-6 py-3 text-[0.66rem]',
        size === 'lg' && 'px-9 py-4 text-[0.72rem]',
        variant === 'primary' &&
          'border border-white/25 bg-white/[0.07] text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[0.12] hover:shadow-[0_10px_40px_-14px_rgba(201,184,255,0.7)]',
        variant === 'ghost' && 'border border-transparent text-white/70 hover:text-white',
        variant === 'subtle' && 'border border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
