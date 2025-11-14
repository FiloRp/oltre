"use client";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DepartureActionsCellProps {
  departureId: string;
  onEdit: () => void; // Callback per la modifica
  onDelete: () => Promise<void>; // Callback per l'eliminazione
  isDeleting: boolean;
}

export function DepartureActionsCell({ departureId, onEdit, onDelete, isDeleting }: DepartureActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="..."><MoreHorizontal /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" /> Modifica
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" /> Elimina
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}