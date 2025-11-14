// src/app/api/admin/trips/[tripId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Schema di validazione unico e completo per l'aggiornamento
const tripUpdateSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  includes: z.string().optional(),
  notIncludes: z.string().optional(),
  program: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  galleryImages: z.array(z.string()).optional(),
  heroImage: z.string().url().nullable().optional(),
  mapLatitude: z.coerce.number().nullable().optional(),
  mapLongitude: z.coerce.number().nullable().optional(),
  // ledByIds: z.array(z.string()).optional(),
});

// Interfaccia standard per i parametri della rotta
interface RouteContext {
  params: {
    tripId: string;
  };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  console.log(`--- INIZIO RICHIESTA PATCH per tripId: ${params.tripId} ---`);
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      console.log("Errore: Non autorizzato.");
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }
    console.log("1. Autorizzazione OK.");

    const body = await request.json();
    console.log("2. Corpo della richiesta ricevuto:", body);

    const parsedData = tripUpdateSchema.safeParse(body);

    if (!parsedData.success) {
      console.log("3. ERRORE: Validazione Zod fallita.");
      console.error(parsedData.error); // Stampa l'errore dettagliato di Zod
      return NextResponse.json({ error: parsedData.error }, { status: 400 });
    }
    console.log("3. Validazione Zod OK. Dati validati:", parsedData.data);

    const { title, country, shortDescription, program, status, includes, notIncludes, faq, galleryImages, heroImage, mapLatitude, mapLongitude, /* ledByIds */ } = parsedData.data;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    console.log(`4. Tentativo di aggiornamento su Prisma con status: "${status}"`);

    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: {
        title,
        country,
        shortDescription,
        slug,
        program: JSON.stringify(program || []),
        status,
        includes,
        notIncludes,
        faq: JSON.stringify(faq || []),
        galleryImages: galleryImages || [],
        heroImage,
        mapLatitude,
        mapLongitude,
        // ledBy: {
        //   set: ledByIds?.map(id => ({ id })) || [],
        // },
      },
    });

    console.log("5. Aggiornamento Prisma OK.");
    return NextResponse.json(updatedTrip);

  } catch (error) {
    console.log("--- ERRORE CATTURATO NEL BLOCCO CATCH ---");
    console.error(error); // Stampa l'errore completo che causa il 500
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

// --- FUNZIONE DELETE CORRETTA ---
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const { tripId } = params; // params è un oggetto, non una Promise

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Errore nell'eliminazione del viaggio:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}