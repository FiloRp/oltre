// src/app/(admin)/viaggi/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Aggiungiamo un componente per lo stato
import { TripActionsCell } from "./_components/TripActionsCell";

// Aggiungiamo il componente Badge con shadcn
// Esegui nel terminale: pnpm dlx shadcn-ui@latest add badge

export default async function ViaggiPage() {
  // 1. Fetch dei dati direttamente dal database (siamo in un Server Component)
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Gestione Viaggi</h1>
        <Button asChild>
          <Link href="/admin/viaggi/nuovo">Aggiungi Nuovo Viaggio</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titolo</TableHead>
              <TableHead>Paese</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Data Creazione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.title}</TableCell>
                <TableCell>{trip.country}</TableCell>
                <TableCell>
                  <Badge variant={trip.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {trip.status}
                  </Badge>
                </TableCell>
                <TableCell>{trip.createdAt.toLocaleDateString("it-IT")}</TableCell>
                <TableCell className="text-right">
                  {/* SOSTITUISCI IL VECCHIO PULSANTE CON QUESTO COMPONENTE */}
                  <TripActionsCell tripId={trip.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {trips.length === 0 && (
        <div className="text-center py-12">
            <p className="text-gray-500">Nessun viaggio trovato. Inizia creandone uno nuovo!</p>
        </div>
      )}
    </div>
  );
}