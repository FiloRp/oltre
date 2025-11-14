// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend'; 

const resend = new Resend(process.env.RESEND_API_KEY);

// Schema di validazione complesso che rispecchia il nostro form
const bookingSchema = z.object({
  departureId: z.string(),
  contactName: z.string().min(3),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  billingAddress: z.string().min(5),
  billingZipCode: z.string().min(3),
  billingCity: z.string().min(2),
  billingProvince: z.string().min(2),
  billingCountry: z.string().min(2),
  billingFiscalCode: z.string().min(11),
  isAgency: z.boolean(),
  agencyDetails: z.any().optional(),
  specialRequests: z.string().optional(),
  totalAmount: z.number(),
  passengers: z.array(z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    birthDate: z.coerce.date(),
    nationality: z.string().min(2),
    fiscalCode: z.string().optional(),
    hasExtraInsurance: z.boolean(),
  })).min(1, "Deve esserci almeno un passeggero"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = bookingSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error }, { status: 400 });
    }

    const { passengers, ...bookingData } = parsedData.data;

    // Usiamo una transazione per garantire l'integrità dei dati:
    // o vengono create sia la prenotazione che i passeggeri, o non viene creato nulla.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Trova o crea l'utente basandosi sull'email di contatto
      const user = await tx.user.upsert({
        where: { email: bookingData.contactEmail },
        update: {},
        create: {
          email: bookingData.contactEmail,
          name: bookingData.contactName,
          password: '', // Password vuota per utenti "guest"
        },
      });

      // 2. Crea la prenotazione e collegala all'utente
      const newBooking = await tx.booking.create({
        data: {
          ...bookingData,
          userId: user.id,
        },
      });

      // 3. Crea tutti i passeggeri e collegali alla nuova prenotazione
      await tx.passenger.createMany({
        data: passengers.map(p => ({
          ...p,
          bookingId: newBooking.id,
        })),
      });

      return newBooking;
    });

    try {
      await resend.emails.send({
        from: 'Oltre Viaggi <noreply@tuodominio.com>', // Usa un'email del tuo dominio verificato
        to: [result.contactEmail],
        subject: 'La tua prenotazione è stata confermata!',
        html: `<h1>Grazie per la tua prenotazione, ${result.contactName}!</h1><p>Abbiamo ricevuto la tua richiesta per il viaggio. A breve ti contatteremo con i dettagli per il pagamento e il contratto di viaggio.</p><p>ID Prenotazione: ${result.id}</p>`,
      });
    } catch (emailError) {
      console.error("Errore nell'invio dell'email:", emailError);
      // Non bloccare la risposta all'utente se l'email fallisce, ma logga l'errore
    }

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Errore nella creazione della prenotazione:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}