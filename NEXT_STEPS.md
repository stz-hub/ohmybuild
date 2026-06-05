# NEXT_STEPS — ce qu'il te reste à faire (Windows + Neon réel)

> Adapté à ta situation : Windows 11 + projet Neon `neon-bronze-prism` (région `eu-central-1`, DB `neondb`).
>
> ⚠️ Ne commit **jamais** ton mot de passe Neon. Les fichiers ci-dessous (`.env.local`) sont déjà ignorés par git via `.gitignore`.

---

## Où tu en es

- ✅ `npm install` fait (591 packages, husky branché).
- ✅ Projet Neon créé : `neon-bronze-prism` / branche `main` / DB `neondb`.
- ⏭ À faire : `.env.local`, migrations, seed, test local, commits, push, Vercel.

---

## 1. Créer `.env.local` (PowerShell)

Dans PowerShell, à la racine `C:\Users\lvmealone\Downloads\ohmybuild-clean` :

```powershell
# (a) Copier le template
Copy-Item .env.example .env.local

# (b) Générer un NEXTAUTH_SECRET propre
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
# -> copie la chaîne affichée
```

Puis ouvre `.env.local` dans VS Code (ou bloc-notes) et remplis :

```env
# Colle ici l'URL complète Neon (avec le password réel, jamais le placeholder)
DATABASE_URL="postgresql://neondb_owner:<TON_PASSWORD>@ep-dry-sky-alkeeg0v-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Colle ici la sortie de la commande PowerShell ci-dessus
NEXTAUTH_SECRET="<chaîne base64 de 32 octets>"

NEXTAUTH_URL="http://localhost:3000"
```

> Si tu préfères : https://generate-secret.vercel.app/32 marche aussi pour le secret.

---

## 2. Initialiser la base de données

```powershell
# Génère le client Prisma typé
npx prisma generate

# Crée la 1re migration et l'applique sur ton Neon (la branche main sera unarchivée auto)
npx prisma migrate dev --name init

# Crée le compte demo@demo.local / Demo1234! + 2 builds
npm run db:seed
```

Si tu veux vérifier visuellement : `npx prisma studio` → http://localhost:5555, tu dois voir 1 user et 2 builds.

---

## 3. Lancer en local et faire le test end-to-end

```powershell
npm run dev
```

Ouvre http://localhost:3000 et fais ce parcours :

1. **S'inscrire** → crée un compte avec un mail neuf.
2. Va dans **Configurateur** → sélectionne quelques composants.
3. Clique **Sauvegarder ma config** (côté droit, bouton vert) → entre un nom.
4. Va dans **Mes configs** → ta config doit apparaître.
5. Clique **Ouvrir dans le configurateur** → la sélection se recharge.
6. Clique **Supprimer** → elle disparaît.
7. Clique **Déconnexion** dans la navbar.
8. **Se connecter** avec `demo@demo.local` / `Demo1234!` → tu dois voir les 2 builds créés par le seed.
9. Ouvre http://localhost:3000/api/health → tu dois voir `{"ok":true,...}`.

Si une étape coince, ping-moi avec le message d'erreur exact (console navigateur ou terminal).

---

## 4. Vérifier les checks locaux

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

**Tout doit être vert** avant de pusher. Si une étape échoue, dis-moi.

---

## 5. Vulnérabilités npm

Le `npm install` a remonté 7 vulnérabilités (5 moderate, 1 high, 1 critical). Lance d'abord :

```powershell
npm audit fix
```

(sans `--force`). Si une critical reste, fais `npm audit` et partage-moi la sortie. La plupart du temps c'est dans des transitives qui n'affectent pas la prod.

---

## 6. Mettre l'historique Git en ordre

Tu es probablement sur la branche `feature/git-flow-setup` (ou `dev`) avec ~60 fichiers en attente. On découpe en commits atomiques :

```powershell
# (a) Vérifie sur quelle branche tu es
git branch --show-current

# Si tu n'es pas sur feature/git-flow-setup :
git checkout -b feature/full-stack-conversion dev 2>$null
# (le 2>$null avale l'erreur si la branche existe déjà)

# (b) Reset propre — on va re-stager par lots logiques
git reset

# (c) Phase A — outillage Git Flow + CI scaffolding
git add .editorconfig .nvmrc .npmrc .env.example .gitleaks.toml `
        commitlint.config.cjs .husky/ `
        .github/pull_request_template.md .github/CODEOWNERS
git commit -m "chore(tooling): add Git Flow scaffolding (editorconfig, husky, commitlint, gitleaks, PR template)"

# (d) Phase B — doc et headers de sécurité
git add README.md LICENSE docs/ next.config.mjs .gitignore
git commit -m "docs: rewrite README + add architecture, API, DB and deployment docs

- README avec spécifications, parcours, Mermaid, choix techniques, env vars
- docs/ARCHITECTURE.md, docs/API.md, docs/DB.md, docs/DEPLOYMENT.md
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) dans next.config.mjs"

# (e) Phase C — backend + schémas + tests
git add package.json package-lock.json prisma/ `
        lib/prisma.ts lib/errors.ts lib/schemas.ts lib/rate-limit.ts `
        lib/repositories/ lib/services/ lib/pc-data.ts `
        auth.ts types/ middleware.ts `
        app/api/ vitest.config.ts tests/
git commit -m "feat(api): add NextAuth + Prisma + builds CRUD with Zod validation

- Schéma Prisma (User, Account, Session, Build) + seed démo
- Auth credentials avec bcrypt cost 12 + JWT NextAuth v5
- Endpoints /api/auth/register, /api/builds, /api/builds/[id], /api/health
- Validation Zod, hiérarchie d'erreurs métier, rate limit Upstash/mémoire
- Service layer + repository pour séparation lecture/écriture
- Tests Vitest sur lib/pc-data et lib/schemas"

# (f) Phase D — pages auth + mes-configs + bouton save
git add 'app/(auth)/' app/mes-configs/ app/layout.tsx app/configurateur/page.tsx `
        components/auth/ components/builds/ components/navbar/ `
        components/pc-builder/pc-builder.tsx components/pc-builder/save-build-button.tsx
git commit -m "feat(ui): add login/register/mes-configs pages and save-build flow

- Pages /login et /register avec auto-login après inscription
- Page /mes-configs liste les builds avec suppression
- Bouton Sauvegarder ma config (POST ou PUT) dans le configurateur
- Navbar avec user menu et déconnexion
- Chargement d'une config sauvegardée via ?build=ID"

# (g) Phase E — CI/CD
git add .github/workflows/ eslint.config.mjs
git commit -m "ci: add GitHub Actions workflow (lint, typecheck, test, build, gitleaks)"

# (h) Phase F — instructions de mise en route
git add NEXT_STEPS.md
git commit -m "docs: add NEXT_STEPS bootstrap guide"

# (i) Vérifie l'état final
git status                # devrait être clean
git log --oneline | Select-Object -First 10
```

> Si une `git add` échoue (fichier renommé, dossier absent) : `git status` te dira lesquels. Adapte les chemins.

---

## 7. Pousser sur GitHub

```powershell
# Bascule sur dev et merge ton feature
git checkout dev
git merge feature/full-stack-conversion --no-ff
git push -u origin dev

# Garde main intact (la prod) — on y mergera via PR plus tard.
```

### 7.1 GitHub Settings → General → Default branch

Mets `dev` en branche par défaut. Les futurs PR cibleront `dev`.

### 7.2 GitHub Settings → Branches → Branch protection rules

Crée 2 règles. **Sur `main` ET `dev`** :

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - status checks requis : `CI / Lint • Typecheck • Test • Build` et `CI / Secrets scan (gitleaks)`
  - ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ❌ Allow force pushes
- ❌ Allow deletions

### 7.3 Settings → Code security and analysis

- ✅ Dependabot alerts
- ✅ Secret scanning

### 7.4 About du repo → Website

À mettre quand tu auras l'URL Vercel (étape 8).

---

## 8. Déployer sur Vercel

Tu as déjà un compte Vercel lié à `situzy2-6653's projects`. Le tab `PC configurator - v0 by Vercel` que tu vois est probablement un prototype v0 — laisse-le tranquille, on crée un **nouveau** projet.

1. https://vercel.com/new → importer `stz-hub/ohmybuild`.
2. Framework Preset : Next.js (auto).
3. **Build Command** : `npm run db:migrate:deploy && npm run build`
4. **Install Command** : `npm install` (auto)
5. **Environment Variables** — ajouter pour chaque environnement :

   | Nom                | Valeur (Production)                                    | Valeur (Preview)                          |
   | ------------------ | ------------------------------------------------------ | ----------------------------------------- |
   | `DATABASE_URL`     | URL Neon **main** (la même que ton `.env.local`)       | URL Neon **branche dev** (à créer)        |
   | `NEXTAUTH_SECRET`  | nouvelle chaîne base64 de 32 octets (différente du local) | la même que prod c'est OK pour démo       |
   | `NEXTAUTH_URL`     | `https://<ton-projet>.vercel.app` (URL que Vercel te donne) | _(laisse vide — Vercel injecte VERCEL_URL)_ |

   > Pour créer la branche Neon `dev` : Neon → Branches → Create branch → from `main` → copie l'URL pooled.

6. **Deploy** → attendre ~2-3 min.
7. Si Vercel échoue sur la migration : passe `DATABASE_URL` à l'URL **non-pooled** Neon (sans `-pooler` dans le hostname). Le pooler ne supporte pas certaines opérations DDL.
8. Mets l'URL Vercel finale dans :
   - `README.md` section « Démo en ligne » (remplace `https://ohmybuild.vercel.app`)
   - le champ **Website** du repo GitHub

### 8.1 Tests post-déploiement

- https://securityheaders.com/?q=https://`<ton-domaine>.vercel.app` → cible note A grâce aux headers.
- https://www.ssllabs.com/ssltest/analyze.html?d=`<ton-domaine>.vercel.app` → cible note A.
- Ouvre l'URL en navigation privée, refais le parcours user complet.

---

## 9. PR `dev` → `main` (premier cycle prod)

```powershell
# Sur GitHub, ouvre une PR : compare main ← dev
# Une fois la CI verte et que tu as relu, merge.
```

Ça déclenchera ton premier déploiement **production** automatique sur Vercel.

---

## 10. Question : email Neon/Vercel ≠ email GitHub ?

**Pas un problème.** Les services se lient par OAuth, pas par email. Ce qui compte :

- L'email **auteur des commits Git** sera vu par ton prof. Vérifie :

  ```powershell
  git config user.email
  ```

  Si ce n'est pas ton email étudiant Oteria, change-le :

  ```powershell
  git config user.email "ton.email@oteria.fr"
  git config user.name "Ton Nom"
  ```

  Note : ça n'affecte que les **futurs** commits. Si tu veux réécrire les commits existants au bon email, on peut le faire avec `git rebase` interactif.

---

## En cas de problème

- **Prisma migrate refuse Neon** : utilise l'URL **non-pooled** (sans `-pooler` dans le hostname Neon) pour `migrate dev` ; remets le pooler pour le runtime.
- **Erreur ESM/CJS au build** : `npm run build` te dira lequel. La cause la plus probable est un import client dans un fichier serveur (ou inverse).
- **`useSession` crash** : assure-toi que `<AuthSessionProvider>` est bien dans `app/layout.tsx` (déjà fait).
- **CI gitleaks rouge** : vérifie qu'aucun vrai secret n'est dans le code. Le `.gitleaks.toml` autorise les valeurs placeholder de `.env.example`.

---

## Récap gains XP cible

| Bloc                              | Avant | Après |
| --------------------------------- | ----- | ----- |
| 1. Cadrage & conception (15)      | 0     | 15    |
| 2. Frontend (25)                  | 25    | 25    |
| 3. Backend (30)                   | 0     | 28–30 |
| 4. Base de données (15)           | 0     | 13–15 |
| 5. Sécurité (25)                  | 2     | 18–22 |
| 6. Déploiement & infra (15)       | 0     | 13–15 |
| 7. Qualité du code & doc (25)     | 16    | 22–25 |
| 8. Ambition technique (10)        | 5     | 7–9   |
| **Total**                         | **48** | **141–156** |
