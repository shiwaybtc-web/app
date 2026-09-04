import { create } from 'zustand'
import { AFFINITIES, type Affinities, type Affinity, type CreatureClip } from '@/types/creature'
import type { FoodId, GameEvent, SaveData } from '@/types/game'
import type { DayPeriod, WeatherKind, WeatherSnapshot } from '@/types/world'
import type { ChestReward } from '@/types/exploration'
import { gameConfig } from '@/config/game'
import { foodById } from '@/config/foods'
import { shopItemById } from '@/config/shop'
import { demoMap } from '@/config/exploration'
import { LocalStorageAdapter, type StorageAdapter } from '@/services/storage'
import { cleDuJour, heureDecimale, periodeDominante } from '@/services/clock'
import { ajouterXp } from './progression'
import { appliquerGains, fusionnerGains, gainsAmbiance } from './affinities'

export type Panel =
  | 'menu'
  | 'nourrir'
  | 'jouer'
  | 'explorer'
  | 'evolution'
  | 'codex'
  | 'boutique'
  | 'amis'
  | 'reglages'
  | 'journal'

export type Floating = { id: number; texte: string; couleur?: string; dx?: number }

export type DevOverrides = { periode: DayPeriod | null; meteo: WeatherKind | null }

export type Reaction = { clip: CreatureClip; id: number }

type UIState = {
  pret: boolean
  ecran: 'intro' | 'jeu'
  panneau: Panel | null
  niveauSuperieur: number | null
  flottants: Floating[]
  reaction: Reaction | null
  positionDemo: { x: number; y: number }
  dev: DevOverrides
}

type Actions = {
  charger(): Promise<void>
  sauvegarderMaintenant(): Promise<void>
  reinitialiser(): Promise<void>

  marquerIntroVue(): void
  entrerDansLeJeu(): void
  ouvrirPanneau(p: Panel | null): void
  fermerNiveauSuperieur(): void
  ajouterFlottant(texte: string, couleur?: string): void
  retirerFlottant(id: number): void
  declencherReaction(clip: CreatureClip): void

  toucherOeuf(): 'fissure' | 'eclosion'
  terminerEclosion(nom: string): void
  nommerCreature(nom: string): void
  toucherCreature(): void

  gagnerXp(montant: number, label: string, kind?: GameEvent['kind'], affinites?: Partial<Affinities>): void
  gagnerPieces(montant: number): void
  ajouterAffinites(gains: Partial<Affinities>): void
  decouvrir(codexId: string): void
  ajouterAliment(id: FoodId, quantite: number): void

  tickRecharges(): void
  nourrir(id: FoodId): { ok: boolean; xp?: number }
  terminerJeu(lueurs: number): { xp: number; reduit: boolean; aliment: FoodId | null }
  doublerRecompense(xp: number): void
  deplacerJoueurDemo(x: number, y: number): void
  ouvrirCoffre(id: string): ChestReward[] | null
  decouvrirLieu(id: string): boolean

  acheter(itemId: string): boolean
  equiper(itemId: string): void

  definirMeteo(m: WeatherSnapshot | null): void
  definirReglages(r: Partial<SaveData['reglages']>): void

  contexte(): { periode: DayPeriod; meteo: WeatherKind }

  devDefinir(o: Partial<DevOverrides>): void
  devNiveau(delta: number): void
  devAffinite(a: Affinity, delta: number): void
  devRejouerEclosion(): void
  devRecharges(): void
}

export type GameStore = { save: SaveData; ui: UIState } & Actions

let adapter: StorageAdapter = new LocalStorageAdapter(gameConfig.sauvegarde.cle)
export function definirAdaptateur(a: StorageAdapter) {
  adapter = a
}

let saveTimer = 0
let floatingId = 0
let reactionId = 0

function planifierSauvegarde(get: () => GameStore) {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => void adapter.sauvegarder(get().save), 400)
}

function journaliser(save: SaveData, e: Omit<GameEvent, 'at'>): SaveData {
  const journal = [{ at: Date.now(), ...e }, ...save.journal].slice(0, gameConfig.journal.taille)
  return { ...save, journal }
}

function minutes(n: number) {
  return n * 60 * 1000
}

export const useGame = create<GameStore>()((set, get) => {
  const patch = (fn: (save: SaveData) => SaveData) => {
    set((s) => ({ save: fn(s.save) }))
    planifierSauvegarde(get)
  }

  return {
    save: null as unknown as SaveData,
    ui: {
      pret: false,
      ecran: 'intro',
      panneau: null,
      niveauSuperieur: null,
      flottants: [],
      reaction: null,
      positionDemo: { ...demoMap.positionDepart },
      dev: { periode: null, meteo: null },
    },

    async charger() {
      const { nouvelleSauvegarde, migrer } = await import('./save')
      const loaded = await adapter.charger()
      const save = loaded ? migrer(loaded) : nouvelleSauvegarde()
      set({ save: { ...save, derniereVisite: Date.now() }, ui: { ...get().ui, pret: true } })
      get().tickRecharges()
    },

    async sauvegarderMaintenant() {
      await adapter.sauvegarder(get().save)
    },

    async reinitialiser() {
      const { nouvelleSauvegarde } = await import('./save')
      await adapter.effacer()
      set({
        save: nouvelleSauvegarde(),
        ui: { ...get().ui, ecran: 'intro', panneau: null, niveauSuperieur: null, flottants: [], reaction: null },
      })
    },

    marquerIntroVue() {
      patch((s) => ({ ...s, introVue: true }))
    },
    entrerDansLeJeu() {
      set((s) => ({ ui: { ...s.ui, ecran: 'jeu' } }))
    },
    ouvrirPanneau(p) {
      set((s) => ({ ui: { ...s.ui, panneau: p } }))
    },
    fermerNiveauSuperieur() {
      set((s) => ({ ui: { ...s.ui, niveauSuperieur: null } }))
    },
    ajouterFlottant(texte, couleur) {
      const id = ++floatingId
      set((s) => ({ ui: { ...s.ui, flottants: [...s.ui.flottants, { id, texte, couleur, dx: Math.round((Math.random() - 0.5) * 60) }] } }))
      window.setTimeout(() => get().retirerFlottant(id), 1800)
    },
    retirerFlottant(id) {
      set((s) => ({ ui: { ...s.ui, flottants: s.ui.flottants.filter((f) => f.id !== id) } }))
    },
    declencherReaction(clip) {
      set((s) => ({ ui: { ...s.ui, reaction: { clip, id: ++reactionId } } }))
    },

    toucherOeuf() {
      const s = get().save
      const fissures = s.creature.fissures + 1
      patch((sv) => ({ ...sv, creature: { ...sv.creature, fissures } }))
      return fissures >= 3 ? 'eclosion' : 'fissure'
    },

    terminerEclosion(nom) {
      patch((s) => {
        let next: SaveData = {
          ...s,
          eclosionTerminee: true,
          creature: { ...s.creature, stage: 'bebe', nom: nom.trim() || 'Nexa', neLe: Date.now(), humeur: 'curieuse' },
          codex: s.codex.includes('crea-bebe') ? s.codex : [...s.codex, 'crea-bebe', 'acc-aura-ivoire'],
        }
        next = journaliser(next, { kind: 'eclosion', label: `${next.creature.nom} est né.` })
        return next
      })
    },

    nommerCreature(nom) {
      patch((s) => ({ ...s, creature: { ...s.creature, nom: nom.trim() || s.creature.nom } }))
    },

    toucherCreature() {
      const clips: CreatureClip[] = ['reaction', 'heureuse', 'curieuse']
      get().declencherReaction(clips[Math.floor(Math.random() * clips.length)])
      patch((s) => ({ ...s, creature: { ...s.creature, humeur: 'heureuse' } }))
    },

    gagnerXp(montant, label, kind = 'jouer', affinites) {
      const before = get().save.joueur.niveau
      patch((s) => {
        const { progress, niveauxGagnes } = ajouterXp(s.joueur, montant)
        let next: SaveData = { ...s, joueur: progress }
        if (affinites) next = { ...next, creature: { ...next.creature, affinites: appliquerGains(next.creature.affinites, affinites) } }
        next = journaliser(next, { kind, label, xp: montant, affinites })
        if (niveauxGagnes > 0) next = journaliser(next, { kind: 'niveau', label: `Niveau ${progress.niveau} atteint.` })
        return next
      })
      get().ajouterFlottant(`+${montant} XP`)
      const after = get().save.joueur.niveau
      if (after > before) {
        set((s) => ({ ui: { ...s.ui, niveauSuperieur: after } }))
        get().declencherReaction('niveau_superieur')
      } else {
        get().declencherReaction('heureuse')
      }
    },

    gagnerPieces(montant) {
      patch((s) => ({ ...s, joueur: { ...s.joueur, pieces: s.joueur.pieces + montant } }))
      get().ajouterFlottant(`+${montant} éclats`, '#e9d39a')
    },

    ajouterAffinites(gains) {
      patch((s) => ({ ...s, creature: { ...s.creature, affinites: appliquerGains(s.creature.affinites, gains) } }))
    },

    decouvrir(codexId) {
      if (get().save.codex.includes(codexId)) return
      patch((s) => ({ ...s, codex: [...s.codex, codexId] }))
    },

    ajouterAliment(id, quantite) {
      patch((s) => ({
        ...s,
        inventaire: { ...s.inventaire, aliments: { ...s.inventaire.aliments, [id]: (s.inventaire.aliments[id] ?? 0) + quantite } },
      }))
    },

    tickRecharges() {
      const now = Date.now()
      patch((s) => {
        let r = { ...s.recharges }
        const regen = minutes(gameConfig.nourrir.regenerationMinutes)
        if (r.appetit < gameConfig.nourrir.appetitMax) {
          const gained = Math.floor((now - r.appetitDepuis) / regen)
          if (gained > 0) {
            r.appetit = Math.min(gameConfig.nourrir.appetitMax, r.appetit + gained)
            r.appetitDepuis = r.appetit >= gameConfig.nourrir.appetitMax ? now : r.appetitDepuis + gained * regen
          }
        } else {
          r.appetitDepuis = now
        }
        let inventaire = s.inventaire
        const jour = cleDuJour()
        if (r.rationDuJour !== jour) {
          const ration = gameConfig.nourrir.rationQuotidienne
          const aliments = { ...inventaire.aliments }
          for (const k of Object.keys(ration) as FoodId[]) aliments[k] = (aliments[k] ?? 0) + ration[k]
          inventaire = { ...inventaire, aliments }
          r = { ...r, rationDuJour: jour }
        }
        const humeur = r.appetit === 0 ? 'calme' : s.creature.humeur
        return { ...s, recharges: r, inventaire, creature: { ...s.creature, humeur } }
      })
    },

    nourrir(id) {
      const s = get().save
      const def = foodById[id]
      if (!def) return { ok: false }
      if (s.recharges.appetit <= 0) return { ok: false }
      if ((s.inventaire.aliments[id] ?? 0) <= 0) return { ok: false }
      const { periode, meteo } = get().contexte()
      const gains = fusionnerGains({ [def.affinite]: gameConfig.affinites.choix }, gainsAmbiance(meteo, periode))
      patch((sv) => ({
        ...sv,
        recharges: {
          ...sv.recharges,
          appetit: sv.recharges.appetit - 1,
          appetitDepuis: sv.recharges.appetit === gameConfig.nourrir.appetitMax ? Date.now() : sv.recharges.appetitDepuis,
        },
        inventaire: { ...sv.inventaire, aliments: { ...sv.inventaire.aliments, [id]: sv.inventaire.aliments[id] - 1 } },
        creature: { ...sv.creature, humeur: 'heureuse' },
      }))
      get().decouvrir(`obj-${id}`)
      get().declencherReaction('mange')
      window.setTimeout(() => get().gagnerXp(def.xp, `${s.creature.nom} ${def.reaction} (${def.nom}).`, 'nourrir', gains), 900)
      return { ok: true, xp: def.xp }
    },

    terminerJeu(lueurs) {
      const s = get().save
      const cfg = gameConfig.jouer
      const now = Date.now()
      const reduit = now - s.recharges.dernierJeu < minutes(cfg.rechargeMinutes)
      let xp = Math.min(cfg.xpMax, cfg.xpBase + lueurs * cfg.xpParLueur)
      if (reduit) xp = Math.max(2, Math.round(xp * cfg.facteurReduit))
      let aliment: FoodId | null = null
      if (!reduit && Math.random() < cfg.chanceAliment) {
        const pool: FoodId[] = ['baie-de-lune', 'nectar-solaire', 'feuille-argentee', 'goutte-de-source']
        aliment = pool[Math.floor(Math.random() * pool.length)]
        get().ajouterAliment(aliment, 1)
      }
      const { periode, meteo } = get().contexte()
      const gains = fusionnerGains({ fulgurante: reduit ? 0 : 1 }, gainsAmbiance(meteo, periode))
      if (!reduit) patch((sv) => ({ ...sv, recharges: { ...sv.recharges, dernierJeu: now } }))
      get().gagnerXp(xp, `${s.creature.nom} a attrapé ${lueurs} lueurs.`, 'jouer', gains)
      return { xp, reduit, aliment }
    },

    doublerRecompense(xp) {
      get().gagnerXp(xp, 'Récompense multipliée (publicité simulée).', 'jouer')
    },

    deplacerJoueurDemo(x, y) {
      set((s) => ({ ui: { ...s.ui, positionDemo: { x, y } } }))
    },

    ouvrirCoffre(id) {
      const point = demoMap.points.find((p) => p.id === id && p.kind === 'coffre')
      if (!point?.recompenses) return null
      const s = get().save
      const pret = (s.recharges.coffres[id] ?? 0) <= Date.now()
      if (!pret) return null
      const prochain = Date.now() + minutes(gameConfig.explorer.rechargeCoffreMinutes)
      patch((sv) => journaliser({ ...sv, recharges: { ...sv.recharges, coffres: { ...sv.recharges.coffres, [id]: prochain } } }, { kind: 'coffre', label: `${point.titre} ouvert.` }))
      for (const r of point.recompenses) {
        if (r.type === 'xp') get().gagnerXp(r.montant, `Trouvé dans ${point.titre}.`, 'coffre')
        if (r.type === 'pieces') get().gagnerPieces(r.montant)
        if (r.type === 'aliment') {
          get().ajouterAliment(r.id, r.quantite)
          get().decouvrir(`obj-${r.id}`)
        }
        if (r.type === 'fragment') {
          patch((sv) => ({ ...sv, inventaire: { ...sv.inventaire, objets: [...sv.inventaire.objets, r.id] } }))
          get().decouvrir(r.id)
        }
      }
      return point.recompenses
    },

    decouvrirLieu(id) {
      const point = demoMap.points.find((p) => p.id === id && p.kind === 'lieu')
      if (!point?.codex) return false
      if (get().save.codex.includes(point.codex)) return false
      get().decouvrir(point.codex)
      const gains: Partial<Affinities> = point.affinite ? { [point.affinite]: gameConfig.affinites.choix } : {}
      get().gagnerXp(15, `${point.titre} découvert.`, 'decouverte', gains)
      return true
    },

    acheter(itemId) {
      const item = shopItemById[itemId]
      const s = get().save
      if (!item || item.prix === null || s.possessions.includes(itemId) || s.joueur.pieces < item.prix) return false
      patch((sv) => journaliser({ ...sv, joueur: { ...sv.joueur, pieces: sv.joueur.pieces - (item.prix ?? 0) }, possessions: [...sv.possessions, itemId] }, { kind: 'achat', label: `${item.nom} acquis.` }))
      if (item.codex) get().decouvrir(item.codex)
      get().equiper(itemId)
      return true
    },

    equiper(itemId) {
      const item = shopItemById[itemId]
      if (!item || !get().save.possessions.includes(itemId)) return
      patch((s) => {
        const c = { ...s.cosmetiques }
        if (item.categorie === 'auras') c.aura = item.preset
        if (item.categorie === 'socle') c.socle = item.preset
        if (item.categorie === 'colliers') c.collier = item.preset
        return { ...s, cosmetiques: c }
      })
    },

    definirMeteo(m) {
      patch((s) => ({ ...s, meteo: m }))
    },
    definirReglages(r) {
      patch((s) => ({ ...s, reglages: { ...s.reglages, ...r } }))
    },

    contexte() {
      const { dev } = get().ui
      const periode = dev.periode ?? periodeDominante(heureDecimale())
      const meteo = dev.meteo ?? get().save.meteo?.kind ?? 'inconnu'
      return { periode, meteo }
    },

    devDefinir(o) {
      set((s) => ({ ui: { ...s.ui, dev: { ...s.ui.dev, ...o } } }))
    },
    devNiveau(delta) {
      patch((s) => ({ ...s, joueur: { ...s.joueur, niveau: Math.max(1, Math.min(gameConfig.progression.niveauMax, s.joueur.niveau + delta)), xp: 0 } }))
    },
    devAffinite(a, delta) {
      get().ajouterAffinites({ [a]: delta })
    },
    devRejouerEclosion() {
      patch((s) => ({ ...s, eclosionTerminee: false, creature: { ...s.creature, stage: 'oeuf', fissures: 0, neLe: null } }))
      set((s) => ({ ui: { ...s.ui, panneau: null } }))
    },
    devRecharges() {
      patch((s) => ({ ...s, recharges: { ...s.recharges, appetit: gameConfig.nourrir.appetitMax, dernierJeu: 0, coffres: {} } }))
    },
  }
})

export const selectAffinites = (s: GameStore) => s.save.creature.affinites
export const selectAffinityList = (a: Affinities) => AFFINITIES.map((k) => ({ id: k, valeur: a[k] }))
