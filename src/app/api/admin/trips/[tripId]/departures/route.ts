// src/app/api/admin/trips/[tripId]/departures/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema completo per i dati in entrata
const departureSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  price: z.coerce.number().min(0),
  totalSeats: z.coerce.number().int().min(1),
  coordinatorId: z.string().nullable().optional(),
  status: z.enum(["AVAILABLE", "CONFIRMED", "SOLD_OUT", "ARCHIVED"]),
  availableSeats: z.coerce.number().int().nullable().optional(),
});

interface RouteContext {
  params: {
    tripId: string;
  };
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const { tripId } = params;
    const body = await request.json();
    const parsedData = departureSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { startDate, endDate, price, totalSeats, status, coordinatorId, availableSeats  } = parsedData.data;

    const dataToSave = {
      startDate,
      endDate,
      price,
      totalSeats,
      status,
      tripId: tripId,
      coordinatorId: coordinatorId === 'none' ? null : coordinatorId,
      availableSeats
    };

    const newDeparture = await prisma.departure.create({
      data: dataToSave,
    });

    return NextResponse.json(newDeparture, { status: 201 });
  } catch (error) {
    console.error('Errore nella creazione della partenza:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}