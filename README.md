# 🌉 ASARA

**Association des Syriens d'Auvergne Rhône-Alpes**

Plateforme web pour l'annuaire professionnel et la gestion des membres de l'association.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)

---

## ✨ Fonctionnalités

### 🔍 Annuaire public
- Recherche de professionnels par nom, catégorie, ville
- Fiches professionnelles détaillées
- SEO optimisé pour chaque profil

### 👥 Gestion des membres
- Inscription professionnels (100€/an)
- Inscription membres simples (15€/an)
- Espace personnel

### 💳 Paiements
- Intégration Stripe
- Facturation automatique
- Rappels de renouvellement

### 📧 Emails
- Emails transactionnels (Nodemailer)
- Templates personnalisables
- Rappels automatiques

### 🔐 Administration
- Interface admin simplifiée
- Gestion des membres
- Validation des profils

---

## 🛠 Stack technique

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | Framework React (App Router) |
| **TypeScript** | Typage strict |
| **Tailwind CSS** | Styles (mobile-first) |
| **Prisma** | ORM PostgreSQL |
| **Stripe** | Paiements |
| **Nodemailer** | Emails |
| **Jest** | Tests |
| **Husky** | Git hooks |

---

## 🚀 Installation

### Prérequis

- Node.js >= 18.17
- PostgreSQL >= 14
- npm ou pnpm

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/votre-org/asara-lyon.git
cd asara-lyon

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Initialiser la base de données
npm run db:push
npm run db:generate

# 5. Lancer le serveur de dev
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer en production |
| `npm run lint` | Linter ESLint |
| `npm run lint:fix` | Corriger les erreurs de lint |
| `npm run format` | Formater avec Prettier |
| `npm run type-check` | Vérification TypeScript |
| `npm run test` | Lancer les tests |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:coverage` | Couverture de tests |
| `npm run validate` | Lint + Type-check + Tests |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:push` | Push le schema vers la DB |
| `npm run db:migrate` | Migrations Prisma |
| `npm run db:studio` | Interface Prisma Studio |

---

## 📁 Structure du projet

```
asara-lyon/
├── .husky/              # Git hooks
├── __tests__/           # Tests
├── prisma/              # Schema et migrations
├── public/              # Assets statiques
│   ├── images/          # Images
│   ├── icons/           # Icônes PWA
│   └── robots.txt       # SEO
├── src/
│   ├── app/             # Routes Next.js (App Router)
│   │   ├── (public)/    # Pages publiques
│   │   ├── (auth)/      # Pages authentification
│   │   ├── admin/       # Pages admin
│   │   ├── api/         # API routes
│   │   ├── layout.tsx   # Layout racine
│   │   └── page.tsx     # Page d'accueil
│   ├── components/      # Composants React
│   │   ├── ui/          # Composants UI de base
│   │   ├── layout/      # Header, Footer, etc.
│   │   ├── forms/       # Formulaires
│   │   ├── directory/   # Annuaire
│   │   └── admin/       # Admin
│   ├── lib/             # Utilitaires et configs
│   ├── hooks/           # Custom hooks
│   ├── types/           # Types TypeScript
│   ├── utils/           # Fonctions utilitaires
│   └── styles/          # Styles globaux
├── .env.example         # Variables d'env exemple
├── next.config.js       # Config Next.js
├── tailwind.config.ts   # Config Tailwind
├── tsconfig.json        # Config TypeScript
└── package.json
```

---

## 🚢 Déploiement

### Infomaniak VPS

1. **Préparer le VPS**
   ```bash
   # Installer Docker
   # Installer Nginx (reverse proxy)
   # Configurer SSL avec Let's Encrypt
   ```

2. **Variables d'environnement production**
   ```bash
   # Sur le serveur
   nano /opt/asara/.env.production
   ```

3. **Déployer**
   ```bash
   # Build et deploy
   npm run build
   pm2 start npm --name "asara" -- start
   ```

### DNS

Configurer chez Infomaniak :
- `A record` : asara-lyon.fr → IP du VPS
- `CNAME` : www.asara-lyon.fr → asara-lyon.fr

---

## 🎨 Palette de couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| Vert principal | `#2D8C3C` | Actions principales, CTA |
| Bleu accent | `#1E5AA8` | Liens, éléments secondaires |
| Rouge étoiles | `#CE2027` | Alertes, badges importants |
| Blanc | `#FFFFFF` | Fond principal |
| Gris | `#737373` | Texte secondaire |

---

## 📝 Convention de commits

```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage (pas de changement de code)
refactor: Refactoring
test: Ajout de tests
chore: Maintenance
```

---

## 👥 Équipe

- **Développement** : [Votre nom]
- **Association** : ASARA

---

## 📄 Licence

Projet privé - Tous droits réservés © 2024 ASARA
