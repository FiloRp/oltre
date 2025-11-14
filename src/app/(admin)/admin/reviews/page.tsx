// src/app/(admin)/admin/reviews/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Creeremo questo componente tra poco
// import { ReviewActionsCell } from './_components/ReviewActionsCell';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { trip: true }, // Includi il viaggio per mostrare a cosa si riferisce
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Gestione Recensioni</h1>
        <Button asChild>
          <Link href="/admin/reviews/nuova">Aggiungi Recensione</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utente</TableHead>
              <TableHead>Viaggio</TableHead>
              <TableHead>Testo</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.userName}</TableCell>
                <TableCell>{review.trip.title}</TableCell>
                <TableCell className="truncate max-w-xs">{review.reviewText}</TableCell>
                <TableCell className="text-right">
                  {/* Qui andranno le azioni */}
                  <Button variant="ghost" size="sm" asChild><Link href={`/admin/reviews/${review.id}`}>Modifica</Link></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}