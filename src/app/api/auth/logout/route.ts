import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  cookies().delete('token');
  
  // Récupérer le locale depuis le referer ou utiliser 'fr' par défaut
  const referer = request.headers.get('referer') || '';
  const localeMatch = referer.match(/\/(fr|ar)\//);
  const locale = localeMatch?.[1] || 'fr';
  
  // Rediriger vers la page d'accueil
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
