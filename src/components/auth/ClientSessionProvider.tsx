// components/auth/ClientSessionProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function ClientSessionProvider({ children, user }: { children: React.ReactNode; user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirection immédiate si connecté mais sur /connexion
    if (user && (pathname.endsWith('/connexion') || pathname.endsWith('/inscription'))) {
      const locale = pathname.split('/')[1] || 'fr';
      router.replace(`/${locale}/mon-compte`);
    }

    // Optionnel : refresh la page si /mon-compte mais pas connecté → laisse le middleware gérer
  }, [user, pathname, router]);

  // Vous pouvez aussi exposer un hook plus tard si besoin
  return <>{children}</>;
}