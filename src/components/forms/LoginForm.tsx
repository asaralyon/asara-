'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Validation stricte
        if (!data.user?.role) {
          throw new Error('invalid_user_data');
        }

        const redirectPath = data.user.role === 'ADMIN'
          ? `/${locale}/admin`
          : `/${locale}/mon-compte`;

        // ✅ Navigation fluide et fiable
        await router.push(redirectPath);
        return;
      }

      setError(data.error || 'Erreur de connexion');
    } catch (err) {
      setError('Erreur de connexion');
      console.error('[LoginForm] Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          {t('email')}
        </label>
        <input
          type="email"
          required
          autoFocus
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          {t('password')}
        </label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('loading')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}