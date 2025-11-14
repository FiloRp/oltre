// src/app/api/admin/upload/delete/route.ts
import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL mancante' }, { status: 400 });
    }

    // La funzione 'del' di @vercel/blob elimina il file fisico
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore nell'eliminazione dal blob:", error);
    return NextResponse.json({ error: 'Eliminazione dal blob fallita' }, { status: 500 });
  }
}