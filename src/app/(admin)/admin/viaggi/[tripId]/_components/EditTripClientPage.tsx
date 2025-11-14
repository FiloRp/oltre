// src/app/(admin)/admin/viaggi/[tripId]/_components/EditTripClientPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trip, Departure, TeamMember } from "@prisma/client";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TripForm, formSchema, TripFormValues } from "../../_components/TripForm";
import { DeparturesManager } from "../../_components/DeparturesManager";

interface FullTrip extends Trip {
  departures: Departure[];
}

interface EditTripClientPageProps {
  tripJson: string;
  teamMembers: TeamMember[];
}

export function EditTripClientPage({ tripJson, teamMembers }: EditTripClientPageProps) {
  const trip: FullTrip = JSON.parse(tripJson);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<TripFormValues>,
    // I defaultValues vengono impostati qui, una sola volta
  });

  // Usiamo useEffect per popolare/aggiornare il form quando 'trip' cambia
  useEffect(() => {
    form.reset({
      title: trip?.title || "",
      country: trip?.country || "",
      shortDescription: trip?.shortDescription || "",
      program: trip?.program ? JSON.parse(trip.program as any) : [],
      status: trip?.status || "DRAFT",
      includes: trip?.includes || "",
      notIncludes: trip?.notIncludes || "",
      faq: trip?.faq ? JSON.parse(trip.faq as any) : [],
      galleryImages: trip?.galleryImages || [],
      heroImage: trip?.heroImage || null,
      mapLatitude: trip?.mapLatitude || null,
      mapLongitude: trip?.mapLongitude || null,
    });
  }, [tripJson, form]); // Dipende da tripJson

  const handleSave: SubmitHandler<TripFormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Aggiornamento fallito.');
      router.push('/admin/viaggi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
        <TripForm formControl={form.control} formSetValue={form.setValue} />
        
        {/* Il pulsante di salvataggio del viaggio rimane qui */}
        <div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvataggio..." : "Salva Modifiche Viaggio"}
          </Button>
        </div>
      </form>

      {/* --- MODIFICA CHIAVE --- */}
      {/* DeparturesManager ora è un "fratello" del form, non un figlio */}
      <div className="mt-8">
        <DeparturesManager tripId={trip.id} initialDepartures={trip.departures} teamMembers={teamMembers} />
      </div>
    </Form>
  );
}