# Protection des fichiers de développement

## Directives de sécurité du code
- **Modifications chirurgicales uniquement** : Toute modification de `index.html`, `style.css` ou `script.js` doit cibler uniquement les lignes concernées sans altérer le reste du document.
- **Sauvegarde avant opération complexe** : Avant toute refonte ou refactorisation, s'assurer que les fichiers originaux sont archivés ou qu'un point de contrôle existe.
- **Interdiction de suppression de code actif** : Aucun bloc de code (scripts d'effets visuels, terminal, responsive helpers) ne doit être supprimé sans instruction explicite de l'utilisateur.
- **Protection des médias** : Le dossier `assets/` contient les visuels clés du portfolio, ils ne doivent pas être altérés.
- **Sécurité et clés** : Ne jamais intégrer de clés secrètes ou d'identifiants dans le code source.
