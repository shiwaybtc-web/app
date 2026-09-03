import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'
import { siteConfig, type NavLink } from '@/config/site'
import { scrollToHash } from '@/lib/scroll'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

function NavItem({ link, onNavigate, index }: { link: NavLink; onNavigate?: () => void; index: number }) {
  return (
    <motion.a
      href={link.href}
      data-cursor="glow"
      aria-disabled={link.comingSoon || undefined}
      className={cn(
        'nav-link group relative font-sans text-[0.66rem] uppercase tracking-[0.3em] text-white/70',
        link.comingSoon && 'text-white/40',
      )}
      onClick={(e) => {
        e.preventDefault()
        if (link.comingSoon) return
        scrollToHash(link.href)
        onNavigate?.()
      }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.35 + index * 0.08 }}
    >
      {link.label}
      {link.comingSoon && (
        <span className="pointer-events-none absolute -right-1 top-full mt-2 translate-y-1 font-sans text-[0.5rem] tracking-[0.3em] text-gold-300/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-gold-300/80">
          SOON
        </span>
      )}
    </motion.a>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      {/* Top gradient so the wordmark and links stay legible over the bright sky. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: 'linear-gradient(180deg, rgba(4,6,15,0.55) 0%, rgba(4,6,15,0) 100%)' }}
      />
      <div className="relative flex items-center justify-between px-6 pt-[max(1.35rem,env(safe-area-inset-top))] sm:px-10 sm:pt-7">
        <motion.a
          href="#top"
          data-cursor="glow"
          className="pointer-events-auto transition-transform duration-500 ease-premium hover:-translate-y-0.5"
          onClick={(e) => {
            e.preventDefault()
            scrollToHash('#top')
          }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
        >
          <Logo variant="small" shimmer />
        </motion.a>

        <nav className="pointer-events-auto hidden items-center gap-8 sm:flex lg:gap-11">
          {siteConfig.nav.map((link, i) => (
            <NavItem key={link.label} link={link} index={i} />
          ))}
        </nav>

        <motion.button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          data-cursor="glow"
          className="pointer-events-auto flex h-9 w-9 items-center justify-center sm:hidden"
          onClick={() => setOpen((v) => !v)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                'absolute left-0 top-0 h-px w-full bg-white/80 transition-transform duration-500 ease-premium',
                open && 'translate-y-[5.5px] rotate-45',
              )}
            />
            <span
              className={cn(
                'absolute bottom-0 left-0 h-px w-full bg-white/80 transition-transform duration-500 ease-premium',
                open && '-translate-y-[5.5px] -rotate-45',
              )}
            />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-auto fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-9 sm:hidden"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(11,18,38,0.92), rgba(4,6,15,0.96))',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {siteConfig.nav.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.07 }}
              >
                <a
                  href={link.href}
                  className={cn(
                    'font-display text-lg uppercase tracking-[0.34em] text-white/85',
                    link.comingSoon && 'text-white/35',
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    if (link.comingSoon) return
                    setOpen(false)
                    window.setTimeout(() => scrollToHash(link.href), 200)
                  }}
                >
                  {link.label}
                  {link.comingSoon && <span className="ml-3 align-middle font-sans text-[0.5rem] tracking-[0.3em] text-gold-300/70">SOON</span>}
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
