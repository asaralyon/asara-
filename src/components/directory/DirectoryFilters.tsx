'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { citiesSorted } from '@/lib/cities';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DirectoryFiltersProps {
  categories: Category[];
}

export function DirectoryFilters({ categories }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentCity = searchParams.get('city') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/annuaire?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    updateFilters('search', search);
  };

  return (
    <div className="bg-neutral-50 rounded-2xl p-6 mb-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Rechercher..."
            className="input pl-10"
          />
        </form>

        <select
          className="input"
          value={currentCategory}
          onChange={(e) => updateFilters('category', e.target.value)}
        >
          <option value="">Toutes les categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={currentCity}
          onChange={(e) => updateFilters('city', e.target.value)}
        >
          <option value="">Toutes les villes</option>
          {citiesSorted.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {(currentSearch || currentCategory || currentCity) && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-neutral-500">Filtres actifs:</span>
          {currentSearch && (
            <button
              onClick={() => updateFilters('search', '')}
              className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full hover:bg-primary-200"
            >
              {currentSearch} ×
            </button>
          )}
          {currentCategory && (
            <button
              onClick={() => updateFilters('category', '')}
              className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full hover:bg-primary-200"
            >
              {currentCategory} ×
            </button>
          )}
          {currentCity && (
            <button
              onClick={() => updateFilters('city', '')}
              className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full hover:bg-primary-200"
            >
              {currentCity} ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DirectoryFilters;