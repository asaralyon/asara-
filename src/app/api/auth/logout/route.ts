import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const referer = request.headers.get('referer') || '';
  const localeMatch = referer.match(/\/(fr|ar)\//);
  const locale = localeMatch?.[1] || 'fr';
  
  // Créer la réponse de redirection
  const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
  
  // Supprimer le cookie EN L'ATTACHANT À LA RÉPONSE
  // Cookie avec domain (pour www.asara-lyon.fr et asara-lyon.fr)
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    domain: '.asara-lyon.fr',
  });
  
  // Aussi supprimer sans domain (pour Vercel preview URLs et localhost)
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}
