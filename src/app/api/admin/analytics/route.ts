// src/app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  try {
     const popularTripsData = await prisma.booking.groupBy({
      by: ['departureId'],
      _count: { _all: true },
    });

    const departures = await prisma.departure.findMany({
      where: { id: { in: popularTripsData.map(d => d.departureId) } },
      include: { trip: true },
    });

    const tripsMap = departures.reduce((acc, dep) => {
      const tripTitle = dep.trip.title;
      const bookingCount = popularTripsData.find(d => d.departureId === dep.id)?._count._all || 0;
      if (!acc[tripTitle]) {
        acc[tripTitle] = 0;
      }
      acc[tripTitle] += bookingCount;
      return acc;
    }, {} as Record<string, number>);

    // 1. Dati per "Andamento Prenotazioni"
    const bookingsOverTime = await prisma.booking.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      orderBy: { createdAt: 'asc' },
    });

    // Processiamo i dati per raggrupparli per mese
    const bookingsByMonth = bookingsOverTime.reduce((acc, booking) => {
      const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {} as Record<string, number>);

    const bookingsChartData = Object.entries(bookingsByMonth).map(([date, count]) => ({
      date,
      "Numero di Prenotazioni": count,
    }));

    // 2. Dati per "Viaggi più Popolari"
    const popularTrips = await prisma.trip.findMany({
      include: {
        _count: {
          select: { departures: { where: { bookings: { some: {} } } } },
        },
      },
      orderBy: {
        departures: { _count: 'desc' },
      },
      take: 5,
    });

    const popularTripsChartData = Object.entries(tripsMap)
      .map(([name, count]) => ({ name, "Numero di Prenotazioni": count }))
      .sort((a, b) => b["Numero di Prenotazioni"] - a["Numero di Prenotazioni"])
      .slice(0, 5);

    // 3. Dati per "Fatturato per Mese"
    const confirmedBookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' }, // Consideriamo solo le prenotazioni confermate
      select: { createdAt: true, totalAmount: true },
    });

    const revenueByMonth = confirmedBookings.reduce((acc, booking) => {
      const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += booking.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const revenueChartData = Object.entries(revenueByMonth).map(([date, total]) => ({
      date,
      "Fatturato": total,
    }));

    return NextResponse.json({
      bookingsChartData,
      popularTripsChartData,
      revenueChartData,
    });

  } catch (error) {
    console.error('Errore nel recupero dei dati analitici:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}