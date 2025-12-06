'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';

interface AccountContentProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    role: string;
    status: string;
    profile: {
      profession: string;
      companyName: string | null;
      description: string | null;
      address: string | null;
      city: string | null;
      postalCode: string | null;
      professionalPhone: string | null;
      professionalEmail: string | null;
      website: string | null;
      isPublished: boolean;
    } | null;
  };
}

export function AccountContent({ user }: AccountContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    profession: user.profile?.profession || '',
    companyName: user.profile?.companyName || '',
    description: user.profile?.description || '',
    proAddress: user.profile?.address || '',
    proCity: user.profile?.city || '',
    proPostalCode: user.profile?.postalCode || '',
    professionalPhone: user.profile?.professionalPhone || '',
    professionalEmail: user.profile?.professionalEmail || '',
    website: user.profile?.website || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          profile: user.profile ? {
            profession: formData.profession,
            companyName: formData.companyName,
            description: formData.description,
            address: formData.proAddress,
            city: formData.proCity,
            postalCode: formData.proPostalCode,
            professionalPhone: formData.professionalPhone,
            professionalEmail: formData.professionalEmail,
            website: formData.website,
          } : null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Statut */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              user.role === 'PROFESSIONAL'
                ? 'bg-primary-100 text-primary-600'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {user.role === 'PROFESSIONAL' ? 'Professionnel' : 'Membre'}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              user.status === 'ACTIVE'
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {user.status === 'ACTIVE' ? 'Actif' : 'En attente'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
            Modifications enregistrees !
          </div>
        )}

        {/* Infos personnelles */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold">Informations personnelles</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prenom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Email</label>
            <input
              type="email"
              value={user.email}
              className="input bg-neutral-100"
              disabled
            />
            <p className="text-xs text-neutral-500 mt-1">L email ne peut pas etre modifie</p>
          </div>

          <div className="mt-4">
            <label className="label">Telephone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="mt-4">
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
              <label className="label">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Code postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Infos pro (si professionnel) */}
        {user.profile && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold">Informations professionnelles</h2>
              {user.profile.isPublished ? (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Publie</span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">En attente</span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Entreprise</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[100px]"
              />
            </div>

            <div className="mt-4">
              <label className="label">Adresse professionnelle</label>
              <input
                type="text"
                name="proAddress"
                value={formData.proAddress}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Ville</label>
                <input
                  type="text"
                  name="proCity"
                  value={formData.proCity}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Code postal</label>
                <input
                  type="text"
                  name="proPostalCode"
                  value={formData.proPostalCode}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Telephone pro</label>
                <input
                  type="tel"
                  name="professionalPhone"
                  value={formData.professionalPhone}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email pro</label>
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
        )}

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading}>
            Enregistrer
          </Button>
          <Button type="button" variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Deconnexion
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AccountContent;