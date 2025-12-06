'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const categories = [
  { value: 'Santé', labelFr: 'Santé', labelAr: 'الصحة' },
  { value: 'Juridique', labelFr: 'Juridique', labelAr: 'القانون' },
  { value: 'Finance', labelFr: 'Finance', labelAr: 'المالية' },
  { value: 'Immobilier', labelFr: 'Immobilier', labelAr: 'العقارات' },
  { value: 'Restauration', labelFr: 'Restauration', labelAr: 'المطاعم' },
  { value: 'Commerce', labelFr: 'Commerce', labelAr: 'التجارة' },
  { value: 'Artisanat', labelFr: 'Artisanat', labelAr: 'الحرف' },
  { value: 'Technologie', labelFr: 'Technologie', labelAr: 'التكنولوجيا' },
  { value: 'Education', labelFr: 'Éducation', labelAr: 'التعليم' },
  { value: 'Transport', labelFr: 'Transport', labelAr: 'النقل' },
  { value: 'Beauté', labelFr: 'Beauté & Bien-être', labelAr: 'الجمال' },
  { value: 'Construction', labelFr: 'Construction', labelAr: 'البناء' },
  { value: 'Autre', labelFr: 'Autre', labelAr: 'أخرى' },
];

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth.register');
  const isRTL = locale === 'ar';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Étape 1 - Personnel
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Étape 2 - Professionnel
    companyName: '',
    profession: '',
    category: '',
    specialty: '',
    description: '',
    // Étape 3 - Adresse
    address: '',
    city: '',
    postalCode: '',
    professionalPhone: '',
    professionalEmail: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      if (step === 1 && formData.password !== formData.confirmPassword) {
        setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas');
        return;
      }
      setStep(step + 1);
      setError('');
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
          role: 'PROFESSIONAL',
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

          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h1 className="text-2xl font-bold text-center mb-2">
                {isRTL ? 'عضوية مهني' : 'Adhésion Professionnel'}
              </h1>
              <p className="text-center text-neutral-600 mb-6">100 €/{isRTL ? 'سنة' : 'an'}</p>

              {/* Étapes */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      s === step
                        ? 'bg-primary-500 text-white'
                        : s < step
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Étape 1 - Informations personnelles */}
                {step === 1 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4">
                      {isRTL ? 'المعلومات الشخصية' : 'Informations personnelles'}
                    </h2>
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
                  </>
                )}

                {/* Étape 2 - Informations professionnelles */}
                {step === 2 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4">
                      {isRTL ? 'المعلومات المهنية' : 'Informations professionnelles'}
                    </h2>
                    <div>
                      <label className="label">{isRTL ? 'اسم الشركة' : 'Nom de l\'entreprise'}</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'المهنة' : 'Profession'} *</label>
                      <input
                        type="text"
                        required
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        className="input"
                        placeholder={isRTL ? 'مثال: طبيب، محامي، مهندس' : 'Ex: Médecin, Avocat, Ingénieur'}
                      />
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'الفئة' : 'Catégorie'} *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input"
                      >
                        <option value="">--</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {isRTL ? cat.labelAr : cat.labelFr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'التخصص' : 'Spécialité'}</label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'الوصف' : 'Description'}</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input resize-none"
                        placeholder={isRTL ? 'وصف قصير عن نشاطك' : 'Décrivez brièvement votre activité'}
                      />
                    </div>
                  </>
                )}

                {/* Étape 3 - Coordonnées professionnelles */}
                {step === 3 && (
                  <>
                    <h2 className="font-semibold text-lg mb-4">
                      {isRTL ? 'معلومات الاتصال المهنية' : 'Coordonnées professionnelles'}
                    </h2>
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
                        <label className="label">{isRTL ? 'المدينة' : 'Ville'} *</label>
                        <input
                          type="text"
                          required
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
                      <label className="label">{isRTL ? 'هاتف العمل' : 'Téléphone professionnel'}</label>
                      <input
                        type="tel"
                        value={formData.professionalPhone}
                        onChange={(e) => setFormData({ ...formData, professionalPhone: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'بريد العمل' : 'Email professionnel'}</label>
                      <input
                        type="email"
                        value={formData.professionalEmail}
                        onChange={(e) => setFormData({ ...formData, professionalEmail: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">{isRTL ? 'الموقع الإلكتروني' : 'Site web'}</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="input"
                        placeholder="https://"
                      />
                    </div>
                  </>
                )}

                {/* Boutons */}
                <div className={`flex gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-outline flex-1"
                    >
                      {isRTL ? 'السابق' : 'Précédent'}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {step < 3
                      ? (isRTL ? 'التالي' : 'Suivant')
                      : loading
                      ? (isRTL ? 'جاري التسجيل...' : 'Inscription...')
                      : (isRTL ? 'إتمام التسجيل' : 'Finaliser l\'inscription')}
                  </button>
                </div>
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
