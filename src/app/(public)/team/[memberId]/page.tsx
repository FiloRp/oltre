// src/app/(public)/team/[memberId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface TeamMemberPageProps {
  params: {
    memberId: string;
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.memberId },
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonna Sinistra: Foto e Info Rapide */}
        <div className="md:col-span-1">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="rounded-lg w-full aspect-square object-cover shadow-lg"
          />
          <h1 className="text-3xl font-bold mt-4">{member.name}</h1>
          <p className="text-xl text-gray-500">{member.role}</p>
        </div>

        {/* Colonna Destra: Biografia */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Chi sono</h2>
          <div className="prose max-w-none text-gray-600">
            {/* Usiamo lo split per trasformare gli a capo in paragrafi */}
            {member.bio?.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* In futuro, qui potremmo mostrare i viaggi che questo coordinatore accompagna */}
        </div>
      </div>
    </div>
  );
}