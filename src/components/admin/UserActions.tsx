'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface UserActionsProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
    setOpen(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Supprimer cet utilisateur ?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (res.ok) {
        router.refresh();
      }
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
          {user.status === 'PENDING' && (
            <button
              onClick={() => handleAction('approve')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              Valider
            </button>
          )}

          {user.status === 'ACTIVE' && (
            <button
              onClick={() => handleAction('suspend')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              <XCircle className="w-4 h-4 text-yellow-500" />
              Suspendre
            </button>
          )}

          {user.status === 'SUSPENDED' && (
            <button
              onClick={() => handleAction('activate')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              Reactiver
            </button>
          )}

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

export default UserActions;