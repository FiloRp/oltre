// src/app/api/admin/team/[memberId]/route.ts
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

interface RouteContext {
  params: Promise<{ memberId: string }>;
}

export async function PATCH(request: Request, { params: paramsPromise }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const { memberId } = await paramsPromise;
  const body = await request.json();
  const parsedData = teamMemberSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  const updatedMember = await prisma.teamMember.update({
    where: { id: memberId },
    data: parsedData.data,
  });
  return NextResponse.json(updatedMember);
}

export async function DELETE(request: Request, { params: paramsPromise }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const { memberId } = await paramsPromise;
  await prisma.teamMember.delete({ where: { id: memberId } });
  return new NextResponse(null, { status: 204 });
}