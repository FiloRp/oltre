// src/app/(admin)/admin/viaggi/_components/DepartureForm.tsx
"use client";

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { TeamMember } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const departureFormSchema = z.object({
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  price: z.coerce.number().min(0),
  totalSeats: z.coerce.number().int().min(1),
  coordinatorId: z.string().nullable().optional(),
  status: z.enum(["AVAILABLE", "CONFIRMED", "SOLD_OUT", "ARCHIVED"]),
}).refine(data => data.startDate, { message: "Data di inizio richiesta.", path: ["startDate"] })
  .refine(data => data.endDate, { message: "Data di fine richiesta.", path: ["endDate"] });

export type DepartureFormValues = z.infer<typeof departureFormSchema>;

interface DepartureFormProps {
  teamMembers: TeamMember[];
  onSubmit: (values: DepartureFormValues) => void;
  isLoading: boolean;
}

export function DepartureForm({ teamMembers, onSubmit, isLoading }: DepartureFormProps) {
  const form = useFormContext<DepartureFormValues>();

  return (
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
                        <PopoverContent className="w-auto p-0 z-[100] not-prose">
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
                {/* <FormField
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
                        <PopoverContent className="w-auto p-0 not-prose">
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
                /> */}
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Prezzo (€)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="totalSeats" render={({ field }) => (<FormItem><FormLabel>Posti Totali</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                
                <FormField
                  control={form.control}
                  name="coordinatorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordinatore</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona un coordinatore (opzionale)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nessun coordinatore</SelectItem>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvataggio..." : "Salva Partenza"}
                </Button>
              </form>
            </Form>

  );
}