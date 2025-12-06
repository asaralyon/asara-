import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories - Admin',
};

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });

  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-neutral-600">{categories.length} categorie(s)</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Ordre</th>
                  <th className="text-left p-4 font-semibold text-sm">Nom</th>
                  <th className="text-left p-4 font-semibold text-sm">Slug</th>
                  <th className="text-left p-4 font-semibold text-sm">Icone</th>
                  <th className="text-left p-4 font-semibold text-sm">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50">
                    <td className="p-4 text-sm font-medium">{cat.order}</td>
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-sm text-neutral-500">{cat.slug}</td>
                    <td className="p-4 text-sm text-neutral-500">{cat.icon}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        cat.isActive
                          ? 'bg-green-100 text-green-600'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}