// src/app/(admin)/team/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// --- IMPORTA IL NUOVO COMPONENTE ---
import { TeamMemberActionsCell } from './_components/TeamMemberActionsCell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestione Team</h1>
        <Button asChild>
          <Link href="/admin/team/nuovo">Aggiungi Membro</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <img src={member.photoUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  {/* --- SOSTITUISCI IL PULSANTE CON QUESTO --- */}
                  <TeamMemberActionsCell memberId={member.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}