// src/app/(admin)/admin/viaggi/_components/DeparturesManager.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Departure, TeamMember } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const departureFormSchema = z.object({
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  price: z.coerce.number().min(0),
  totalSeats: z.coerce.number().int().min(1),
  coordinatorId: z.string().nullable().optional(),
  status: z.enum(["AVAILABLE", "CONFIRMED", "SOLD_OUT", "ARCHIVED"]),
  availableSeats: z.coerce.number().int().nullable().optional(), 
}).refine(data => data.startDate, {
    message: "La data di inizio è richiesta.",
    path: ["startDate"],
}).refine(data => data.endDate, {
    message: "La data di fine è richiesta.",
    path: ["endDate"],
// --- AGGIUNGI QUESTA NUOVA VALIDAZIONE ---
}).refine(data => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  }, {
    message: "La data di fine non può essere precedente a quella di inizio.",
    path: ["endDate"],
});

type DepartureFormValues = z.infer<typeof departureFormSchema>;

interface DeparturesManagerProps {
  tripId: string;
  initialDepartures: Departure[];
  teamMembers: TeamMember[];
}

export function DeparturesManager({ tripId, initialDepartures, teamMembers }: DeparturesManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState<Departure | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<DepartureFormValues>({
    resolver: zodResolver(departureFormSchema) as Resolver<DepartureFormValues>,
  });
  
// const form = useForm<DepartureFormValues>({
//     resolver: zodResolver(departureFormSchema),
//   });


  const handleOpenDialog = (departure: Departure | null) => {
    console.log("--- 1. handleOpenDialog CHIAMATO ---");
    if (departure) {
      console.log("Modalità: MODIFICA", departure);
    } else {
      console.log("Modalità: CREAZIONE");
    }
    setEditingDeparture(departure);
    form.reset({
      startDate: departure ? new Date(departure.startDate) : null,
      endDate: departure ? new Date(departure.endDate) : null,
      price: departure?.price ?? 0,
      totalSeats: departure?.totalSeats ?? 10,
      coordinatorId: departure?.coordinatorId || "none",
      status: departure?.status || 'AVAILABLE',
      availableSeats: departure?.availableSeats,
    });
    setIsDialogOpen(true);
  };

  const onValidSubmit: SubmitHandler<DepartureFormValues> = async (values) => {
    const url = editingDeparture ? `/api/admin/departures/${editingDeparture.id}` : `/api/admin/trips/${tripId}/departures`;
    const method = editingDeparture ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.issues[0]?.message || 'Salvataggio fallito.');
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  };

  const onInvalidSubmit = (errors: any) => {
    console.log("Validazione fallita:", errors);
  };

  const handleDelete = async (departureId: string) => {
    if (!window.confirm("Sei sicuro?")) return;
    setIsDeleting(departureId);
    try {
      // --- URL CORRETTO PER DELETE ---
      const res = await fetch(`/api/admin/departures/${departureId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Eliminazione fallita");
      router.refresh();
    } catch (error) {
      alert("Errore durante l'eliminazione.");
    } finally {
      setIsDeleting(null);
    }
  };

  // const onSubmit = async (values: DepartureFormValues) => {
  //   console.log("--- 2. onSubmit CHIAMATO ---");
  //   const url = editingDeparture
  //     ? `/api/admin/departures/${editingDeparture.id}`
  //     // CORREZIONE CRITICA: Assicurati che l'URL di creazione sia corretto
  //     : `/api/admin/trips/${tripId}/departures`;
  //   const method = editingDeparture ? 'PATCH' : 'POST';

  //   console.log(`Metodo: ${method}, URL: ${url}`);
  //   console.log("Dati inviati:", values);

  //   try {
  //     const response = await fetch(url, {
  //       method,
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(values),
  //     });

  //     console.log(`--- 3. RISPOSTA DAL SERVER ---`);
  //     console.log(`Status: ${response.status}`);

  //     if (!response.ok) {
  //       const errorText = await response.text(); // Leggiamo la risposta come testo
  //       console.error("Errore dal server (testo):", errorText);
  //       throw new Error(`Salvataggio fallito. Status: ${response.status}`);
  //     }
      
  //     const result = await response.json();
  //     console.log("Risposta JSON dal server:", result);
      
  //     setIsDialogOpen(false);
  //     router.refresh();
  //   } catch (error) {
  //     console.error("--- 4. ERRORE NEL BLOCCO CATCH ---", error);
  //     alert(`Si è verificato un errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
  //   }
  // };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestione Partenze</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOpenDialog(null)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Partenza
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Inizio</TableHead><TableHead>Fine</TableHead><TableHead>Prezzo</TableHead><TableHead>Posti</TableHead><TableHead>Stato</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialDepartures.map(dep => (
              <TableRow key={dep.id}>
                <TableCell>{format(new Date(dep.startDate), "dd/MM/yyyy")}</TableCell>
                <TableCell>{format(new Date(dep.endDate), "dd/MM/yyyy")}</TableCell>
                <TableCell>€{dep.price}</TableCell>
                <TableCell>{dep.availableSeats || dep.totalSeats}</TableCell>
                <TableCell>{dep.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleOpenDialog(dep)}>
                        <Pencil className="mr-2 h-4 w-4" /> Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(dep.id)} disabled={isDeleting === dep.id} className="text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" /> Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialDepartures.length === 0 && <p className="text-center text-gray-500 py-4">Nessuna partenza programmata.</p>}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDeparture ? 'Modifica Partenza' : 'Nuova Partenza'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4">
              <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Data Inizio</FormLabel><Popover modal={false}><PopoverTrigger className={cn("w-full justify-start text-left font-normal inline-flex items-center ...")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Scegli data</span>}</PopoverTrigger><PopoverContent className="w-auto p-0 z-[100]"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Data Fine</FormLabel><Popover modal={false}><PopoverTrigger className={cn("w-full justify-start text-left font-normal inline-flex items-center ...")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Scegli data</span>}</PopoverTrigger><PopoverContent className="w-auto p-0 z-[100]"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Prezzo (€)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="totalSeats" render={({ field }) => (<FormItem><FormLabel>Posti Totali</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField
                control={form.control}
                name="availableSeats" // <-- MODIFICA QUI
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posti da Visualizzare (Opzionale)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Es. 5"
                        {...field}
                        // Converte null/undefined in stringa vuota per l'input
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="coordinatorId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinatore</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleziona un coordinatore" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nessun coordinatore</SelectItem>
                      {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Stato</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="AVAILABLE">Disponibile</SelectItem><SelectItem value="CONFIRMED">Confermato</SelectItem><SelectItem value="SOLD_OUT">Esaurito</SelectItem><SelectItem value="ARCHIVED">Archiviato</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Salvataggio..." : "Salva Partenza"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}