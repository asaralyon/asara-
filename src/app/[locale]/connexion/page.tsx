// src/app/[locale]/connexion/page.tsx
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { LoginForm } from '@/components/forms/LoginForm';

// SSR-safe: redirige si déjà authentifié
async function checkAuthAndRedirect(locale: string) {
  const token = cookies().get('token')?.value;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key');
      await jwtVerify(token, secret);
      redirect(`/${locale}/mon-compte`);
    } catch {
      // Token invalide → on laisse la page s'afficher (nettoyage côté client)
    }
  }
}

export default async function LoginPage({ params }: { params: { locale: string } }) {
  await checkAuthAndRedirect(params.locale);

  // ✅ Utilise 'auth.login', conforme à votre fr.json/ar.json
  const t = await getTranslations('auth.login');

  return (
    <div className="container py-12 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      {/* ✅ locale passé en props */}
      <LoginForm locale={params.locale} />

      <div className="mt-6 text-center text-sm">
        <span>{t('noAccount')}</span>{' '}
        <a
          href={`/${params.locale}/adhesion`}
          className="text-blue-600 hover:underline font-medium"
        >
          {t('register')}
        </a>
      </div>
    </div>
  );
}