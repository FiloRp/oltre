// src/app/api/admin/team/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const teamMemberSchema = z.object({
  name: z.string().min(3, 'Il nome è richiesto'),
  role: z.string().min(3, 'Il ruolo è richiesto'),
  photoUrl: z.string().url('Deve essere un URL valido'),
  bio: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const body = await request.json();
  const parsedData = teamMemberSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  const newMember = await prisma.teamMember.create({ data: parsedData.data });
  return NextResponse.json(newMember, { status: 201 });
}