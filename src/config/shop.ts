import type { ShopItem } from '@/types/shop'

/**
 * Cosmetic catalogue. Items with a `prix` are purchasable with in-game coins
 * and actually change the creature / socle rendering. Items with `prix: null`
 * are premium placeholders, clearly marked "Bientôt".
 */
export const shopItems: ShopItem[] = [
  // Auras -----------------------------------------------------------------
  { id: 'aura-ivoire', categorie: 'auras', nom: 'Aura d’ivoire', description: 'Douce lueur blanche. Offerte.', prix: 0, preset: 'ivoire', codex: 'acc-aura-ivoire' },
  { id: 'aura-amethyste', categorie: 'auras', nom: 'Aura d’améthyste', description: 'Violet profond, discret la nuit.', prix: 120, preset: 'amethyste', codex: 'acc-aura-amethyste' },
  { id: 'aura-aurore', categorie: 'auras', nom: 'Aura d’aurore', description: 'Or pâle et rose du matin.', prix: 180, preset: 'aurore', codex: 'acc-aura-aurore' },
  { id: 'aura-abysse', categorie: 'auras', nom: 'Aura d’abysse', description: 'Bleu des eaux profondes.', prix: 180, preset: 'abysse', codex: 'acc-aura-abysse' },
  // Socle ------------------------------------------------------------------
  { id: 'socle-nu', categorie: 'socle', nom: 'Socle ancien', description: 'Le socle tel qu’il fut trouvé.', prix: 0, preset: 'nu' },
  { id: 'socle-runique', categorie: 'socle', nom: 'Cercle runique', description: 'Un anneau de runes tourne lentement sous votre Nexa.', prix: 150, preset: 'runique', codex: 'acc-socle-runique' },
  { id: 'socle-lueurs', categorie: 'socle', nom: 'Lueurs flottantes', description: 'Des lueurs montent du socle.', prix: 100, preset: 'lueurs', codex: 'acc-socle-lueurs' },
  // Premium placeholders ----------------------------------------------------
  { id: 'collier-lune', categorie: 'colliers', nom: 'Collier de lune', description: 'Un croissant d’argent au cou de votre Nexa.', prix: null, bientot: true, preset: 'lune' },
  { id: 'ornement-celeste', categorie: 'ornements', nom: 'Ornement céleste', description: 'Constellation flottant au-dessus des cristaux.', prix: null, bientot: true, preset: 'celeste' },
  { id: 'env-nuit-cristaux', categorie: 'environnements', nom: 'Nuit des cristaux', description: 'Un sanctuaire alternatif, baigné de lune.', prix: null, bientot: true, preset: 'nuit-cristaux' },
]

export const shopItemById = Object.fromEntries(shopItems.map((i) => [i.id, i])) as Record<string, ShopItem>

/** Visual presets for auras, consumed by the creature renderer. */
export const auraPresets: Record<string, { couleur: string; intensite: number }> = {
  ivoire: { couleur: '244, 240, 255', intensite: 0.35 },
  amethyste: { couleur: '164, 140, 255', intensite: 0.5 },
  aurore: { couleur: '242, 201, 122', intensite: 0.45 },
  abysse: { couleur: '96, 170, 255', intensite: 0.5 },
}
