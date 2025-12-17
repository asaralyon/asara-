'use client';

import { useState, useEffect, Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, CheckCircle, XCircle } from 'lucide-react';

function ResetPasswordContent() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRTL = locale === 'ar';
  
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError(isRTL ? 'رابط غير صالح' : 'Lien invalide');
    }
  }, [token, isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError(isRTL ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/' + locale + '/connexion');
        }, 3000);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError(isRTL ? 'خطأ في الاتصال' : 'Erreur de connexion');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isRTL ? 'تم تغيير كلمة المرور!' : 'Mot de passe modifié !'}
          </h1>
          <p className="text-neutral-600 mb-6">
            {isRTL 
              ? 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
              : 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'}
          </p>
          <p className="text-sm text-neutral-500">
            {isRTL ? 'إعادة التوجيه...' : 'Redirection en cours...'}
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isRTL ? 'رابط غير صالح' : 'Lien invalide'}
          </h1>
          <p className="text-neutral-600 mb-6">
            {isRTL 
              ? 'هذا الرابط غير صالح أو منتهي الصلاحية.'
              : 'Ce lien est invalide ou a expiré.'}
          </p>
          <Link href={'/' + locale + '/mot-de-passe-oublie'} className="btn-primary inline-flex">
            {isRTL ? 'طلب رابط جديد' : 'Demander un nouveau lien'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold">
            {isRTL ? 'إعادة تعيين كلمة المرور' : 'Nouveau mot de passe'}
          </h1>
          <p className="text-neutral-600 mt-2">
            {isRTL ? 'أدخل كلمة المرور الجديدة' : 'Choisissez votre nouveau mot de passe'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label">
              {isRTL ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {isRTL ? '8 أحرف على الأقل' : 'Minimum 8 caractères'}
            </p>
          </div>

          <div>
            <label className="label">
              {isRTL ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isRTL ? 'جاري الحفظ...' : 'Enregistrement...'}
              </>
            ) : (
              isRTL ? 'تغيير كلمة المرور' : 'Changer le mot de passe'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
