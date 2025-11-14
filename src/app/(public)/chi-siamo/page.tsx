// src/app/(public)/chi-siamo/page.tsx
import { prisma } from '@/lib/prisma';
import { TeamMember } from '@prisma/client';

// Creiamo un componente riutilizzabile per la card del membro del team
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="text-center">
      <div className="relative w-40 h-40 mx-auto mb-4">
        <img
          src={member.photoUrl}
          alt={member.name}
          className="rounded-full w-full h-full object-cover shadow-lg"
        />
      </div>
      <h3 className="text-xl font-bold">{member.name}</h3>
      <p className="text-md text-gray-500">{member.role}</p>
      {/* In futuro, potremmo rendere questa card un link alla pagina di dettaglio del membro */}
    </div>
  );
}

export default async function ChiSiamoPage() {
  // Recupera tutti i membri del team dal database
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div>
      {/* Sezione Introduttiva */}
      <section className="bg-gray-50 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold">Chi Siamo</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Oltre non è solo un'agenzia di viaggi. È un'idea, una passione condivisa per l'esplorazione autentica e la scoperta di angoli di mondo che ancora sanno sorprendere. Nasciamo dalla voglia di creare esperienze che lascino il segno, connettendo persone, culture e storie.
          </p>
        </div>
      </section>

      {/* Sezione Team */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Il Nostro Team</h2>
            <p className="mt-2 text-gray-600">Le guide e le menti dietro le nostre avventure.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}