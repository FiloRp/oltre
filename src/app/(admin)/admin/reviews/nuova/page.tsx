// src/app/(admin)/admin/reviews/nuova/page.tsx
import { prisma } from '@/lib/prisma';
import { NuovaRecensioneClientPage } from './_components/NuovaRecensioneClientPage';

export const dynamic = 'force-dynamic';

export default async function NuovaRecensionePage() {
  // Carica la lista di tutti i viaggi per il menu a tendina
  const trips = await prisma.trip.findMany({
    orderBy: { title: 'asc' },
  });

  return <NuovaRecensioneClientPage trips={trips} />;
}