// src/app/api/admin/trips/[tripId]/departures/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


interface RouteContext {
    params: Promise<{ tripId: string }>;
}

export async function POST(request: Request, { params: paramsPromise }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const departureSchema = z.object({
          startDate: z.coerce.date(),
          endDate: z.coerce.date(),
          price: z.coerce.number().min(0, 'Il prezzo non può essere negativo'),
          totalSeats: z.coerce.number().int().min(1, 'Ci deve essere almeno un posto'),
          coordinatorId: z.string().nullable().optional(),
        });
        
        const { tripId } = await paramsPromise;
        const body = await request.json();
        const parsedData = departureSchema.safeParse(body);
        
        if (!parsedData.success) {
        return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const dataToSave = {
            startDate: parsedData.data.startDate,
            endDate: parsedData.data.endDate,
            price: parsedData.data.price,
            totalSeats: parsedData.data.totalSeats,
            tripId: tripId,
            // Se coordinatorId è una stringa vuota, "none", null o undefined, salvalo come null.
            // Altrimenti, usa il valore.
            coordinatorId: parsedData.data.coordinatorId && parsedData.data.coordinatorId !== 'none' ? parsedData.data.coordinatorId : null,
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