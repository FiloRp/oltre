// src/app/(admin)/viaggi/[tripId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditTripClientPage } from "./_components/EditTripClientPage";
import { DeparturesManager } from "../_components/DeparturesManager";
import { CalendarTest } from "../_components/CalendarTest";

interface EditTripPageProps {
  params: { tripId: string }; // Non più una Promise
}

export default async function EditTripPage({ params }: { params: { tripId: string } }) {
  const trip = await prisma.trip.findUnique({ 
    where: { id: params.tripId },
    include: {
      departures: { // Includi le partenze associate
        orderBy: {
          startDate: 'asc', // Ordinale per data
        },
      },
    },
   });

  if (!trip) {
    notFound();
  }

  return (
    <div className="space-y-8"> {/* Aggiungi uno spaziatore per le card */}
    <CalendarTest />
      <div>
        <h1 className="text-3xl font-bold mb-6">Modifica Viaggio</h1>
        <EditTripClientPage trip={trip} />
      </div>
      {/* Aggiungi il manager delle partenze */}
      <DeparturesManager tripId={trip.id} initialDepartures={trip.departures} />
    </div>
  );
}