'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  locale: string;
}

export default function NewsletterSubscribeButton({ locale }: Props) {
  const isRTL = locale === 'ar';
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '' });
      } else {
        setError(data.error || (isRTL ? 'حدث خطأ' : 'Une erreur est survenue'));
      }
    } catch {
      setError(isRTL ? 'خطأ في الاتصال' : 'Erreur de connexion');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 text-green-600">
        <CheckCircle className="w-5 h-5" />
        <span>{isRTL ? 'تم التسجيل بنجاح!' : 'Inscription réussie!'}</span>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Mail className="w-5 h-5" />
        {isRTL ? 'اشترك الآن' : 'S\'inscrire maintenant'}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder={isRTL ? 'الاسم الأول' : 'Prénom'}
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="input"
        />
        <input
          type="text"
          required
          placeholder={isRTL ? 'اسم العائلة' : 'Nom'}
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="input"
        />
      </div>
      <input
        type="email"
        required
        placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="btn-secondary flex-1"
        >
          {isRTL ? 'إلغاء' : 'Annuler'}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {isRTL ? 'اشتراك' : 'S\'inscrire'}
        </button>
      </div>
    </form>
  );
}
