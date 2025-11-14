// src/app/(admin)/admin/reviews/[reviewId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditRecensioneClientPage } from './_components/EditRecensioneClientPage';

export const dynamic = 'force-dynamic';

interface EditRecensionePageProps {
  params: {
    reviewId: string;
  };
}

export default async function EditRecensionePage({ params }: EditRecensionePageProps) {
  // Eseguiamo le query in parallelo per efficienza
  const [review, trips] = await Promise.all([
    prisma.review.findUnique({ where: { id: params.reviewId } }),
    prisma.trip.findMany({ orderBy: { title: 'asc' } }),
  ]);

  if (!review) {
    notFound();
  }

  return <EditRecensioneClientPage review={review} trips={trips} />;
}