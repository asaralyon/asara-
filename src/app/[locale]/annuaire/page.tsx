import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Search, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

type Props = {
  params: { locale: string };
  searchParams: { category?: string; city?: string; search?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'directory' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

async function getProfessionals(searchParams: Props['searchParams']) {
  const { category, city, search } = searchParams;

  const where: any = {
    isPublished: true,
  };

  if (category) {
    where.category = category;
  }

  if (city) {
    where.city = city;
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { profession: { contains: search, mode: 'insensitive' } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const professionals = await prisma.professionalProfile.findMany({
    where,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return professionals;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  return categories;
}

async function getCities() {
  const profiles = await prisma.professionalProfile.findMany({
    where: { isPublished: true, city: { not: null } },
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' },
  });
  return profiles.map((p) => p.city).filter(Boolean) as string[];
}

// Fonction pour traduire les catégories
function translateCategory(category: string, locale: string): string {
  const translations: Record<string, Record<string, string>> = {
    'Santé': { fr: 'Santé', ar: 'الصحة' },
    'Juridique': { fr: 'Juridique', ar: 'القانون' },
    'Finance': { fr: 'Finance', ar: 'المالية' },
    'Immobilier': { fr: 'Immobilier', ar: 'العقارات' },
    'Restauration': { fr: 'Restauration', ar: 'المطاعم' },
    'Commerce': { fr: 'Commerce', ar: 'التجارة' },
    'Artisanat': { fr: 'Artisanat', ar: 'الحرف اليدوية' },
    'Technologie': { fr: 'Technologie', ar: 'التكنولوجيا' },
    'Education': { fr: 'Éducation', ar: 'التعليم' },
    'Transport': { fr: 'Transport', ar: 'النقل' },
    'Beauté': { fr: 'Beauté & Bien-être', ar: 'الجمال والعناية' },
    'Construction': { fr: 'Construction', ar: 'البناء' },
    'Autre': { fr: 'Autre', ar: 'أخرى' },
  };
  
  return translations[category]?.[locale] || category;
}

export default async function DirectoryPage({ params, searchParams }: Props) {
  const { locale } = params;
  const t = await getTranslations('directory');
  const isRTL = locale === 'ar';

  const [professionals, categories, cities] = await Promise.all([
    getProfessionals(searchParams),
    getCategories(),
    getCities(),
  ]);

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container-app text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container-app">
          <form className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                name="search"
                placeholder={t('search')}
                defaultValue={searchParams.search || ''}
                className={`input ${isRTL ? 'pr-12' : 'pl-12'}`}
              />
            </div>

            {/* Catégorie - TRADUITE */}
            <select
              name="category"
              defaultValue={searchParams.category || ''}
              className="input md:w-56"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {translateCategory(cat.name, locale)}
                </option>
              ))}
            </select>

            {/* Ville - NON TRADUITE (gardée telle quelle) */}
            <select
              name="city"
              defaultValue={searchParams.city || ''}
              className="input md:w-48"
            >
              <option value="">{t('allCities')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button type="submit" className="btn-primary">
              {isRTL ? 'بحث' : 'Rechercher'}
            </button>
          </form>
        </div>
      </section>

      {/* Résultats */}
      <section className="section bg-neutral-50">
        <div className="container-app">
          <p className="text-neutral-600 mb-6">
            {professionals.length} {t('professionals')}
          </p>

          {professionals.length === 0 ? (
            <div className="card text-center py-12">
              <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">{t('noProfessionals')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((pro) => (
                <Link
                  key={pro.id}
                  href={`/${locale}/annuaire/${pro.slug}`}
                  className="card hover:shadow-strong transition-shadow"
                >
                  {/* Photo */}
                  <div className={`flex items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {pro.photoUrl ? (
                      <img
                        src={pro.photoUrl}
                        alt={pro.companyName || `${pro.user.firstName} ${pro.user.lastName}`}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-500">
                          {pro.user.firstName[0]}
                        </span>
                      </div>
                    )}
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className="font-semibold text-lg truncate">
                        {pro.companyName || `${pro.user.firstName} ${pro.user.lastName}`}
                      </h3>
                      <p className="text-primary-500 font-medium">{pro.profession}</p>
                      {/* Catégorie traduite */}
                      <span className="badge badge-primary text-xs mt-1">
                        {translateCategory(pro.category, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Infos - Ville NON traduite */}
                  <div className={`space-y-2 text-sm text-neutral-600 ${isRTL ? 'text-right' : ''}`}>
                    {pro.city && (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <span>{pro.city}</span>
                      </div>
                    )}
                    {pro.professionalPhone && (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Phone className="w-4 h-4 text-neutral-400" />
                        <span dir="ltr">{pro.professionalPhone}</span>
                      </div>
                    )}
                    {pro.professionalEmail && (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="truncate" dir="ltr">{pro.professionalEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Lien */}
                  <div className={`mt-4 pt-4 border-t border-neutral-100 flex items-center gap-1 text-primary-500 font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('viewProfile')}
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
