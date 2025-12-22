'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  locale: string;
}

export default function NewsletterSection({ locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const isArabic = locale === 'ar';

  const texts = {
    title: isArabic ? 'اشترك في نشرتنا الأسبوعية' : 'Inscrivez-vous à notre newsletter',
    subtitle: isArabic 
      ? 'احصل على آخر الأخبار والفعاليات مباشرة في بريدك الإلكتروني'
      : 'Recevez les dernières actualités et événements directement dans votre boîte mail',
    button: isArabic ? 'اشتراك' : 'S\'inscrire',
    firstName: isArabic ? 'الاسم الأول' : 'Prénom',
    lastName: isArabic ? 'اسم العائلة' : 'Nom',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    submit: isArabic ? 'اشتراك' : 'S\'inscrire',
    cancel: isArabic ? 'إلغاء' : 'Annuler',
    success: isArabic ? 'تم الاشتراك بنجاح! تحقق من بريدك الإلكتروني.' : 'Inscription réussie ! Vérifiez votre email.',
    error: isArabic ? 'حدث خطأ. حاول مرة أخرى.' : 'Une erreur est survenue. Réessayez.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '' });
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || texts.error);
      }
    } catch {
      setStatus('error');
      setErrorMsg(texts.error);
    }

    setLoading(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-app">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {texts.title}
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            {texts.subtitle}
          </p>

          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              {texts.button}
            </button>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-xl">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 font-medium">{texts.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1 text-start">
                        {texts.firstName}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="input"
                        placeholder={texts.firstName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1 text-start">
                        {texts.lastName}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="input"
                        placeholder={texts.lastName}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1 text-start">
                      {texts.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      placeholder="email@exemple.com"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary flex-1"
                    >
                      {texts.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : texts.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
