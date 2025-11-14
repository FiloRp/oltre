// src/app/(admin)/admin/viaggi/nuovo/_components/NuovoViaggioClientPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TripForm, formSchema, TripFormValues } from "../../_components/TripForm";
import { TeamMember } from "@prisma/client"; // Importa il tipo

interface NuovoViaggioClientPageProps {
  teamMembers: TeamMember[]; // Accetta la lista come prop
}

export function NuovoViaggioClientPage({ teamMembers }: NuovoViaggioClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<TripFormValues>,
    defaultValues: {
      title: "",
      country: "",
      shortDescription: "",
      status: "DRAFT",
      includes: "",
      notIncludes: "",
      program: [],
      faq: [],
      galleryImages: [],
      heroImage: null,
      mapLatitude: null,
      mapLongitude: null,
    //   ledByIds: [], // Aggiungi il default value
    },
  });

  const handleSave: SubmitHandler<TripFormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Creazione fallita.');
      router.push('/admin/viaggi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crea Nuovo Viaggio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          {/* Passa la lista dei team members al form */}
          <TripForm formControl={form.control} formSetValue={form.setValue} /* teamMembers={teamMembers} *//>
          <div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvataggio in corso..." : "Crea Viaggio"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}