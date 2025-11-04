// src/app/(admin)/viaggi/[tripId]/_components/EditTripClientPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@prisma/client";
import { TripForm } from "../../_components/TripForm";

interface EditTripClientPageProps {
  trip: Trip;
}

export function EditTripClientPage({ trip }: EditTripClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (values: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PATCH', // Usiamo PATCH per aggiornamenti parziali
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Aggiornamento fallito.');

      router.push('/viaggi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TripForm initialData={trip} onSave={handleSave} isLoading={isLoading} />
    </>
  );
}