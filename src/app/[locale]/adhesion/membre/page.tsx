'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function MemberSignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth.register');
  const isRTL = locale === 'ar';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'MEMBER',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${locale}/adhesion/success`);
      } else {
        setError(data.error || (isRTL ? 'خطأ في التسجيل' : 'Erreur lors de l\'inscription'));
      }
    } catch {
      setError(isRTL ? 'خطأ في الاتصال' : 'Erreur de connexion');
    }

    setLoading(false);
  };

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section bg-neutral-50 min-h-screen">
        <div className="container-app">
          <Link
            href={`/${locale}/adhesion`}
            className={`inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'رجوع' : 'Retour'}
          </Link>

          <div className="max-w-lg mx-auto">
            <div className="card">
              <h1 className="text-2xl font-bold text-center mb-2">
                {isRTL ? 'عضوية عادية' : 'Adhésion Membre'}
              </h1>
              <p className="text-center text-neutral-600 mb-6">15 €/{isRTL ? 'سنة' : 'an'}</p>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informations personnelles */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('firstName')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">{t('lastName')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">{t('email')} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{isRTL ? 'العنوان' : 'Adresse'}</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{isRTL ? 'المدينة' : 'Ville'}</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">{isRTL ? 'الرمز البريدي' : 'Code postal'}</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">{t('password')} *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('confirmPassword')} *</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading
                    ? (isRTL ? 'جاري التسجيل...' : 'Inscription...')
                    : (isRTL ? 'إتمام التسجيل' : 'S\'inscrire')}
                </button>
              </form>

              <p className="text-center text-neutral-600 mt-6">
                {t('hasAccount')}{' '}
                <Link
                  href={`/${locale}/connexion`}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  {t('login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
