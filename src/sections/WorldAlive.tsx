import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ICON_CLASS = 'h-14 w-14 text-crystal-300'

function WeatherIcon({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={ICON_CLASS} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      <path d="M20 40h24a9 9 0 0 0 1.2-17.9A12 12 0 0 0 22 24.5 8 8 0 0 0 20 40Z" />
      <circle cx="46" cy="16" r="5" stroke="rgba(233,211,154,0.85)" />
      {[24, 31, 38].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="46"
          x2={x - 1.5}
          y2="51"
          stroke="rgba(169,216,255,0.9)"
          style={{ animation: animate ? `rain-fall 1.6s ease-in ${i * 0.35}s infinite` : 'none' }}
        />
      ))}
    </svg>
  )
}

function LocationIcon({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={ICON_CLASS} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      {[0, 1].map((i) => (
        <circle
          key={i}
          cx="32"
          cy="42"
          r="10"
          className="origin-[32px_42px]"
          stroke="rgba(169,216,255,0.6)"
          style={{ animation: animate ? `pulse-ring 3.2s ease-out ${i * 1.6}s infinite` : 'none', opacity: animate ? undefined : 0.3 }}
        />
      ))}
      <ellipse cx="32" cy="42" rx="16" ry="5" stroke="rgba(255,255,255,0.25)" />
      <path d="M32 42c-6-8-9-12.5-9-17a9 9 0 0 1 18 0c0 4.5-3 9-9 17Z" />
      <circle cx="32" cy="25" r="3" fill="rgba(233,211,154,0.8)" stroke="none" />
    </svg>
  )
}

function EvolutionIcon({ animate }: { animate: boolean }) {
  const dash = { strokeDasharray: 60, strokeDashoffset: animate ? 60 : 0, animation: animate ? 'dash-draw 3.6s ease-out infinite' : 'none' }
  return (
    <svg viewBox="0 0 64 64" className={ICON_CLASS} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      <path d="M32 54V34" style={dash} />
      <path d="M32 34c0-8 7-10 12-14" style={{ ...dash, animationDelay: '0.5s' }} />
      <path d="M32 34c0-8-7-10-12-14" style={{ ...dash, animationDelay: '0.8s' }} />
      <path d="M44 20c3-2 5-5 6-9" style={{ ...dash, animationDelay: '1.3s' }} />
      <path d="M20 20c-3-2-5-5-6-9" style={{ ...dash, animationDelay: '1.6s' }} />
      {[
        [32, 54, 0],
        [44, 20, 1.3],
        [20, 20, 1.6],
        [50, 11, 2.1],
        [14, 11, 2.4],
      ].map(([cx, cy, d]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.2"
          fill="rgba(201,184,255,0.9)"
          stroke="none"
          style={{ animation: animate ? `node-glow 3.6s ease-in-out ${d}s infinite` : 'none' }}
        />
      ))}
    </svg>
  )
}

const ICONS = {
  weather: WeatherIcon,
  location: LocationIcon,
  evolution: EvolutionIcon,
} as const

export function WorldAlive() {
  const reduced = useReducedMotion()
  return (
    <section id="world" className="relative px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={siteConfig.world.eyebrow} title={siteConfig.world.title} />
        <ul className="mt-16 grid gap-6 sm:mt-24 sm:grid-cols-3 sm:gap-8">
          {siteConfig.world.items.map((item, i) => {
            const Icon = ICONS[item.id as keyof typeof ICONS]
            return (
              <Reveal as="li" key={item.id} delay={0.12 + i * 0.12} className="h-full">
                <div
                  data-cursor="glow"
                  className="glass group relative flex h-full flex-col items-center gap-6 overflow-hidden rounded-2xl px-8 py-12 text-center transition-all duration-700 ease-premium hover:-translate-y-1.5 hover:border-white/15 hover:shadow-[0_20px_60px_-20px_rgba(157,124,255,0.35)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(214,198,255,0.8), transparent)' }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle, rgba(157,124,255,0.22), rgba(0,0,0,0) 70%)', filter: 'blur(10px)' }}
                  />
                  <Icon animate={!reduced} />
                  <h3 className="font-display text-sm uppercase tracking-[0.3em] text-white">{item.title}</h3>
                  <p className="font-sans text-sm font-light leading-relaxed text-white/60">{item.text}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
