// src/app/(public)/page.tsx
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TripCard } from '@/components/ui/TripCard';
import { HeroCarousel } from '@/components/ui/HeroCarousel';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // --- NUOVA QUERY: ORA CERCHIAMO LE PARTENZE ---
  const allUpcomingDepartures = await prisma.departure.findMany({
    where: {
      startDate: { gte: new Date() },
      trip: {
        status: 'PUBLISHED',
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    include: {
      trip: true,
      coordinator: true,
    },
  });

  // 2. Raggruppa le partenze per viaggio e tieni solo la prima (la più vicina)
  const uniqueTripsMap = new Map();
  allUpcomingDepartures.forEach(departure => {
    if (!uniqueTripsMap.has(departure.tripId)) {
      uniqueTripsMap.set(departure.tripId, departure);
    }
  });

  // 3. Converti la mappa in un array e prendi i primi 3
  const upcomingDepartures = Array.from(uniqueTripsMap.values()).slice(0, 3);

  const carouselImages = await prisma.homeCarouselImage.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <HeroCarousel images={carouselImages} />

      <section className="py-16">
        <div className="container">
          {/* Titolo della sezione aggiornato */}
          <h2 className="text-3xl font-bold text-center mb-8">Prossime Partenze</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ora passiamo l'intero oggetto 'departure' alla TripCard */}
            {upcomingDepartures.map(departure => (
              <TripCard key={departure.id} departure={departure} trip={departure.trip} />
            ))}
          </div>

          {upcomingDepartures.length === 0 && (
            <p className="text-center text-gray-500 mt-8">Nessuna partenza in programma. Torna a trovarci presto!</p>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/destinazioni">Vedi tutti i viaggi</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}