# Directives et Règles de Protection du Projet (GEMINI.md)

Ce fichier définit les règles obligatoires et strictes pour tout agent IA (Antigravity / Gemini) ou développeur intervenant sur ce projet (`siteOne`).

---

## 1. Protection contre l'Écrasement et les Remplacements Destructifs
- **Édition ciblée obligatoire** : Ne JAMAIS écraser l'intégralité d'un fichier existant (`index.html`, `style.css`, `script.js`) pour y apporter de simples modifications, ajouts ou corrections de bugs.
- **Privilégier les outils d'édition par morceaux** (`replace_file_content` / `multi_replace_file_content`) plutôt que de réécrire le fichier complet.
- **Interdiction du wipe** : Ne jamais vider un fichier ou en supprimer de larges pans sans accord formel de l'utilisateur.

## 2. Préservation de l'Existant et Non-Régression
- **Conservation des fonctionnalités** : Les composants interactifs existants (animation Canvas, terminal HUD interactif, filtres de projets, navigation responsive, effets sonores/visuels) doivent impérativement être conservés et protégés.
- **Conservation des styles et design tokens** : Respecter les variables CSS de la palette cyberpunk/néon (`--neon-cyan`, `--neon-purple`, etc.) et la typographie (`Space Grotesk`, `JetBrains Mono`, `Inter`).
- **Préservation des métadonnées** : Les balises `<meta>`, balises SEO, OpenGraph, liens vers les polices et scripts CDN ne doivent pas être altérés ou supprimés sans instruction explicite.
- **Préservation des commentaires** : Conserver l'ensemble des commentaires techniques et structurants du code.

## 3. Protection du Répertoire Médias (`assets/`)
- Les images et ressources présentes dans `assets/` (`avatar.jpg`, `project-*.jpg`) sont des éléments de production.
- **Interdiction absolue de les supprimer, renommer ou écraser** sans validation explicite de l'utilisateur.

## 4. Restriction sur les Commandes Destructives
- **Commandes terminal à haut risque interdites sans confirmation** :
  - `Remove-Item -Recurse -Force`
  - `rm -rf`
  - Tout script ou commande supprimant des fichiers source, des dossiers ou des archives.
- Toujours demander confirmation avant toute opération irréversible.

## 5. Politique de Sauvegarde Avant Refactorisation Majeure
- Avant toute intervention majeure ou restructuration profonde du site :
  - Créer préalablement une copie de sauvegarde des fichiers impactés (ex: dans un dossier `backups/` ou sous forme d'archives datées).
  - Un script PowerShell d'instantané de secours est disponible dans `scripts/backup.ps1`.

## 6. Sécurité et Confidentialité des Données
- Aucun mot de passe, token API, clé privée SSH/PGP ou secret ne doit jamais être commité ou écrit en clair dans le code client (HTML/CSS/JS).
- Utiliser systématiquement des variables d'environnement (`.env`) ou des mocks locaux isolés pour les tests.
