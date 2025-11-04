// src/app/api/admin/trips/[tripId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const tripUpdateSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
  program: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ).optional(),
});

interface RouteContext {
  params: { tripId: string }; // Non più una Promise
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    // --- CORREZIONE ---
    const { tripId } = params; // "Scarta" la promise per ottenere l'ID

    const body = await request.json();
    const parsedData = tripUpdateSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  // Destruttura anche il programma
  const { title, country, shortDescription, program } = parsedData.data;
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      title,
      country,
      shortDescription,
      slug,
      program: program || [], // Salva il programma (o un array vuoto se non presente)
    },
  });

  return NextResponse.json(updatedTrip);

  } catch (error) {
    console.error("Errore nell'aggiornamento del viaggio:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    // --- CORREZIONE ---
    const { tripId } = params; // "Scarta" la promise anche qui

    const tripExists = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!tripExists) {
      return NextResponse.json({ error: "Viaggio non trovato" }, { status: 404 });
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Errore nell'eliminazione del viaggio:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}