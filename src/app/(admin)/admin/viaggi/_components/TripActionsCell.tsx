// src/app/(admin)/viaggi/_components/TripActionsCell.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripActionsCellProps {
  tripId: string;
}

export function TripActionsCell({ tripId }: TripActionsCellProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Chiedi conferma prima di eliminare
    if (!window.confirm("Sei sicuro di voler eliminare questo viaggio? L'azione è irreversibile.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/trips/${tripId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Eliminazione fallita.");
      }

      // Forza l'aggiornamento dei dati nella pagina della tabella
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante l'eliminazione.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
      >
        <span className="sr-only">Apri menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/viaggi/${tripId}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Modifica</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{isDeleting ? "Eliminazione..." : "Elimina"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}