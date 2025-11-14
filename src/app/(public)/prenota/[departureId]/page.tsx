// src/app/(public)/prenota/[departureId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BookingForm } from './_components/BookingForm';

export const dynamic = 'force-dynamic';

interface PrenotaPageProps {
  // La prop in ingresso è una Promise
  params: Promise<{ departureId: string }>;
}

export default async function PrenotaPage({ params: paramsPromise }: PrenotaPageProps) {
  // 1. "Scarta" la promessa per ottenere l'oggetto params reale
  const { departureId } = await paramsPromise;

  // 2. Ora puoi usare departureId come un valore normale
  const departure = await prisma.departure.findUnique({
    where: { id: departureId },
    include: {
      trip: true,
    },
  });

  if (!departure) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <p className="text-sm text-gray-500">Stai prenotando:</p>
        <h1 className="font-heading text-4xl font-bold">{departure.trip.title}</h1>
        <p className="text-lg text-gray-600">Partenza del {new Date(departure.startDate).toLocaleDateString('it-IT')}</p>
      </div>
      
      <BookingForm departure={departure} />
    </div>
  );
}