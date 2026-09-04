import { gameConfig } from '@/config/game'
import type { PlayerProgress } from '@/types/game'

export function xpPourNiveau(niveau: number) {
  return gameConfig.progression.xpPourNiveau(niveau)
}

/**
 * Adds XP and resolves level-ups. Returns the new progress and how many
 * levels were gained.
 */
export function ajouterXp(progress: PlayerProgress, montant: number): { progress: PlayerProgress; niveauxGagnes: number } {
  let { niveau, xp, pieces } = progress
  const xpTotal = progress.xpTotal + montant
  xp += montant
  let niveauxGagnes = 0
  while (niveau < gameConfig.progression.niveauMax && xp >= xpPourNiveau(niveau)) {
    xp -= xpPourNiveau(niveau)
    niveau += 1
    niveauxGagnes += 1
    pieces += gameConfig.progression.piecesParNiveau
  }
  if (niveau >= gameConfig.progression.niveauMax) xp = Math.min(xp, xpPourNiveau(niveau) - 1)
  return { progress: { niveau, xp, pieces, xpTotal }, niveauxGagnes }
}

export function progressionNiveau(progress: PlayerProgress) {
  const besoin = xpPourNiveau(progress.niveau)
  return { besoin, ratio: Math.min(1, progress.xp / besoin) }
}
