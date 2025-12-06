// scripts/verify-config.mjs
import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification de la configuration ASARA Lyon...\n');

const checks = [
  {
    name: 'tailwind.config.ts',
    path: 'tailwind.config.ts',
    condition: () => fs.existsSync('tailwind.config.ts'),
    fix: 'Créez tailwind.config.ts à la racine (voir documentation).',
  },
  {
    name: 'postcss.config.js',
    path: 'postcss.config.js',
    condition: () => fs.existsSync('postcss.config.js'),
    fix: 'Créez postcss.config.js à la racine.',
  },
  {
    name: 'src/app/globals.css',
    path: 'src/app/globals.css',
    condition: () => fs.existsSync('src/app/globals.css'),
    fix: 'Le fichier globals.css est manquant.',
  },
  {
    name: 'LoginForm export',
    path: 'src/components/forms/LoginForm.tsx',
    condition: () => {
      try {
        const content = fs.readFileSync('src/components/forms/LoginForm.tsx', 'utf8');
        return (
          content.includes('export default function LoginForm') ||
          content.includes('export default LoginForm')
        );
      } catch {
        return false;
      }
    },
    fix: 'Assurez-vous que LoginForm est exporté par défaut : `export default function LoginForm(...) { ... }`',
  },
];

let ok = true;
for (const check of checks) {
  if (check.condition()) {
    console.log(`✅ ${check.name}`);
  } else {
    console.error(`❌ ${check.name} — ${check.fix}`);
    ok = false;
  }
}

console.log('\n' + (ok ? '🎉 Configuration valide.' : '⚠️  Corrections nécessaires.'));
process.exit(ok ? 0 : 1);