import { prisma } from '@/lib/prisma';
import { NuovoViaggioClientPage } from './_components/NuovoViaggioClientPage';

export const dynamic = 'force-dynamic';

export default async function NuovoViaggioPage() {
  // Carica la lista dei membri del team sul server
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { name: 'asc' },
  });

  // Passa la lista al componente client
  return <NuovoViaggioClientPage teamMembers={teamMembers} />;
}