// src/app/(admin)/prenotazioni/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PrenotazioniPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      departure: {
        include: {
          trip: true, // Includi i dati del viaggio
        },
      },
      passengers: true, // Includi i passeggeri per contare quanti sono
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestione Prenotazioni</h1>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Viaggio</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Referente</TableHead>
              <TableHead>N° Passeggeri</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.departure.trip.title}</TableCell>
                <TableCell>
                  {format(new Date(booking.departure.startDate), "dd/MM/yy")} - {format(new Date(booking.departure.endDate), "dd/MM/yy")}
                </TableCell>
                <TableCell>{booking.contactName}</TableCell>
                <TableCell>{booking.passengers.length}</TableCell>
                <TableCell>
                  <Badge>{booking.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/prenotazioni/${booking.id}`}>Vedi Dettagli</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessuna prenotazione ricevuta.</p>
        </div>
      )}
    </div>
  );
}