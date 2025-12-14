import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const referer = request.headers.get('referer') || '';
  const localeMatch = referer.match(/\/(fr|ar)\//);
  const locale = localeMatch?.[1] || 'fr';
  
  // Supprimer le cookie directement
  cookies().delete('token');
  
  // Créer la réponse avec suppression explicite
  const response = NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
  
  // Forcer la suppression via Set-Cookie header
  response.headers.append('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
  
  return response;
}
