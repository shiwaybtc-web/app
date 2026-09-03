import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function getLenis() {
  return lenisInstance
}

/** Scrolls to a hash target, using Lenis when available. */
export function scrollToHash(hash: string) {
  if (!hash || hash === '#') return
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: 0, duration: 1.6 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
