export type CodexCategory = 'creatures' | 'formes' | 'mutations' | 'objets' | 'accessoires' | 'decouvertes'

export type CodexEntry = {
  id: string
  categorie: CodexCategory
  nom: string
  indice: string
  /** Optional image shown when discovered (silhouette otherwise). */
  image?: string
  /** Silhouette shape used while undiscovered. */
  silhouette: 'creature' | 'oeuf' | 'objet' | 'lieu' | 'aura' | 'fragment'
}

export const codexEntries: CodexEntry[] = [
  // Créatures
  { id: 'crea-oeuf', categorie: 'creatures', nom: 'Œuf de Nexa', indice: 'Tout commence par une lumière intérieure.', silhouette: 'oeuf', image: '/assets/creature/oeuf.png' },
  { id: 'crea-bebe', categorie: 'creatures', nom: 'Nexa nouveau-né', indice: 'Blanc d’ivoire, cristaux d’améthyste.', silhouette: 'creature', image: '/assets/creature/bebe.png' },
  { id: 'crea-partage', categorie: 'creatures', nom: 'Nexa d’union', indice: 'Né de deux histoires.', silhouette: 'oeuf' },
  // Formes
  { id: 'forme-solaire', categorie: 'formes', nom: 'Forme solaire', indice: 'Elle porte la lumière du matin.', silhouette: 'creature', image: '/assets/evolution/branche-solaire.jpg' },
  { id: 'forme-aquatique', categorie: 'formes', nom: 'Forme aquatique', indice: 'Elle épouse le courant.', silhouette: 'creature', image: '/assets/evolution/branche-aquatique.jpg' },
  { id: 'forme-nocturne', categorie: 'formes', nom: 'Forme nocturne', indice: 'Elle veille quand tout dort.', silhouette: 'creature', image: '/assets/evolution/branche-nocturne.jpg' },
  { id: 'forme-sylvestre', categorie: 'formes', nom: 'Forme sylvestre', indice: 'Elle grandit avec la forêt.', silhouette: 'creature', image: '/assets/evolution/branche-sylvestre.jpg' },
  { id: 'forme-fulgurante', categorie: 'formes', nom: 'Forme fulgurante', indice: 'Elle court plus vite que l’orage.', silhouette: 'creature', image: '/assets/evolution/branche-fulgurante.jpg' },
  // Mutations
  { id: 'mut-givre', categorie: 'mutations', nom: 'Givre', indice: 'Apparaît après de longs hivers.', silhouette: 'fragment' },
  { id: 'mut-braise', categorie: 'mutations', nom: 'Braise', indice: 'Les fortes chaleurs laissent une trace.', silhouette: 'fragment' },
  { id: 'mut-eclipse', categorie: 'mutations', nom: 'Éclipse', indice: 'Une nuit particulière.', silhouette: 'fragment' },
  { id: 'mut-rosee', categorie: 'mutations', nom: 'Rosée', indice: 'Les aubes pluvieuses.', silhouette: 'fragment' },
  { id: 'mut-jumelle', categorie: 'mutations', nom: 'Jumelle', indice: 'Naît d’un jumelage.', silhouette: 'fragment' },
  { id: 'mut-astrale', categorie: 'mutations', nom: 'Astrale', indice: 'Sous un ciel sans nuages.', silhouette: 'fragment' },
  // Objets
  { id: 'obj-baie-de-lune', categorie: 'objets', nom: 'Baie de lune', indice: 'Se cueille au crépuscule.', silhouette: 'objet' },
  { id: 'obj-nectar-solaire', categorie: 'objets', nom: 'Nectar solaire', indice: 'Tiède comme un matin.', silhouette: 'objet' },
  { id: 'obj-feuille-argentee', categorie: 'objets', nom: 'Feuille argentée', indice: 'De l’arbre ancien.', silhouette: 'objet' },
  { id: 'obj-goutte-de-source', categorie: 'objets', nom: 'Goutte de source', indice: 'Des cascades du sanctuaire.', silhouette: 'objet' },
  { id: 'obj-eclat-orage', categorie: 'objets', nom: 'Éclat d’orage', indice: 'Se trouve dans les coffres.', silhouette: 'objet' },
  { id: 'obj-fragment-aube', categorie: 'objets', nom: 'Fragment d’aube', indice: 'Un morceau de lumière figée.', silhouette: 'fragment' },
  { id: 'obj-fragment-lune', categorie: 'objets', nom: 'Fragment de lune', indice: 'Froid et léger.', silhouette: 'fragment' },
  { id: 'obj-fragment-source', categorie: 'objets', nom: 'Fragment de source', indice: 'Toujours humide.', silhouette: 'fragment' },
  // Accessoires
  { id: 'acc-aura-ivoire', categorie: 'accessoires', nom: 'Aura d’ivoire', indice: 'Offerte à la naissance.', silhouette: 'aura' },
  { id: 'acc-aura-amethyste', categorie: 'accessoires', nom: 'Aura d’améthyste', indice: 'Disponible à la boutique.', silhouette: 'aura' },
  { id: 'acc-aura-aurore', categorie: 'accessoires', nom: 'Aura d’aurore', indice: 'Disponible à la boutique.', silhouette: 'aura' },
  { id: 'acc-aura-abysse', categorie: 'accessoires', nom: 'Aura d’abysse', indice: 'Disponible à la boutique.', silhouette: 'aura' },
  { id: 'acc-socle-runique', categorie: 'accessoires', nom: 'Cercle runique', indice: 'Disponible à la boutique.', silhouette: 'aura' },
  { id: 'acc-socle-lueurs', categorie: 'accessoires', nom: 'Lueurs flottantes', indice: 'Disponible à la boutique.', silhouette: 'aura' },
  { id: 'acc-collier-lune', categorie: 'accessoires', nom: 'Collier de lune', indice: 'Bientôt.', silhouette: 'objet' },
  { id: 'acc-ornement-celeste', categorie: 'accessoires', nom: 'Ornement céleste', indice: 'Bientôt.', silhouette: 'objet' },
  // Découvertes
  { id: 'lieu-arche', categorie: 'decouvertes', nom: 'Arche des lierres', indice: 'À l’ouest du sanctuaire.', silhouette: 'lieu' },
  { id: 'lieu-cascade', categorie: 'decouvertes', nom: 'Cascade jumelle', indice: 'On l’entend avant de la voir.', silhouette: 'lieu' },
  { id: 'lieu-tour', categorie: 'decouvertes', nom: 'Tour du lac', indice: 'Sur l’île, au centre des eaux.', silhouette: 'lieu' },
  { id: 'lieu-bosquet', categorie: 'decouvertes', nom: 'Bosquet d’argent', indice: 'Les feuilles y brillent.', silhouette: 'lieu' },
  { id: 'lieu-pont', categorie: 'decouvertes', nom: 'Pont des brumes', indice: 'Il relie deux rives.', silhouette: 'lieu' },
  { id: 'lieu-citadelle', categorie: 'decouvertes', nom: 'Citadelle blanche', indice: 'Au loin, sur la montagne.', silhouette: 'lieu' },
  { id: 'lieu-source', categorie: 'decouvertes', nom: 'Source cachée', indice: 'Derrière les rochers.', silhouette: 'lieu' },
  { id: 'lieu-observatoire', categorie: 'decouvertes', nom: 'Observatoire des lunes', indice: 'Visible seulement la nuit.', silhouette: 'lieu' },
]

export const codexById = Object.fromEntries(codexEntries.map((e) => [e.id, e])) as Record<string, CodexEntry>
