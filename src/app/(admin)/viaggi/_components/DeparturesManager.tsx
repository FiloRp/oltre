// src/app/(admin)/viaggi/_components/DeparturesManager.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Departure } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const departureFormSchema = z.object({
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  price: z.coerce.number().min(0, "Il prezzo non può essere negativo."),
  totalSeats: z.coerce.number().int().min(1, "Ci deve essere almeno un posto."),
}).refine(data => data.startDate, {
    message: "La data di inizio è richiesta.",
    path: ["startDate"],
}).refine(data => data.endDate, {
    message: "La data di fine è richiesta.",
    path: ["endDate"],
});

interface DeparturesManagerProps {
  tripId: string;
  initialDepartures: Departure[];
}

export function DeparturesManager({ tripId, initialDepartures }: DeparturesManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof departureFormSchema>>({
    resolver: zodResolver(departureFormSchema) as Resolver<z.infer<typeof departureFormSchema>>,
    defaultValues: {
      startDate: null,
      endDate: null,
      price: 0,
      totalSeats: 1,
    }
  });

  const onSubmit = async (values: z.infer<typeof departureFormSchema>) => {
    try {
      const response = await fetch(`/api/admin/trips/${tripId}/departures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Creazione fallita.');
      }
      
      form.reset();
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestione Partenze</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Partenza</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuova Partenza</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* --- INIZIO MODIFICA --- */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Inizio</FormLabel>
                      <Popover>
                        <PopoverTrigger className={cn(
                          "w-full justify-start text-left font-normal inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                          !field.value && "text-muted-foreground"
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Scegli una data</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100]">
                          <Calendar
                            mode="single"
                            selected={field.value ? field.value : undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Fine</FormLabel>
                      <Popover>
                        <PopoverTrigger className={cn(
                          "w-full justify-start text-left font-normal inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                          !field.value && "text-muted-foreground"
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Scegli una data</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100]">
                          <Calendar
                            mode="single"
                            selected={field.value ? field.value : undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Fine</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Scegli una data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? field.value : undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Prezzo (€)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="totalSeats" render={({ field }) => (<FormItem><FormLabel>Posti Totali</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvataggio..." : "Salva Partenza"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Inizio</TableHead><TableHead>Fine</TableHead><TableHead>Prezzo</TableHead><TableHead>Posti</TableHead><TableHead>Stato</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialDepartures.map(dep => (
              <TableRow key={dep.id}>
                <TableCell>{format(new Date(dep.startDate), "dd/MM/yyyy")}</TableCell>
                <TableCell>{format(new Date(dep.endDate), "dd/MM/yyyy")}</TableCell>
                <TableCell>€{dep.price}</TableCell>
                <TableCell>{dep.totalSeats}</TableCell>
                <TableCell>{dep.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialDepartures.length === 0 && <p className="text-center text-gray-500 py-4">Nessuna partenza programmata per questo viaggio.</p>}
      </CardContent>
    </Card>
  );
}