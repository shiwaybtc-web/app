import { assets } from '@/config/assets'
import { useGame } from '@/game/store'
import { CreatureSprite } from './CreatureSprite'
import { CreatureModel } from './CreatureModel'
import { SocleDecor } from './SocleDecor'
import { auraPresets } from '@/config/shop'

type Props = { visible?: boolean }

/**
 * Chooses the renderer for the hatched creature: 2.5D sprite today, GLB
 * model when `assets.creature.bebe.kind === 'model'`.
 */
export function CreatureView({ visible = true }: Props) {
  const reaction = useGame((s) => s.ui.reaction)
  const cosmetiques = useGame((s) => s.save.cosmetiques)
  const humeur = useGame((s) => s.save.creature.humeur)
  const toucher = useGame((s) => s.toucherCreature)
  const def = assets.creature.bebe
  const aura = auraPresets[cosmetiques.aura] ?? auraPresets.ivoire
  const kind: string = def.kind
  return (
    <>
      <SocleDecor preset={cosmetiques.socle} couleur={aura.couleur} />
      {kind === 'model' && def.model ? (
        <CreatureModel src={def.model} clip={reaction?.clip ?? 'idle'} hauteur={def.hauteurScene} />
      ) : (
        <CreatureSprite reaction={reaction} aura={cosmetiques.aura} onTap={toucher} humeur={humeur} visible={visible} />
      )}
    </>
  )
}
