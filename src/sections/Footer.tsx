import { Logo } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer id="codex" className="relative px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-24 sm:px-10 sm:pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <Reveal className="hairline w-full max-w-md opacity-50" />
        <Reveal delay={0.1}>
          <Logo variant="small" shimmer />
        </Reveal>
        <Reveal as="p" delay={0.18} className="font-sans text-sm font-light text-white/50">
          {siteConfig.footer.line}
        </Reveal>
        <Reveal as="p" delay={0.24} className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
          {siteConfig.footer.copyright}
        </Reveal>
      </div>
    </footer>
  )
}
