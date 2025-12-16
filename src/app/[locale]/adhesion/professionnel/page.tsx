'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Catégories prédéfinies
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

// Villes d'Auvergne-Rhône-Alpes prédéfinies
const cities = [
  // Ain (01)
  'Bourg-en-Bresse', 'Oyonnax', 'Ambérieu-en-Bugey', 'Bellegarde-sur-Valserine', 'Gex', 'Ferney-Voltaire', 'Divonne-les-Bains', 'Belley', 'Meximieux', 'Miribel',
  // Allier (03)
  'Moulins', 'Montluçon', 'Vichy', 'Cusset', 'Yzeure', 'Bellerive-sur-Allier', 'Commentry', 'Gannat', 'Dompierre-sur-Besbre', 'Désertines',
  // Ardèche (07)
  'Annonay', 'Aubenas', 'Guilherand-Granges', 'Tournon-sur-Rhône', 'Privas', 'Le Teil', 'Bourg-Saint-Andéol', 'La Voulte-sur-Rhône', 'Saint-Péray', 'Vals-les-Bains',
  // Cantal (15)
  'Aurillac', 'Saint-Flour', 'Mauriac', 'Arpajon-sur-Cère', 'Riom-ès-Montagnes', 'Ytrac', 'Murat', 'Ydes', 'Vic-sur-Cère', 'Maurs',
  // Drôme (26)
  'Valence', 'Romans-sur-Isère', 'Montélimar', 'Pierrelatte', 'Bourg-lès-Valence', 'Portes-lès-Valence', 'Saint-Paul-Trois-Châteaux', 'Livron-sur-Drôme', 'Crest', 'Die',
  // Isère (38)
  'Grenoble', 'Vienne', 'Échirolles', 'Bourgoin-Jallieu', 'Fontaine', 'Voiron', 'Saint-Martin-d\'Hères', 'Villefontaine', 'Meylan', 'L\'Isle-d\'Abeau', 'Sassenage', 'Vif', 'Roussillon', 'La Tour-du-Pin',
  // Loire (42)
  'Saint-Étienne', 'Roanne', 'Saint-Chamond', 'Firminy', 'Montbrison', 'Rive-de-Gier', 'Riorges', 'Le Chambon-Feugerolles', 'Saint-Just-Saint-Rambert', 'Andrézieux-Bouthéon',
  // Haute-Loire (43)
  'Le Puy-en-Velay', 'Monistrol-sur-Loire', 'Yssingeaux', 'Brioude', 'Sainte-Sigolène', 'Langeac', 'Vals-près-le-Puy', 'Craponne-sur-Arzon', 'Saint-Germain-Laprade', 'Aurec-sur-Loire',
  // Puy-de-Dôme (63)
  'Clermont-Ferrand', 'Riom', 'Cournon-d\'Auvergne', 'Chamalières', 'Aubière', 'Beaumont', 'Issoire', 'Thiers', 'Gerzat', 'Pont-du-Château', 'Ambert', 'Lempdes',
  // Rhône (69)
  'Lyon', 'Villeurbanne', 'Vénissieux', 'Vaulx-en-Velin', 'Caluire-et-Cuire', 'Bron', 'Rillieux-la-Pape', 'Saint-Priest', 'Oullins', 'Meyzieu', 'Décines-Charpieu', 'Givors', 'Tassin-la-Demi-Lune', 'Tarare',
  // Savoie (73)
  'Chambéry', 'Aix-les-Bains', 'Albertville', 'La Motte-Servolex', 'Saint-Jean-de-Maurienne', 'Bourg-Saint-Maurice', 'Montmélian', 'Cognin', 'Ugine', 'Modane',
  // Haute-Savoie (74)
  'Annecy', 'Thonon-les-Bains', 'Annemasse', 'Évian-les-Bains', 'Cluses', 'Seynod', 'Rumilly', 'Sallanches', 'Bonneville', 'Cran-Gevrier', 'Passy', 'Gaillard', 'Saint-Julien-en-Genevois', 'Archamps',
].sort((a, b) => a.localeCompare(b, 'fr'));

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
    profession: '', // Champ libre
    category: '',   // Select prédéfini
    specialty: '',
    description: '',
    // Étape 3 - Adresse
    address: '',
    city: '',       // Select prédéfini
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
        router.push('/' + locale + '/adhesion/success');
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
        <div className="container-app max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={'/' + locale + '/adhesion'}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {isRTL ? 'العودة' : 'Retour'}
            </Link>
            <h1 className="text-2xl font-bold">
              {isRTL ? 'التسجيل كمحترف' : 'Inscription Professionnel'}
            </h1>
            <p className="text-neutral-600 mt-2">
              {isRTL ? 'الخطوة' : 'Étape'} {step}/3
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-primary-500' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Étape 1 - Informations personnelles */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">
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
                    minLength={8}
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
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* Étape 2 - Informations professionnelles */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">
                  {isRTL ? 'المعلومات المهنية' : 'Informations professionnelles'}
                </h2>

                <div>
                  <label className="label">
                    {isRTL ? 'اسم الشركة' : 'Nom de l\'entreprise'}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="input"
                    placeholder={isRTL ? 'اختياري' : 'Optionnel'}
                  />
                </div>

                <div>
                  <label className="label">
                    {isRTL ? 'المهنة' : 'Métier / Profession'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="input"
                    placeholder={isRTL ? 'مثال: طبيب أسنان، محامي، مطور ويب...' : 'Ex: Dentiste, Avocat, Développeur web...'}
                  />
                </div>

                <div>
                  <label className="label">
                    {isRTL ? 'الفئة' : 'Catégorie'} *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="">{isRTL ? 'اختر فئة' : 'Sélectionnez une catégorie'}</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {isRTL ? cat.labelAr : cat.labelFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    {isRTL ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    placeholder={isRTL ? 'وصف مختصر لنشاطك' : 'Décrivez brièvement votre activité'}
                  />
                </div>
              </div>
            )}

            {/* Étape 3 - Coordonnées professionnelles */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">
                  {isRTL ? 'بيانات الاتصال المهنية' : 'Coordonnées professionnelles'}
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
                    <select
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input"
                    >
                      <option value="">{isRTL ? 'اختر مدينة' : 'Sélectionnez une ville'}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
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
                  <label className="label">
                    {isRTL ? 'هاتف العمل' : 'Téléphone professionnel'}
                  </label>
                  <input
                    type="tel"
                    value={formData.professionalPhone}
                    onChange={(e) => setFormData({ ...formData, professionalPhone: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    {isRTL ? 'البريد الإلكتروني المهني' : 'Email professionnel'}
                  </label>
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
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  {isRTL ? 'السابق' : 'Précédent'}
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isRTL ? 'جاري التحميل...' : 'Chargement...'}
                  </>
                ) : step < 3 ? (
                  isRTL ? 'التالي' : 'Suivant'
                ) : (
                  isRTL ? 'إرسال' : 'Envoyer'
                )}
              </button>
            </div>
          </form>

          {/* Info prix */}
          <div className="mt-6 p-4 bg-primary-50 rounded-xl text-center">
            <p className="text-primary-700 font-medium">
              {isRTL ? 'رسوم العضوية: 100 يورو / سنة' : 'Cotisation : 100 € / an'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
