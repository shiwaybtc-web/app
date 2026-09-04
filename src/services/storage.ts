import type { SaveData } from '@/types/game'

/**
 * Persistence boundary. The prototype uses localStorage; a remote adapter
 * (database + auth) can implement the same interface later.
 */
export interface StorageAdapter {
  charger(): Promise<SaveData | null>
  sauvegarder(data: SaveData): Promise<void>
  effacer(): Promise<void>
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private cle: string) {}

  async charger(): Promise<SaveData | null> {
    try {
      const raw = window.localStorage.getItem(this.cle)
      return raw ? (JSON.parse(raw) as SaveData) : null
    } catch {
      return null
    }
  }

  async sauvegarder(data: SaveData): Promise<void> {
    try {
      window.localStorage.setItem(this.cle, JSON.stringify(data))
    } catch {
      // Quota or private mode: the game keeps running in memory.
    }
  }

  async effacer(): Promise<void> {
    try {
      window.localStorage.removeItem(this.cle)
    } catch {
      // ignore
    }
  }
}

/** Placeholder for the future server-side save. */
export class RemoteStorageAdapter implements StorageAdapter {
  async charger(): Promise<SaveData | null> {
    throw new Error('RemoteStorageAdapter : non implémenté (V1).')
  }
  async sauvegarder(): Promise<void> {
    throw new Error('RemoteStorageAdapter : non implémenté (V1).')
  }
  async effacer(): Promise<void> {
    throw new Error('RemoteStorageAdapter : non implémenté (V1).')
  }
}
