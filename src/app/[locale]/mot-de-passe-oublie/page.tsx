'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur');
      }
    } catch {
      setError(isRTL ? 'خطأ في الاتصال' : 'Erreur de connexion');
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <main dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              {isRTL ? 'تم إرسال البريد الإلكتروني' : 'Email envoyé !'}
            </h1>
            <p className="text-neutral-600 mb-6">
              {isRTL 
                ? 'إذا كان هذا البريد الإلكتروني مسجلاً لدينا، فستتلقى رابطًا لإعادة تعيين كلمة المرور.'
                : 'Si cet email est enregistré chez nous, vous recevrez un lien pour réinitialiser votre mot de passe.'}
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              {isRTL ? 'تحقق من صندوق البريد الوارد والرسائل غير المرغوب فيها.' : 'Vérifiez votre boîte de réception et vos spams.'}
            </p>
            <Link href={'/' + locale + '/connexion'} className="btn-primary inline-flex">
              {isRTL ? 'العودة إلى تسجيل الدخول' : 'Retour à la connexion'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <Link
            href={'/' + locale + '/connexion'}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? 'العودة' : 'Retour'}
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold">
              {isRTL ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
            </h1>
            <p className="text-neutral-600 mt-2">
              {isRTL 
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.'
                : 'Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="label">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="votre@email.com"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRTL ? 'جاري الإرسال...' : 'Envoi en cours...'}
                </>
              ) : (
                isRTL ? 'إرسال رابط إعادة التعيين' : 'Envoyer le lien'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
