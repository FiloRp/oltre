// src/app/(admin)/team/[memberId]/_components/EditTeamMemberClientPage.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamMember } from '@prisma/client';
import { TeamMemberForm, TeamMemberFormValues } from '../../_components/TeamMemberForm';
import { z } from 'zod';

interface EditTeamMemberClientPageProps {
  member: TeamMember;
}

export function EditTeamMemberClientPage({ member }: EditTeamMemberClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (values: TeamMemberFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Aggiornamento fallito.');
      router.push('/admin/team');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TeamMemberForm initialData={member} onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}