'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Trash2, Loader2, ArrowLeft, Globe } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  isActive: boolean;
  confirmedAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  french: number;
  arabic: number;
}

export default function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribers');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm('Supprimer ' + email + ' de la liste ?')) return;

    try {
      const res = await fetch('/api/subscribers?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Inscrit supprime' });
        fetchSubscribers();
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur reseau' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-app">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Inscrits Newsletter</h1>
            <p className="text-neutral-600">Personnes inscrites a la newsletter</p>
          </div>
          <button onClick={() => router.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>

        {message && (
          <div className={'mb-6 p-4 rounded-lg ' + (message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {message.text}
            <button onClick={() => setMessage(null)} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-neutral-500">Total</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-neutral-500">Actifs</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.french}</p>
                  <p className="text-sm text-neutral-500">Francais</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.arabic}</p>
                  <p className="text-sm text-neutral-500">Arabe</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Liste des inscrits</h2>
          
          {subscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-neutral-600">Nom</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-600">Email</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-600">Langue</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-600">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-600">Statut</th>
                    <th className="text-right py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-neutral-50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{sub.firstName} {sub.lastName}</p>
                      </td>
                      <td className="py-3 px-2 text-neutral-600">{sub.email}</td>
                      <td className="py-3 px-2">
                        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (sub.locale === 'ar' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                          {sub.locale === 'ar' ? 'العربية' : 'Francais'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-neutral-500 text-sm">
                        {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-2">
                        {sub.isActive ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Actif</span>
                        ) : (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">Inactif</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDelete(sub.id, sub.email)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">Aucun inscrit pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}
