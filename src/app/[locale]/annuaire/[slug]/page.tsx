import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Facebook, 
  Instagram 
} from 'lucide-react';

type Props = {
  params: { locale: string; slug: string };
};

async function getProfessional(slug: string) {
  const professional = await prisma.professionalProfile.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return professional;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const professional = await getProfessional(params.slug);
  if (!professional) return { title: 'Not Found' };

  const name = professional.companyName || `${professional.user.firstName} ${professional.user.lastName}`;
  return {
    title: `${name} - ${professional.profession}`,
    description: professional.description || `${name}, ${professional.profession} à ${professional.city}`,
  };
}

export default async function ProfessionalPage({ params }: Props) {
  const { locale, slug } = params;
  const t = await getTranslations('directory');
  const tCommon = await getTranslations('common');
  const isRTL = locale === 'ar';

  const professional = await getProfessional(slug);
  if (!professional) notFound();

  const name = professional.companyName || `${professional.user.firstName} ${professional.user.lastName}`;

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section bg-neutral-50 min-h-screen">
        <div className="container-app">
          {/* Bouton retour */}
          <Link
            href={`/${locale}/annuaire`}
            className={`inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {tCommon('back')}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* En-tête */}
              <div className="card">
                <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {professional.photoUrl ? (
                    <img
                      src={professional.photoUrl}
                      alt={name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-primary-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-500">
                        {professional.user.firstName[0]}
                      </span>
                    </div>
                  )}
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">{name}</h1>
                    <p className="text-xl text-primary-500 font-medium mb-2">
                      {professional.profession}
                    </p>
                    <span className="badge badge-primary">{professional.category}</span>
                    {professional.specialty && (
                      <p className="text-neutral-600 mt-2">{professional.specialty}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {professional.description && (
                <div className="card">
                  <h2 className="font-semibold text-lg mb-4">
                    {isRTL ? 'نبذة' : 'À propos'}
                  </h2>
                  <p className="text-neutral-600 whitespace-pre-line">
                    {professional.description}
                  </p>
                </div>
              )}

              {/* Logo entreprise */}
              {professional.logoUrl && (
                <div className="card">
                  <h2 className="font-semibold text-lg mb-4">
                    {isRTL ? 'الشعار' : 'Logo'}
                  </h2>
                  <img
                    src={professional.logoUrl}
                    alt={`Logo ${name}`}
                    className="max-h-32 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Sidebar - Contact */}
            <div className="space-y-6">
              {/* Coordonnées */}
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">
                  {isRTL ? 'معلومات الاتصال' : 'Contact'}
                </h2>
                <div className="space-y-4">
                  {/* Adresse */}
                  {(professional.address || professional.city) && (
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        {professional.address && <p>{professional.address}</p>}
                        {professional.city && professional.postalCode && (
                          <p>{professional.postalCode} {professional.city}</p>
                        )}
                        {professional.city && !professional.postalCode && (
                          <p>{professional.city}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Téléphone */}
                  {professional.professionalPhone && (
                    <a
                      href={`tel:${professional.professionalPhone}`}
                      className={`flex items-center gap-3 text-neutral-600 hover:text-primary-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Phone className="w-5 h-5 text-primary-500" />
                      <span>{professional.professionalPhone}</span>
                    </a>
                  )}

                  {/* Email */}
                  {professional.professionalEmail && (
                    <a
                      href={`mailto:${professional.professionalEmail}`}
                      className={`flex items-center gap-3 text-neutral-600 hover:text-primary-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Mail className="w-5 h-5 text-primary-500" />
                      <span className="truncate">{professional.professionalEmail}</span>
                    </a>
                  )}

                  {/* Site web */}
                  {professional.website && (
                    <a
                      href={professional.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 text-neutral-600 hover:text-primary-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Globe className="w-5 h-5 text-primary-500" />
                      <span className="truncate">{professional.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Réseaux sociaux */}
              {(professional.linkedinUrl || professional.facebookUrl || professional.instagramUrl) && (
                <div className="card">
                  <h2 className="font-semibold text-lg mb-4">
                    {isRTL ? 'وسائل التواصل' : 'Réseaux sociaux'}
                  </h2>
                  <div className="flex gap-3">
                    {professional.linkedinUrl && (
                      <a
                        href={professional.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {professional.facebookUrl && (
                      <a
                        href={professional.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {professional.instagramUrl && (
                      <a
                        href={professional.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-200 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
