// src/app/api/admin/departures/[departureId]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema completo, identico a quello della creazione
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
    departureId: string;
  };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const body = await request.json();
    const parsedData = departureSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }
    
    const { startDate, endDate, price, totalSeats, status, coordinatorId, availableSeats } = parsedData.data;

    const dataToSave = {
      startDate,
      endDate,
      price,
      totalSeats,
      status,
      coordinatorId: coordinatorId === 'none' ? null : coordinatorId,
      availableSeats,
    };

    const updatedDeparture = await prisma.departure.update({
      where: { id: params.departureId },
      data: dataToSave,
    });
    return NextResponse.json(updatedDeparture);

  } catch (error) {
    console.error(`Errore nell'aggiornamento della partenza ${params.departureId}:`, error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    await prisma.departure.delete({
      where: { id: params.departureId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Errore nell'eliminazione della partenza ${params.departureId}:`, error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}