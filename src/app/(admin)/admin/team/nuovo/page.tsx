// src/app/(admin)/team/nuovo/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamMemberForm, TeamMemberFormValues } from '../_components/TeamMemberForm';

export default function NuovoMembroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (values: TeamMemberFormValues) => { 
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Creazione fallita.');
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
      <h1 className="text-3xl font-bold mb-6">Aggiungi Nuovo Membro</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TeamMemberForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}