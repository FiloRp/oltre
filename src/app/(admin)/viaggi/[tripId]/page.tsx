// src/app/(admin)/viaggi/[tripId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditTripClientPage } from "./_components/EditTripClientPage";

interface EditTripPageProps {
  params: { tripId: string }; // Non più una Promise
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  // Non c'è più bisogno di "await params"
  const trip = await prisma.trip.findUnique({
    where: {
      id: params.tripId,
    },
  });

  if (!trip) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modifica Viaggio</h1>
      <EditTripClientPage trip={trip} />
    </div>
  );
}