/**
 * Social architecture (future). Only data models for now; no backend.
 */
export type FriendStatus = 'en_attente' | 'ami' | 'bloque'

export type Friend = {
  id: string
  pseudo: string
  statut: FriendStatus
  niveau: number
  nomCreature: string
  depuis: number
}

export type SharedMissionKind = 'marche' | 'exploration' | 'quotidien' | 'famille'

export type SharedMission = {
  id: string
  titre: string
  kind: SharedMissionKind
  participants: string[]
  objectif: number
  progression: Record<string, number>
  recompenseXp: number
  termineeLe: number | null
}

/** Union of two Nexa. Produces a shared egg, a variant or a mutation. */
export type Jumelage = {
  id: string
  joueurs: [string, string]
  creatures: [string, string]
  demandeLe: number
  accepteLe: number | null
  resultat: 'oeuf_partage' | 'variante' | 'mutation' | 'recompense' | null
}

export interface SocialService {
  listerAmis(): Promise<Friend[]>
  ajouterAmi(code: string): Promise<Friend>
  visiterCreature(idAmi: string): Promise<unknown>
  proposerJumelage(idAmi: string): Promise<Jumelage>
}
