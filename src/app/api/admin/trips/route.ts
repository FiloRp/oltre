// src/app/api/trips/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Schema di validazione con Zod per i dati in entrata
const tripSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const body = await request.json();
    const parsedData = tripSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error }, { status: 400 });
    }

    const { title, country, shortDescription } = parsedData.data;

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const newTrip = await prisma.trip.create({
      data: {
        title,
        country,
        shortDescription,
        slug,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });

  } catch (error) {
    console.error("Errore nella creazione del viaggio:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}