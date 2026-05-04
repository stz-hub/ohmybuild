# OhMyBuild

Configurateur PC avec vérification de compatibilité, FPS benchmarkés et prix Idealo.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

## Lancer en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Structure

```
ohmybuild/
├── app/
│   ├── layout.tsx              # Layout global + Navbar
│   ├── page.tsx                # Page d'accueil
│   └── configurateur/page.tsx  # Page configurateur
├── components/
│   ├── navbar/navbar.tsx
│   ├── home/home-page.tsx
│   └── pc-builder/
│       ├── pc-builder.tsx       # État et logique
│       ├── preset-cards.tsx
│       ├── component-group.tsx
│       ├── component-card.tsx
│       ├── fps-display.tsx
│       └── summary-sidebar.tsx
└── lib/
    ├── pc-data.ts  # Catalogue complet + moteur de compatibilité
    └── utils.ts
```

## Modifier le catalogue

Tout est dans `lib/pc-data.ts`. Pour ajouter un composant, copier une ligne
existante dans la section correspondante (CPUS, GPUS, etc.) et modifier les valeurs.

## Pusher sur GitHub et déployer

```bash
git init
git add .
git commit -m "init — OhMyBuild"
git remote add origin https://github.com/stz-hub/ohmybuild.git
git branch -M main
git push -u origin main
```

Ensuite : vercel.com → "Add New Project" → importer le repo → Deploy.
