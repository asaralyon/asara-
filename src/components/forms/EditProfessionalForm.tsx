'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface EditProfessionalFormProps {
  user: any;
  locale: string;
}

export default function EditProfessionalForm({ user, locale }: EditProfessionalFormProps) {
  const router = useRouter();
  const t = useTranslations('account');
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    companyName: user.profile?.companyName || '',
    profession: user.profile?.profession || '',
    category: user.profile?.category || '',
    specialty: user.profile?.specialty || '',
    description: user.profile?.description || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    postalCode: user.profile?.postalCode || '',
    professionalPhone: user.profile?.professionalPhone || '',
    professionalEmail: user.profile?.professionalEmail || '',
    website: user.profile?.website || '',
    linkedinUrl: user.profile?.linkedinUrl || '',
    facebookUrl: user.profile?.facebookUrl || '',
    instagramUrl: user.profile?.instagramUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/user/update-professional', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/mon-compte`);
      }, 1500);
    } catch (err) {
      setError(isRTL ? 'حدث خطأ في التحديث' : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Sante',
    'Juridique',
    'Finance',
    'Immobilier',
    'Restauration',
    'Commerce',
    'Artisanat',
    'Technologie',
    'Education',
    'Transport',
    'Beaute et Bien-etre',
    'Batiment',
    'Informatique',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ Bouton retour en haut */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
        <Link 
          href={`/${locale}/mon-compte`}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? 'rotate-180' : ''}>
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="font-medium">{isRTL ? 'رجوع' : 'Retour'}</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm border border-green-200">
          {isRTL ? 'تم التحديث بنجاح!' : 'Mise à jour réussie !'}
        </div>
      )}

      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{isRTL ? 'المعلومات الأساسية' : 'Informations de base'}</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="label">
              {t('companyName')}
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="profession" className="label">
              {t('profession')}
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="label">
              {t('category')}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">{isRTL ? 'اختر فئة' : 'Choisir une catégorie'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="specialty" className="label">
              {t('specialty')}
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            {t('description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input"
          />
        </div>
      </div>

      {/* Adresse professionnelle */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{isRTL ? 'العنوان المهني' : 'Adresse professionnelle'}</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="address" className="label">
              {t('professionalAddress')}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="city" className="label">
              {t('professionalCity')}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="label">
              {t('professionalPostalCode')}
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Contact professionnel */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{isRTL ? 'معلومات الاتصال' : 'Contact professionnel'}</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="professionalPhone" className="label">
              {t('professionalPhone')}
            </label>
            <input
              type="tel"
              id="professionalPhone"
              name="professionalPhone"
              value={formData.professionalPhone}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="professionalEmail" className="label">
              {t('professionalEmail')}
            </label>
            <input
              type="email"
              id="professionalEmail"
              name="professionalEmail"
              value={formData.professionalEmail}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="website" className="label">
              {t('website')}
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="input"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{isRTL ? 'وسائل التواصل الاجتماعي' : 'Réseaux sociaux'}</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="linkedinUrl" className="label">
              {t('linkedinUrl')}
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label htmlFor="facebookUrl" className="label">
              {t('facebookUrl')}
            </label>
            <input
              type="url"
              id="facebookUrl"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label htmlFor="instagramUrl" className="label">
              {t('instagramUrl')}
            </label>
            <input
              type="url"
              id="instagramUrl"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? t('saving') : t('save')}
        </button>
        <Link
          href={`/${locale}/mon-compte`}
          className="px-6 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center font-medium"
        >
          {isRTL ? 'إلغاء' : 'Annuler'}
        </Link>
      </div>
    </form>
  );
}
