// src/app/api/admin/reviews/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const reviewSchema = z.object({
  tripId: z.string().cuid('ID del viaggio non valido'),
  userName: z.string().min(2, 'Il nome utente è richiesto'),
  reviewText: z.string().min(10, 'Il testo della recensione è troppo corto'),
  rating: z.number().min(1).max(5),
  isFeatured: z.boolean().default(false),
  userPhotoUrl: z.string().url("URL foto non valido").or(z.literal("")).optional().nullable(),
  trustpilotUrl: z.string().url("URL Trustpilot non valido").or(z.literal("")).optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const body = await request.json();
  const parsedData = reviewSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  const newReview = await prisma.review.create({ data: parsedData.data });
  return NextResponse.json(newReview, { status: 201 });
}