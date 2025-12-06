'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { FileUpload } from '@/components/ui/FileUpload';

export function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState<'GALLERY' | 'DOCUMENT'>('GALLERY');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentUrl: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    eventDate: '',
    location: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (field: string, url: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (type === 'DOCUMENT' && !formData.documentUrl) {
      setError('Veuillez telecharger un document');
      setLoading(false);
      return;
    }

    if (type === 'GALLERY' && !formData.imageUrl1) {
      setError('Veuillez telecharger au moins une image');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      });

      if (!res.ok) {
        setError('Erreur lors de la creation');
        setLoading(false);
        return;
      }

      router.push('/admin/evenements');
      router.refresh();
    } catch (err) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl text-accent-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="label">Titre *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Type de contenu</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType('GALLERY')}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              type === 'GALLERY'
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <p className="font-medium">Galerie photos</p>
            <p className="text-sm text-neutral-500">Max 3 images + texte</p>
          </button>
          <button
            type="button"
            onClick={() => setType('DOCUMENT')}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              type === 'DOCUMENT'
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <p className="font-medium">Document</p>
            <p className="text-sm text-neutral-500">PDF ou image seul</p>
          </button>
        </div>
      </div>

      {type === 'DOCUMENT' ? (
        <FileUpload
          label="Document (PDF ou image) *"
          accept="application/pdf,image/*"
          currentUrl={formData.documentUrl}
          onUpload={(url) => handleFileUpload('documentUrl', url)}
        />
      ) : (
        <div className="space-y-4">
          <FileUpload
            label="Image 1 *"
            accept="image/*"
            currentUrl={formData.imageUrl1}
            onUpload={(url) => handleFileUpload('imageUrl1', url)}
          />
          <FileUpload
            label="Image 2 (optionnel)"
            accept="image/*"
            currentUrl={formData.imageUrl2}
            onUpload={(url) => handleFileUpload('imageUrl2', url)}
          />
          <FileUpload
            label="Image 3 (optionnel)"
            accept="image/*"
            currentUrl={formData.imageUrl3}
            onUpload={(url) => handleFileUpload('imageUrl3', url)}
          />
        </div>
      )}

      <div>
        <label className="label">Description (max 1000 caracteres)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input min-h-[120px]"
          maxLength={1000}
        />
        <p className="text-xs text-neutral-500 mt-1">
          {formData.description.length}/1000 caracteres
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Date de l evenement</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Lieu</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input"
            placeholder="Lyon, Decines..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={loading}>
          Creer l evenement
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/evenements')}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

export default EventForm;