/**
 * A tiny shared pointer store so that the cursor, the parallax layer and
 * the particle canvas all read from a single set of listeners.
 */

export type PointerState = {
  /** Pixel position. */
  x: number
  y: number
  /** Normalised position in [-1, 1] relative to the viewport centre. */
  nx: number
  ny: number
  /** True once the pointer has moved at least once. */
  active: boolean
  /** True while the pointer is over an element with data-cursor="glow". */
  hovering: boolean
  /** Coarse pointer (touch) devices. */
  coarse: boolean
}

const state: PointerState = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  nx: 0,
  ny: 0,
  active: false,
  hovering: false,
  coarse:
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false,
}

let listening = false

function onMove(e: PointerEvent) {
  state.x = e.clientX
  state.y = e.clientY
  state.nx = (e.clientX / window.innerWidth) * 2 - 1
  state.ny = (e.clientY / window.innerHeight) * 2 - 1
  state.active = true
  const target = e.target as Element | null
  state.hovering = !!target?.closest?.('[data-cursor="glow"]')
}

function onLeave() {
  state.active = false
  state.hovering = false
}

export function ensurePointerListeners() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
}

export function getPointer(): PointerState {
  ensurePointerListeners()
  return state
}
