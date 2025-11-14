// src/app/(admin)/team/[memberId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditTeamMemberClientPage } from './_components/EditTeamMemberClientPage';

interface EditTeamMemberPageProps {
  params: Promise<{ memberId: string }>;
}

export default async function EditTeamMemberPage({ params: paramsPromise }: EditTeamMemberPageProps) {
  const { memberId } = await paramsPromise;
  const member = await prisma.teamMember.findUnique({ where: { id: memberId } });

  if (!member) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modifica Membro del Team</h1>
      <EditTeamMemberClientPage member={member} />
    </div>
  );
}