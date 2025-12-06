// app/[locale]/layout.tsx (votre fichier actuel, modifié)
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientSessionProvider } from '@/components/auth/ClientSessionProvider';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ⚠️ Fonction utilitaire côté serveur : récupère l'utilisateur pour le SSR
async function getCurrentUser() {
  // On peut appeler /api/auth/me *sans* credentials ici, car on est côté serveur
  // Mais mieux : utiliser directement Prisma (éviter une requête HTTP interne)
  // → Ici, fallback simple : laisse le client gérer
  return null; // ou implémentez une version SSR si besoin (ex: getServerSession)
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === 'ar';

  // 🔹 Optionnel : pour du SSR d'auth, décommentez et implémentez `getCurrentUser`
  // const user = await getCurrentUser();

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          {/* 🔹 Wrappez tout avec ClientSessionProvider */}
          <ClientSessionProvider user={null}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ClientSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}