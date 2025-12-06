import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from '@/components/admin/EventForm';

export const metadata: Metadata = {
  title: 'Nouvel evenement - Admin',
};

export default function NewEventPage() {
  return (
    <section className="section bg-neutral-50 min-h-screen">
      <div className="container-app">
        <Link
          href="/admin/evenements"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Nouvel evenement</h1>
          <div className="card">
            <EventForm />
          </div>
        </div>
      </div>
    </section>
  );
}