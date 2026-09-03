import { Reveal } from './Reveal'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }: Props) {
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <Reveal as="span" className="font-sans text-[0.62rem] uppercase tracking-[0.36em] text-crystal-300/70">
          {eyebrow}
        </Reveal>
      )}
      <Reveal
        as="h2"
        delay={0.08}
        className="font-display text-[clamp(1.35rem,3.4vw,2.6rem)] font-normal uppercase leading-tight tracking-wide2 text-white text-glow-soft"
      >
        {title}
      </Reveal>
      <Reveal delay={0.16} className="hairline w-24 opacity-70" />
      {subtitle && (
        <Reveal as="p" delay={0.22} className="max-w-xl font-sans text-sm font-light leading-relaxed text-white/60 sm:text-[0.95rem]">
          {subtitle}
        </Reveal>
      )}
    </div>
  )
}
