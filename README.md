# NEXA — prototype V1

Un jeu où chaque joueur possède une créature unique, posée sur le socle d’un sanctuaire, et dont l’histoire dépend de sa manière de jouer, de l’heure réelle et de la météo.

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand. Interface entièrement en français.

## Lancer le jeu

```bash
npm install
npm run dev        # http://localhost:5173 (panneau Développement visible)
npm run build      # vérification TypeScript + build de production dans dist/
npm run preview    # sert le build de production (sans panneau Développement)
```

## Ce qui fonctionne réellement

- **Introduction** : vallée animée (vidéo), logo, « Entrer », fondu lumineux vers le sanctuaire avec avancée de caméra.
- **Socle** : cadrage « focus cover » qui garde le socle à l’écran sur tout format ; ombre de contact, reflet, aura, lumière vivante sur la dalle.
- **Œuf et éclosion** : respiration, lumières intérieures, fissures progressives (3 touches), vibration, éclat, naissance, choix du nom.
- **Créature bébé (2.5D)** : respiration, balancement, clignement des yeux, aura, lueurs des cristaux, étincelles, réaction au toucher, réaction à l’XP, animation de niveau supérieur.
- **Heure réelle** : aube / jour / crépuscule / nuit avec transitions progressives d’une heure ; teintes des cristaux, aura et ambiance changent, pas la couleur du corps.
- **Météo réelle** : Open-Meteo (sans clé) après consentement de géolocalisation ; coordonnées arrondies au kilomètre, jamais conservées. Effets : pluie, neige, éclairs d’orage, reflets dorés, givre, chaleur.
- **Progression** : XP, niveaux, éclats (monnaie), journal, sauvegarde locale.
- **Affinités** : cinq valeurs cachées ; les choix (aliments, lieux) pèsent trois fois plus que l’ambiance (météo, heure).
- **Nourrir** : cinq aliments, appétit à trois crans qui se régénère, ration quotidienne, animation de l’aliment vers la créature.
- **Jouer** : mini-jeu « Lueurs » de 20 s, récompense complète toutes les 8 min puis réduite, chance de trouver un aliment, « Multiplier ×2 » via publicité **simulée**.
- **Évolution** : affinité dominante « ??? » avec pourcentage, tendances, indices révélés par paliers de niveau (symboles → nom → silhouette → voile → révélation) à partir de la planche fournie.
- **Explorer** : carte de **démonstration** (fictive, clairement indiquée), déplacement, coffres à mini-jeu du sceau avec recharge, lieux à découvrir, événements/présences marqués « fonctionnalité future ».
- **Codex** : 40 entrées en six catégories, silhouettes pour l’inconnu, compteur global.
- **Boutique** : auras et décorations du socle achetables avec les éclats gagnés et réellement appliquées ; articles premium marqués « Bientôt ».
- **Réglages** : ambiance sonore (architecture prête, aucun fichier audio fourni), météo réelle, réinitialisation.
- **Mode développement** : bouton « Développement » en bas à gauche (uniquement en `npm run dev`) : période, météo, niveau, XP, affinités, recharges, rejouer l’éclosion, effacer la sauvegarde.

## Ce qui est simulé

- La publicité récompensée (compte à rebours de 5 s, aucun réseau publicitaire).
- La carte d’exploration (aucune vraie rue ni position).
- Les événements et « présences » sur la carte.

## Ce qui reste à construire

- Modèle 3D `.glb` de la créature et ses animations (contrat prêt dans `src/creature/animations.ts`, composant `CreatureModel.tsx`).
- Carte réelle géolocalisée, coffres réels (types dans `src/types/exploration.ts`).
- Système social : amis, visites, jumelage, missions communes (types dans `src/types/social.ts`, service à implémenter).
- Activités du monde réel, colliers/ornements/environnements, paiements réels, figurine 3D.
- Sauvegarde distante (`RemoteStorageAdapter` dans `src/services/storage.ts`).
- Fichiers audio d’ambiance (`public/assets/audio/`).

## Où modifier

| Quoi | Où |
| --- | --- |
| Fichiers image / vidéo, position du socle, ancrages des cristaux et des yeux | `src/config/assets.ts` et `public/assets/` |
| Textes (tout est en français) | `src/config/texts.ts` |
| XP, niveaux, appétit, recharges, météo, publicité | `src/config/game.ts` |
| Affinités, couleurs, symboles, paliers de révélation, météo → affinité | `src/config/evolution.ts` |
| Aliments | `src/config/foods.ts` |
| Boutique et presets d’aura | `src/config/shop.ts` |
| Codex | `src/config/codex.ts` |
| Carte de démonstration | `src/config/exploration.ts` |
| Palette, polices | `tailwind.config.js`, `src/index.css` |

### Remplacer la créature par un modèle 3D

1. Déposer `baby.glb` dans `public/assets/creature/`.
2. Dans `src/config/assets.ts`, renseigner `creature.bebe.model` et passer `kind` à `'model'`.
3. Implémenter `src/creature/CreatureModel.tsx` avec React Three Fiber (les noms de clips attendus sont dans `src/creature/animations.ts`).

## Structure

```
src/
  config/      assets, game, evolution, foods, shop, codex, exploration, texts
  types/       creature, game, world, exploration, social, shop
  services/    storage (adaptateurs), clock, weather (Open-Meteo), geolocation
  game/        store (zustand), progression, affinities, save
  world/       SceneContext (cadrage du socle), WorldScene, AmbientLayers, WeatherEffects, hooks
  creature/    Egg, CreatureSprite, CreatureView, CreatureModel (stub), HatchSequence, SocleDecor
  screens/     Intro, Home, FeedTray, Play, Explore, Evolution, Codex, Shop, Social, Settings, Journal, Menu
  components/  TopBar, ActionBar, Cursor, ParticleLayer, Logo, ui/
  audio/       AmbientAudio (couches eau, vent, forêt, musique)
  dev/         DevPanel (développement uniquement)
```

## Assets fournis et intégrés

- `public/assets/world/nexa-sanctuaire.jpg` — décor 16:9 avec socle (image fournie).
- `public/assets/world/nexa-vallee.{webm,mp4}` — vidéo fournie, utilisée pour l’introduction.
- `public/assets/creature/oeuf.png`, `bebe.png` — œuf et créature fournis, détourés (fond retiré) pour être posés sur le socle.
- `public/assets/evolution/planche-evolutions.jpg` et `branche-*.jpg` — planche des cinq voies fournie, découpée par branche.

Sauvegarde locale : clé `nexa.save.v1` (localStorage), migrations dans `src/game/save.ts`.
