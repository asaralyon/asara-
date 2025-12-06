import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ProfessionalActions } from '../../../components/admin/ProfessionalActions';
export const metadata: Metadata = {
  title: 'Professionnels - Admin',
};

async function getProfessionals() {
  const professionals = await prisma.professionalProfile.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return professionals;
}

export default async function ProfessionalsPage() {
  const professionals = await getProfessionals();

  return (
    <section className="section bg-neutral-50 min-h-screen">
      <div className="container-app">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Professionnels</h1>
          <p className="text-neutral-600">{professionals.length} professionnel(s)</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Nom</th>
                  <th className="text-left p-4 font-semibold text-sm">Profession</th>
                  <th className="text-left p-4 font-semibold text-sm">Categorie</th>
                  <th className="text-left p-4 font-semibold text-sm">Ville</th>
                  <th className="text-left p-4 font-semibold text-sm">Publie</th>
                  <th className="text-right p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {professionals.map((pro) => (
                  <tr key={pro.id} className="hover:bg-neutral-50">
                    <td className="p-4">
                      <p className="font-medium">{pro.user.firstName} {pro.user.lastName}</p>
                      <p className="text-sm text-neutral-500">{pro.user.email}</p>
                    </td>
                    <td className="p-4 text-sm">{pro.profession}</td>
                    <td className="p-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-600">
                        {pro.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-neutral-600">{pro.city}</td>
                    <td className="p-4">
                      {pro.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <Eye className="w-4 h-4" />
                          Oui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
                          <EyeOff className="w-4 h-4" />
                          Non
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <ProfessionalActions professional={pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {professionals.length === 0 && (
              <p className="text-center py-8 text-neutral-500">Aucun professionnel</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}