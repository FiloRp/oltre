"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TripForm } from "../_components/TripForm";

export default function NuovoViaggioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (values: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Qualcosa è andato storto.');

      router.push('/viaggi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crea un Nuovo Viaggio</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TripForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}