import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { EventActions } from '@/components/admin/EventActions';

export const metadata: Metadata = {
  title: 'Evenements - Admin',
};

async function getEvents() {
  try {
    const events = await (prisma as any).event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return events;
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="section bg-neutral-50 min-h-screen">
      <div className="container-app">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Evenements</h1>
            <p className="text-neutral-600">{events.length} evenement(s)</p>
          </div>
          <Link
            href="/admin/evenements/nouveau"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un evenement
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">Aucun evenement pour le moment</p>
            <Link href="/admin/evenements/nouveau" className="btn-primary">
              Creer le premier evenement
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event: any) => (
              <div key={event.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {event.imageUrl1 ? (
                      <img
                        src={event.imageUrl1}
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : event.documentUrl ? (
                      <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-500 font-bold text-xs">PDF</span>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-neutral-300" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {event.description && (
                        <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                        <span>{event.type === 'DOCUMENT' ? 'Document' : 'Galerie'}</span>
                        {event.eventDate && (
                          <span>{new Date(event.eventDate).toLocaleDateString('fr-FR')}</span>
                        )}
                        {event.location && <span>{event.location}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.isPublished
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {event.isPublished ? 'Publie' : 'Brouillon'}
                    </span>
                    <EventActions event={event} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}