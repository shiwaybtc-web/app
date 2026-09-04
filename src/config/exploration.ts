import type { MapPoint } from '@/types/exploration'

/**
 * DEMONSTRATION map. Entirely fictional: no real streets, no real positions.
 * The real-world map will be a separate module fed by geolocation.
 */
export const demoMap = {
  /** Distance (in percent of the map) within which a chest can be opened. */
  porteeInteraction: 14,
  positionDepart: { x: 50, y: 58 },
  points: [
    { id: 'coffre-mousse', kind: 'coffre', x: 34, y: 42, titre: 'Coffre moussu', description: 'Fermé par des lierres.', recompenses: [{ type: 'xp', montant: 30 }, { type: 'aliment', id: 'baie-de-lune', quantite: 2 }] },
    { id: 'coffre-rive', kind: 'coffre', x: 66, y: 72, titre: 'Coffre de la rive', description: 'À moitié dans l’eau.', recompenses: [{ type: 'pieces', montant: 25 }, { type: 'aliment', id: 'goutte-de-source', quantite: 2 }] },
    { id: 'coffre-foudre', kind: 'coffre', x: 78, y: 30, titre: 'Coffre foudroyé', description: 'Encore tiède.', recompenses: [{ type: 'aliment', id: 'eclat-orage', quantite: 1 }, { type: 'xp', montant: 20 }, { type: 'fragment', id: 'obj-fragment-aube' }] },
    { id: 'lieu-arche', kind: 'lieu', x: 20, y: 60, titre: 'Arche des lierres', description: 'Une arche ancienne couverte de lierre.', affinite: 'sylvestre', codex: 'lieu-arche' },
    { id: 'lieu-cascade', kind: 'lieu', x: 58, y: 24, titre: 'Cascade jumelle', description: 'Deux chutes qui chantent ensemble.', affinite: 'aquatique', codex: 'lieu-cascade' },
    { id: 'lieu-tour', kind: 'lieu', x: 50, y: 40, titre: 'Tour du lac', description: 'Une tour solitaire au milieu des eaux.', affinite: 'nocturne', codex: 'lieu-tour' },
    { id: 'lieu-bosquet', kind: 'lieu', x: 30, y: 78, titre: 'Bosquet d’argent', description: 'Les feuilles y brillent à la lune.', affinite: 'sylvestre', codex: 'lieu-bosquet' },
    { id: 'lieu-pont', kind: 'lieu', x: 82, y: 56, titre: 'Pont des brumes', description: 'On n’en voit jamais l’autre bout.', affinite: 'solaire', codex: 'lieu-pont' },
    { id: 'evenement-aurore', kind: 'evenement', x: 44, y: 14, titre: 'Aurore de cristal', description: 'Événement à venir. Les événements réels seront liés à la météo et au calendrier.' },
    { id: 'presence-1', kind: 'presence', x: 88, y: 80, titre: 'Présence', description: 'Un autre Nexa, quelque part.' },
  ] as MapPoint[],
}
