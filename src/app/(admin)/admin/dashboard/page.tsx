// src/app/(admin)/dashboard/page.tsx
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowUpRight, BookOpen, Plane, Users } from 'lucide-react';
import { DashboardCharts } from './_components/DashboardCharts'; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Componente riutilizzabile per le card statistiche
function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  // --- QUERY PER LE STATISTICHE ---

  // 1. Numero totale di viaggi pubblicati
  const totalPublishedTrips = await prisma.trip.count({
    where: { status: 'PUBLISHED' },
  });

  // 2. Numero totale di prenotazioni ricevute
  const totalBookings = await prisma.booking.count();

  // 3. Prossime 5 partenze in ordine di data
  const upcomingDepartures = await prisma.departure.findMany({
    where: {
      startDate: {
        gte: new Date(), // "gte" significa "greater than or equal to"
      },
    },
    take: 5,
    orderBy: {
      startDate: 'asc',
    },
    include: {
      trip: true,
      _count: { // Contiamo le prenotazioni per ogni partenza
        select: { bookings: true },
      },
    },
  });

  // 4. Ultime 5 prenotazioni ricevute
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      departure: { include: { trip: true } },
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold">Dashboard</h1>

      {/* Sezione Statistiche */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Viaggi Pubblicati" value={totalPublishedTrips} icon={Plane} />
        <StatCard title="Prenotazioni Totali" value={totalBookings} icon={BookOpen} />
        {/* Potresti aggiungere altre card qui, es. "Clienti Totali" */}
      </div>

      <DashboardCharts />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Sezione Prossime Partenze */}
        <Card>
          <CardHeader>
            <CardTitle>Prossime Partenze</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Viaggio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Posti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingDepartures.map(dep => (
                  <TableRow key={dep.id}>
                    <TableCell>{dep.trip.title}</TableCell>
                    <TableCell>{format(new Date(dep.startDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{dep._count.bookings} / {dep.totalSeats}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {upcomingDepartures.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Nessuna partenza imminente.</p>}
          </CardContent>
        </Card>

        {/* Sezione Ultime Prenotazioni */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ultime Prenotazioni</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/prenotazioni">Vedi tutte</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{booking.contactName}</p>
                  <p className="text-sm text-muted-foreground">{booking.departure.trip.title}</p>
                </div>
                <Link href={`/prenotazioni/${booking.id}`}>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Nessuna prenotazione recente.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}