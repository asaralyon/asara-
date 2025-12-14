import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Supprimer le cookie avec le bon domaine
  cookies().set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    domain: '.asara-lyon.fr',
  });
  
  // Aussi supprimer sans domaine (pour localhost/dev)
  cookies().delete('token');
  
  const referer = request.headers.get('referer') || '';
  const localeMatch = referer.match(/\/(fr|ar)\//);
  const locale = localeMatch?.[1] || 'fr';
  
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
