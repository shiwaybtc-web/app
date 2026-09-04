export type ShopCategory = 'auras' | 'socle' | 'colliers' | 'ornements' | 'environnements'

export type ShopItem = {
  id: string
  categorie: ShopCategory
  nom: string
  description: string
  /** Price in in-game coins. null = premium (real money, not available in V1). */
  prix: number | null
  /** Marked "Bientôt": visible, clearly not purchasable yet. */
  bientot?: boolean
  /** Visual preset key used by the creature / socle renderers. */
  preset: string
  codex?: string
}

/** Future real payment provider. */
export interface PaymentService {
  acheter(itemId: string): Promise<{ ok: boolean }>
}

/** Future rewarded ad provider. The V1 ships a simulation only. */
export interface RewardedAdService {
  disponible(): Promise<boolean>
  regarder(): Promise<{ termine: boolean }>
}
