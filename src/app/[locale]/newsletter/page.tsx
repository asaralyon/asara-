import type { Metadata } from 'next';
import NewsletterSection from '@/components/home/NewsletterSection';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isRTL = params.locale === 'ar';
  return {
    title: isRTL ? 'النشرة الأسبوعية' : 'Newsletter',
    description: isRTL 
      ? 'اشترك في نشرتنا الأسبوعية للحصول على آخر الأخبار والفعاليات'
      : 'Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et événements',
  };
}

export default function NewsletterPage({ params }: Props) {
  const { locale } = params;
  const isRTL = locale === 'ar';

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container-app text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4">
            {isRTL ? 'النشرة الأسبوعية' : 'Newsletter'}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'ابقوا على اطلاع بآخر أخبار الجمعية والمجتمع السوري'
              : 'Restez informé des dernières nouvelles de l\'association et de la communauté syrienne'}
          </p>
        </div>
      </section>

      <NewsletterSection locale={locale} />
    </main>
  );
}
