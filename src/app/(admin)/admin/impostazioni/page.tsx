// src/app/(admin)/admin/impostazioni/page.tsx
import { prisma } from '@/lib/prisma';
import { CarouselManager } from './_components/CarouselManager';

export const dynamic = 'force-dynamic';

export default async function ImpostazioniPage() {
  const carouselImages = await prisma.homeCarouselImage.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Impostazioni Sito</h1>
      <CarouselManager initialImages={carouselImages} />
    </div>
  );
}