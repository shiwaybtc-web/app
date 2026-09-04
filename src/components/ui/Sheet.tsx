import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconFermer } from './Icons'
import { t } from '@/config/texts'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  titre?: string
  sousTitre?: string
  children: ReactNode
  /** Wider panel on desktop. */
  large?: boolean
  /** Header extra (chips…). */
  extra?: ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Bottom sheet on phones, centered panel on larger screens.
 * Translucent, restrained: the world stays visible behind.
 */
export function Sheet({ open, onClose, titre, sousTitre, children, large, extra }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-night-950/45" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={titre}
            className={cn(
              'panel relative flex max-h-[88svh] w-full flex-col overflow-hidden rounded-t-[28px] sm:max-h-[86vh] sm:rounded-[26px]',
              large ? 'sm:max-w-3xl' : 'sm:max-w-lg',
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5 sm:px-8 sm:pt-7">
              <div className="min-w-0">
                {titre && <h2 className="font-display text-[1.05rem] uppercase tracking-[0.22em] text-white text-glow-soft sm:text-[1.15rem]">{titre}</h2>}
                {sousTitre && <p className="mt-1.5 font-sans text-[0.8rem] font-light leading-relaxed text-white/55">{sousTitre}</p>}
                {extra && <div className="mt-2">{extra}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.commun.fermer}
                data-cursor="glow"
                className="icon-button -mr-2 -mt-1 shrink-0"
              >
                <IconFermer />
              </button>
            </div>
            <div className="scroll-area min-h-0 flex-1 overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
