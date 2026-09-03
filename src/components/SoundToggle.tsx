import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  enabled: boolean
  onToggle: () => void
  visible: boolean
}

export function SoundToggle({ enabled, onToggle, visible }: Props) {
  const reduced = useReducedMotion()
  return (
    <button
      type="button"
      data-cursor="glow"
      aria-pressed={enabled}
      aria-label={enabled ? siteConfig.sound.labelOn : siteConfig.sound.labelOff}
      onClick={onToggle}
      className={cn(
        'glass fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 flex items-center gap-3 rounded-full px-3.5 py-3 sm:px-4 sm:py-2.5 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-white/70 transition-all duration-700 ease-premium hover:-translate-y-0.5 hover:text-white hover:shadow-[0_0_24px_rgba(157,124,255,0.25)] sm:right-8',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <span className="flex h-3 items-end gap-[3px]" aria-hidden>
        {[0.9, 0.5, 1, 0.65].map((h, i) => (
          <span
            key={i}
            className="block w-[2px] origin-bottom rounded-full bg-crystal-300"
            style={{
              height: `${h * 100}%`,
              transform: enabled ? undefined : 'scaleY(0.3)',
              opacity: enabled ? 1 : 0.5,
              transition: 'transform 0.6s, opacity 0.6s',
              animation: enabled && !reduced ? `sound-bar ${1.1 + i * 0.23}s ease-in-out ${i * 0.12}s infinite` : 'none',
            }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{enabled ? siteConfig.sound.labelOn : siteConfig.sound.labelOff}</span>
    </button>
  )
}
