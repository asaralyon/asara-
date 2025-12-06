'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations('contact');
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const subjects = [
    { value: 'information', label: t('subjects.information') },
    { value: 'membership', label: t('subjects.membership') },
    { value: 'directory', label: t('subjects.directory') },
    { value: 'event', label: t('subjects.event') },
    { value: 'partnership', label: t('subjects.partnership') },
    { value: 'other', label: t('subjects.other') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-green-600">{t('form.success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>{t('form.error')}</span>
        </div>
      )}

      {/* Nom */}
      <div>
        <label className="label">{t('form.name')}</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
        />
      </div>

      {/* Email */}
      <div>
        <label className="label">{t('form.email')}</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="label">{t('form.phone')}</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input"
        />
      </div>

      {/* Sujet */}
      <div>
        <label className="label">{t('form.subject')}</label>
        <select
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="input"
        >
          <option value="">--</option>
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="label">{t('form.message')}</label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="input resize-none"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('form.sending')}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t('form.send')}
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
