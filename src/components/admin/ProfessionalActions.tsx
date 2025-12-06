'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ProfessionalActionsProps {
  professional: {
    id: string;
    slug: string;
    isPublished: boolean;
  };
}

export function ProfessionalActions({ professional }: ProfessionalActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/professionals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional.id,
          isPublished: !professional.isPublished,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
    setOpen(false);
  };

  if (loading) {
    return <span className="text-sm text-neutral-400">...</span>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-neutral-100 rounded-lg"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 min-w-[160px] z-20">
            <a
              href={'/annuaire/' + professional.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              <ExternalLink className="w-4 h-4 text-blue-500" />
              Voir le profil
            </a>
            <button
              onClick={togglePublish}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              {professional.isPublished ? (
                <>
                  <EyeOff className="w-4 h-4 text-yellow-500" />
                  Masquer
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-green-500" />
                  Publier
                </>
              )}
            </button>
          </div>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}

export default ProfessionalActions;