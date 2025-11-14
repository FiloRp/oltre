// src/app/(public)/destinazioni/page.tsx
import { prisma } from '@/lib/prisma';
import { TripCard } from '@/components/ui/TripCard';
import { Trip } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DestinazioniPage() {
  // 1. Recupera tutti i viaggi pubblicati che hanno almeno una partenza futura
  const availableTrips = await prisma.trip.findMany({
    where: {
      status: 'PUBLISHED',
      departures: {
        some: {
          startDate: { gte: new Date() },
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  });

  // 2. Raggruppa i viaggi per paese usando una funzione reduce
  const tripsByCountry = availableTrips.reduce((acc, trip) => {
    const country = trip.country;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(trip);
    return acc;
  }, {} as Record<string, Trip[]>);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Tutte le Nostre Destinazioni</h1>
        <p className="mt-2 text-lg text-gray-600">Scopri l'avventura che fa per te.</p>
      </div>

      {Object.keys(tripsByCountry).length > 0 ? (
        <div className="space-y-12">
          {/* 3. Itera sui paesi raggruppati */}
          {Object.entries(tripsByCountry).map(([country, trips]) => (
            <section key={country}>
              <h2 className="text-3xl font-bold mb-6 border-b pb-2">{country}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 4. Itera sui viaggi di quel paese e renderizza le card */}
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Al momento non ci sono viaggi in programma.</p>
          <p className="mt-2 text-gray-500">Torna a trovarci presto!</p>
        </div>
      )}
    </div>
  );
}