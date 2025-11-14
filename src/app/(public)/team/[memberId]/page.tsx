// src/app/(public)/team/[memberId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { TripCard } from '@/components/ui/TripCard';

export const dynamic = 'force-dynamic';

interface TeamMemberPageProps {
  params: {
    memberId: string;
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId },
    include: {
      ledDepartures: {
        where: {
          startDate: { gte: new Date() },
          trip: { status: 'PUBLISHED' },
        },
        include: {
          trip: true,
        },
        orderBy: {
          startDate: 'asc',
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  const uniqueTripsMap = new Map();
  member.ledDepartures.forEach(departure => {
    if (!uniqueTripsMap.has(departure.trip.id)) {
      uniqueTripsMap.set(departure.trip.id, departure.trip);
    }
  });
  const coordinatedTrips = Array.from(uniqueTripsMap.values());

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      {/* SEZIONE PROFILO */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* Colonna Foto */}
        <div className="flex-shrink-0">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="rounded-lg w-48 h-48 md:w-64 md:h-64 object-cover shadow-lg"
          />
        </div>
        {/* Colonna Info */}
        <div className="text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">{member.name}</h1>
          <p className="text-xl text-gray-500 mt-1">{member.role}</p>
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Chi sono</h2>
            <div className="prose max-w-none text-gray-600">
              {member.bio?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE VIAGGI COORDINATI */}
      {coordinatedTrips.length > 0 && (
        <section className="mt-16 border-t pt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Parti con {member.name.split(' ')[0]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coordinatedTrips.map(trip => (
              // Passiamo solo 'trip' perché non abbiamo una partenza specifica qui
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}