// src/app/[locale]/mon-compte/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getTranslations } from 'next-intl/server';

export default async function AccountPage({ params }: { params: { locale: string } }) {
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
    user = await res.json();
  } catch {
    redirect(`/${locale}/connexion`);
  }

  // ✅ Traductions
  const t = await getTranslations({ locale, namespace: 'account' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isRTL = locale === 'ar';

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section bg-neutral-50 min-h-screen">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <form action="/api/auth/logout" method="POST" className="inline">
              <button
                type="submit"
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
                aria-label={isRTL ? 'تسجيل الخروج' : 'Déconnexion'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {isRTL ? 'تسجيل الخروج' : 'Déconnexion'}
              </button>
            </form>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <div className="lg:col-span-2 card">
              <div className="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <h2 className="text-lg font-semibold">{t('personalInfo')}</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div><strong>{isRTL ? 'الاسم:' : 'Prénom :'}</strong> {user.firstName || '—'}</div>
                <div><strong>{isRTL ? 'اللقب:' : 'Nom :'}</strong> {user.lastName || '—'}</div>
                <div><strong>{isRTL ? 'البريد الإلكتروني:' : 'Email :'}</strong> {user.email || '—'}</div>
                <div><strong>{isRTL ? 'الهاتف:' : 'Téléphone :'}</strong> {user.phone || '—'}</div>
              </div>
            </div>

            {/* Informations professionnelles + Abonnement */}
            <div className="space-y-6">
              {user.role === 'PROFESSIONAL' && user.profile && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
                    </svg>
                    <h2 className="text-lg font-semibold">{t('professionalInfo')}</h2>
                  </div>
                  <div className="space-y-2 text-neutral-600">
                    <p><strong>{isRTL ? 'الشركة:' : 'Entreprise :'}</strong> {user.profile.companyName || '—'}</p>
                    <p><strong>{isRTL ? 'المهنة:' : 'Profession :'}</strong> {user.profile.profession || '—'}</p>
                    <p><strong>{isRTL ? 'الفئة:' : 'Catégorie :'}</strong> {user.profile.category || '—'}</p>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="11" y2="11"/><path d="m7 16 2-2 2 2"/><path d="m13 12 2 2 2-2"/>
                  </svg>
                  <h2 className="text-lg font-semibold">{t('subscription')}</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{isRTL ? 'النوع:' : 'Type :'}</span>
                    <span className="font-medium">
                      {user.role === 'PROFESSIONAL' 
                        ? (isRTL ? 'مهني' : 'Professionnel')
                        : (isRTL ? 'عضو' : 'Membre')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{isRTL ? 'السعر:' : 'Prix :'}</span>
                    <span className="font-medium">
                      {user.role === 'PROFESSIONAL' ? '100 €/an' : '15 €/an'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}