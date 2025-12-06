'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProfessionalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profession: '',
    category: '',
    customCategory: '',
    companyName: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    professionalPhone: '',
    professionalEmail: '',
    website: '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'category') {
      setShowCustomCategory(value === 'autre');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'PROFESSIONAL',
          category: showCustomCategory ? formData.customCategory : formData.category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        setLoading(false);
        return;
      }

      router.push('/adhesion/success');
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

      {/* Informations personnelles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Prenom *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Nom *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Telephone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="label">Confirmer mot de passe *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>
      </div>

      {/* Informations professionnelles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Categorie *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Selectionnez une categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Profession *</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Medecin, Avocat, Restaurateur..."
              required
            />
          </div>
        </div>

        {showCustomCategory && (
          <div className="mt-4">
            <label className="label">Votre categorie *</label>
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              className="input"
              placeholder="Precisez votre categorie"
              required
            />
          </div>
        )}

        <div className="mt-4">
          <label className="label">Nom de l entreprise</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="mt-4">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Decrivez votre activite..."
          />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Adresse professionnelle</h3>
        
        <div>
          <label className="label">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Ville *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Code postal *</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact professionnel */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact professionnel (visible dans l annuaire)</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Telephone professionnel</label>
            <input
              type="tel"
              name="professionalPhone"
              value={formData.professionalPhone}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email professionnel</label>
            <input
              type="email"
              name="professionalEmail"
              value={formData.professionalEmail}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Site web</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="input"
            placeholder="https://"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button type="submit" fullWidth isLoading={loading}>
          {loading ? 'Inscription en cours...' : 'Valider mon inscription - 100 EUR'}
        </Button>
        <p className="text-center text-sm text-neutral-500 mt-4">
          En vous inscrivant, vous acceptez nos conditions generales.
        </p>
      </div>
    </form>
  );
}

export default ProfessionalForm;