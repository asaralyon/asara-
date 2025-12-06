// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Routes publiques — ne nécessitent pas d’auth
const publicPaths = [
  'connexion',
  'inscription',
  '/mot-de-passe-oublie',
  '/confirmation',
  // Ajoutez d'autres routes publiques si besoin
];

// Routes réservées aux admins
const adminPaths = ['admin'];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1️⃣ Exclure les routes API & statiques (comme avant)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Appliquer d'abord l'internationalisation
  const intlResponse = intlMiddleware(request);
  // ⚠️ Important : on doit cloner l’URL après intlMiddleware car le préfixe locale est ajouté
  const url = new URL(intlResponse.headers.get('x-middleware-rewrite') || request.url);
  const finalPathname = url.pathname; // ex: /fr/connexion, /ar/mon-compte

  // 3️⃣ Extraire le locale et le "reste" du chemin
  const localeMatch = finalPathname.match(/^\/([a-z]{2})\/(.*)/);
  const currentLocale = localeMatch?.[1] || defaultLocale;
  const pathWithoutLocale = localeMatch?.[2] || finalPathname.substring(1); // "connexion", "mon-compte", etc.

  // 4️⃣ Vérifier le token (si présent)
  const token = request.cookies.get('token')?.value;
  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key');
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch {
      // Token invalide → on l’efface
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // 5️⃣ Règles de redirection

  // ➤ Si connecté ET sur une page publique (ex: /connexion) → rediriger vers /mon-compte
  const isPublicPage = publicPaths.some((p) => pathWithoutLocale.startsWith(p));
  if (user && isPublicPage) {
    return NextResponse.redirect(new URL(`/${currentLocale}/mon-compte`, request.url));
  }

  // ➤ Si non connecté ET tente d’accéder à une page privée → rediriger vers /connexion
  const isPrivatePage =
    !isPublicPage &&
    !adminPaths.some((p) => pathWithoutLocale.startsWith(p)) &&
    pathWithoutLocale !== '' && // racine = landing page = publique
    pathWithoutLocale !== 'mentions-legales' &&
    pathWithoutLocale !== 'politique-confidentialite' &&
    !pathWithoutLocale.startsWith('actualites');

  if (!user && isPrivatePage && !adminPaths.some((p) => pathWithoutLocale.startsWith(p))) {
    // Rediriger vers /connexion avec returnTo
    const url = new URL(`/${currentLocale}/connexion`, request.url);
    url.searchParams.set('returnTo', finalPathname);
    return NextResponse.redirect(url);
  }

  // ➤ Admin : accès restreint
  if (user && adminPaths.some((p) => pathWithoutLocale.startsWith(p))) {
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }
  }

  // ➤ Si non connecté sur /admin → rediriger vers login
  if (!user && adminPaths.some((p) => pathWithoutLocale.startsWith(p))) {
    const url = new URL(`/${currentLocale}/connexion`, request.url);
    url.searchParams.set('returnTo', finalPathname);
    return NextResponse.redirect(url);
  }

  // ✅ Sinon, laisser passer
  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|images|uploads|.*\\..*).*)',
  ],
};