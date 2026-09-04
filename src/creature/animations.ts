import type { CreatureClip } from '@/types/creature'

/**
 * Animation contract shared by the 2.5D sprite and the future 3D model.
 * When a GLB is provided, map each clip name to the clip in the file.
 */
export const clipDurationsMs: Record<CreatureClip, number> = {
  idle: 0,
  marche: 1200,
  course: 900,
  dort: 0,
  heureuse: 900,
  curieuse: 1100,
  mange: 1200,
  reaction: 700,
  evolution: 4000,
  niveau_superieur: 1800,
}

/** Clip names expected in `baby.glb` (future). */
export const glbClipNames: Record<CreatureClip, string> = {
  idle: 'Idle',
  marche: 'Walk',
  course: 'Run',
  dort: 'Sleep',
  heureuse: 'Happy',
  curieuse: 'Curious',
  mange: 'Eat',
  reaction: 'React',
  evolution: 'Evolve',
  niveau_superieur: 'LevelUp',
}

/** Framer Motion keyframes used by the sprite for one-shot reactions. */
export const spriteReactions: Partial<Record<CreatureClip, { y?: number[]; scaleX?: number[]; scaleY?: number[]; rotate?: number[] }>> = {
  reaction: { scaleX: [1, 1.06, 0.97, 1], scaleY: [1, 0.94, 1.04, 1], y: [0, 0, -10, 0] },
  heureuse: { y: [0, -18, 0, -8, 0], scaleY: [1, 1.03, 0.98, 1.02, 1] },
  curieuse: { rotate: [0, -3, 2, 0], y: [0, -4, -2, 0] },
  mange: { scaleY: [1, 0.96, 1, 0.96, 1], y: [0, 4, 0, 4, 0] },
  niveau_superieur: { y: [0, -34, 0, -14, 0], scaleX: [1, 0.96, 1.05, 1, 1], scaleY: [1, 1.06, 0.95, 1.02, 1] },
  evolution: { y: [0, -20, -20, 0], scaleX: [1, 1.05, 1.05, 1] },
}
