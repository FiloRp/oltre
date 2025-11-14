// src/app/(admin)/prenotazioni/[bookingId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BookingDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

// Funzione helper per formattare le date in modo sicuro
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd/MM/yyyy');
  };

// Helper component per mostrare i dati in modo pulito
function InfoField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold">{value || 'N/A'}</p>
    </div>
  );
}

export default async function BookingDetailPage({ params: paramsPromise }: BookingDetailPageProps) {
  const { bookingId } = await paramsPromise;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      departure: { include: { trip: true } },
      passengers: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Dettaglio Prenotazione #{booking.id.substring(0, 8)}</h1>
        <p className="text-gray-500">Ricevuta il {format(new Date(booking.createdAt), 'dd MMMM yyyy, HH:mm')}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Riepilogo</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoField label="Viaggio" value={booking.departure.trip.title} />
          <InfoField label="Partenza" value={formatDate(booking.departure.startDate)} />
          <InfoField label="Importo Totale" value={`€${booking.totalAmount}`} />
          <InfoField label="Stato" value={booking.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dati Referente e Fatturazione</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoField label="Nome Contatto" value={booking.contactName} />
          <InfoField label="Email" value={booking.contactEmail} />
          <InfoField label="Telefono" value={booking.contactPhone} />
          <InfoField label="Indirizzo" value={booking.billingAddress} />
          <InfoField label="Città" value={`${booking.billingCity} (${booking.billingProvince}), ${booking.billingZipCode}`} />
          <InfoField label="Codice Fiscale" value={booking.billingFiscalCode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Passeggeri ({booking.passengers.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Cognome</TableHead><TableHead>Data di Nascita</TableHead><TableHead>Documento</TableHead></TableRow></TableHeader>
            <TableBody>
              {booking.passengers.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.lastName}</TableCell>
                  <TableCell>{format(new Date(p.birthDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {p.documentPhotoUrl ? (
                      <a href={p.documentPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visualizza
                      </a>
                    ) : 'Non caricato'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}