'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, EyeOff, Trash2 } from 'lucide-react';

interface EventActionsProps {
  event: {
    id: string;
    isPublished: boolean;
  };
}

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          isPublished: !event.isPublished,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet evenement ?')) return;
    setLoading(true);
    try {
      await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      });
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
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
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 min-w-[160px] z-20">
          <button
            onClick={togglePublish}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            {event.isPublished ? (
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
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

export default EventActions;