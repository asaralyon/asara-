export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Calendar, Building2, Users, ArrowRight, Newspaper } from 'lucide-react';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { NewsSection } from '@/components/home/NewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'ar' 
      ? 'جمعية السوريين في أوفيرن رون ألب | ASARA Lyon'
      : 'Association des Syriens d\'Auvergne Rhône-Alpes | ASARA Lyon',
    description: locale === 'ar'
      ? 'انضم إلى مجتمع ASARA - جمعية السوريين في أوفيرن رون ألب. اكتشف المحترفين السوريين وابق على اطلاع بأحداث المجتمع.'
      : 'Rejoignez la communauté ASARA - Association des Syriens d\'Auvergne Rhône-Alpes. Découvrez les professionnels syriens et restez informé des événements.',
    alternates: {
      canonical: 'https://asara-lyon.fr/' + locale,
    },
  };
}

type Props = {
  params: { locale: string };
};

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  const t = await getTranslations('home');
  const isRTL = locale === 'ar';

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      {/* JSON-LD pour SEO */}
      <OrganizationJsonLd locale={locale} />

      {/* Hero - Logo et nom uniquement */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container-app text-center">
          <Image
            src="/images/logo.png"
            alt="ASARA - Association des Syriens d'Auvergne Rhône-Alpes"
            width={180}
            height={180}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-neutral-50">
        <div className="container-app">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {isRTL ? 'خدماتنا' : 'Nos services'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href={'/' + locale + '/annuaire'} className="card hover:shadow-strong transition-shadow text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{isRTL ? 'الدليل المهني' : 'Annuaire professionnel'}</h3>
              <p className="text-neutral-600">{isRTL ? 'اكتشف المحترفين السوريين في منطقتك' : 'Découvrez les professionnels syriens de votre région'}</p>
            </Link>
            <Link href={'/' + locale + '/evenements'} className="card hover:shadow-strong transition-shadow text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{isRTL ? 'الفعاليات' : 'Événements'}</h3>
              <p className="text-neutral-600">{isRTL ? 'شارك في فعاليات المجتمع' : 'Participez aux événements de la communauté'}</p>
            </Link>
            <Link href={'/' + locale + '/adhesion'} className="card hover:shadow-strong transition-shadow text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{isRTL ? 'العضوية' : 'Adhésion'}</h3>
              <p className="text-neutral-600">{isRTL ? 'انضم إلى جمعيتنا' : 'Rejoignez notre association'}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Actualités RSS */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Newspaper className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl sm:text-3xl font-bold">
              {isRTL ? 'آخر الأخبار من سوريا' : 'Actualités de Syrie'}
            </h2>
          </div>
          <NewsSection />
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection locale={locale} />

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="container-app text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href={'/' + locale + '/adhesion'} className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
            {isRTL ? 'سجل الآن' : 'S\'inscrire maintenant'}
            <ArrowRight className={'w-5 h-5 ' + (isRTL ? 'rotate-180' : '')} />
          </Link>
        </div>
      </section>
    </main>
  );
}
