// src/app/(admin)/admin/reviews/nuova/_components/NuovaRecensioneClientPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@prisma/client";
import { ReviewForm, ReviewFormValues } from "../../_components/ReviewForm";

interface NuovaRecensioneClientPageProps {
  trips: Trip[];
}

export function NuovaRecensioneClientPage({ trips }: NuovaRecensioneClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (values: ReviewFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Creazione fallita.');
      router.push('/admin/reviews');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Aggiungi Nuova Recensione</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ReviewForm trips={trips} onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}