import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { t } from '@/config/texts'

type LogoProps = {
  variant?: 'hero' | 'small'
  shimmer?: boolean
  className?: string
}

/** The NEXA wordmark. */
export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo({ variant = 'small', shimmer = true, className }, ref) {
  return (
    <span
      ref={ref}
      aria-label={t.marque}
      className={cn(
        'logo-wordmark inline-block select-none leading-none',
        shimmer && 'logo-wordmark--shimmer',
        variant === 'hero' ? 'text-[clamp(3.4rem,14vw,10rem)] tracking-[0.34em] sm:tracking-ultra' : 'text-[0.95rem] tracking-[0.34em]',
        className,
      )}
    >
      {t.marque.split('').map((l, i) => (
        <span key={i} className="inline-block">
          {l}
        </span>
      ))}
    </span>
  )
})
