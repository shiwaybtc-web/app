import type { CreatureClip } from '@/types/creature'

type Props = {
  src: string
  clip: CreatureClip
  hauteur: number
}

/**
 * Future 3D renderer.
 *
 * When `assets.creature.bebe.model` points to a .glb / .gltf file and `kind`
 * is set to 'model', <CreatureView /> renders this component instead of the
 * 2.5D sprite. Implementation plan (not shipped in V1 to keep the bundle
 * light): React Three Fiber + drei's useGLTF / useAnimations, mapping
 * `glbClipNames` (see animations.ts) to the file's clips, with the same
 * anchor, shadow and aura layers as the sprite.
 *
 * The same model is meant to serve the game, the customisation, the
 * rendering and a future 3D-print export.
 */
export function CreatureModel({ src }: Props) {
  if (import.meta.env.DEV) {
    console.warn(`CreatureModel : aucun rendu 3D n’est implémenté en V1 (modèle demandé : ${src}).`)
  }
  return null
}
