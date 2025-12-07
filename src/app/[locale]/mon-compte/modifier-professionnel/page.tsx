// src/app/[locale]/mon-compte/modifier-professionnel/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getTranslations } from 'next-intl/server';
import EditProfessionalForm from '@/components/forms/EditProfessionalForm';

export default async function EditProfessionalPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  // 🔐 SSR-safe: vérification du token côté serveur
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect(`/${locale}/connexion`);
  }

  let user;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key');
    const { payload } = await jwtVerify(token, secret);
    // Récupère les données complètes
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('User fetch failed');
    const data = await res.json();
    user = data;
  } catch {
    redirect(`/${locale}/connexion`);
  }

  // Vérifier que l'utilisateur est un professionnel
  if (user.role !== 'PROFESSIONAL') {
    redirect(`/${locale}/mon-compte`);
  }

  const t = await getTranslations({ locale, namespace: 'account' });
  const isRTL = locale === 'ar';

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} className="bg-gradient-to-b from-primary-50 to-white">
      <section className="section min-h-screen py-12">
        <div className="container-app max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{t('editProfessionalInfo')}</h1>
          </div>

          <div className="card">
            <EditProfessionalForm user={user} locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
