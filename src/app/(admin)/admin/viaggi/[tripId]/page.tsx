// src/app/(admin)/admin/viaggi/[tripId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditTripClientPage } from './_components/EditTripClientPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EditTripPageProps {
  params: { tripId: string };
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const { tripId } = params;

  const [trip, teamMembers] = await Promise.all([
    prisma.trip.findUnique({
      where: { id: tripId },
      include: { 
        departures: { orderBy: { startDate: 'asc' } },
        ledBy: true, // Includi i coordinatori già associati a questo viaggio
      },
    }),
    prisma.teamMember.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!trip) {
    notFound();
  }

  const tripJson = JSON.stringify(trip);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-6">Modifica Viaggio</h1>
      <EditTripClientPage tripJson={tripJson} teamMembers={teamMembers} />
    </div>
  );
}