// src/app/api/admin/settings/carousel/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const schema = z.object({
  images: z.array(z.object({ imageUrl: z.string().url() })),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const body = await request.json();
  const parsedData = schema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Cancella tutte le immagini esistenti
      await tx.homeCarouselImage.deleteMany();
      // 2. Crea le nuove immagini con il nuovo ordine
      await tx.homeCarouselImage.createMany({
        data: parsedData.data.images.map((image, index) => ({
          imageUrl: image.imageUrl,
          order: index,
        })),
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 });
  }
}