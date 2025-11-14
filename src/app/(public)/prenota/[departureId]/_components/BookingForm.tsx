// src/app/(public)/prenota/[departureId]/_components/BookingForm.tsx
"use client";

import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Departure, Trip } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'; // Aggiungeremo questo componente

// Schema Zod lato client (deve rispecchiare quello del backend)
const bookingFormSchema = z.object({
  contactName: z.string().min(3, "Nome richiesto"),
  contactEmail: z.string().email("Email non valida"),
  contactPhone: z.string().min(5, "Telefono richiesto"),
  billingAddress: z.string().min(5, "Indirizzo richiesto"),
  billingZipCode: z.string().min(3, "CAP richiesto"),
  billingCity: z.string().min(2, "Città richiesta"),
  billingProvince: z.string().min(2, "Provincia richiesta"),
  billingCountry: z.string().min(2, "Nazione richiesta"),
  billingFiscalCode: z.string().min(11, "Codice Fiscale richiesto"),
  passengers: z.array(z.object({
    firstName: z.string().min(2, "Nome richiesto"),
    lastName: z.string().min(2, "Cognome richiesto"),
    birthDate: z.string().min(1, "Data di nascita richiesta"), // Usiamo stringa per l'input type="date"
    nationality: z.string().min(2, "Nazionalità richiesta"),
  })).min(1),
});

interface BookingFormProps {
  departure: Departure & { trip: Trip };
}

export function BookingForm({ departure }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema) as Resolver<z.infer<typeof bookingFormSchema>>,
    defaultValues: {
      passengers: [{ firstName: '', lastName: '', birthDate: '', nationality: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    setIsLoading(true);
    try {
      const submissionData = {
        ...values,
        departureId: departure.id,
        totalAmount: departure.price * values.passengers.length, // Calcolo del prezzo
        passengers: values.passengers.map(p => ({
          ...p,
          birthDate: new Date(p.birthDate), // Converte la stringa in data
          hasExtraInsurance: false, // Per ora, non gestiamo l'assicurazione extra
        })),
        isAgency: false, // Per ora, non gestiamo le agenzie
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Errore durante la prenotazione.');

      // Reindirizza a una pagina di successo (da creare)
      router.push('/prenotazione-successo');
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Dati di Contatto e Fatturazione</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="contactName" render={({ field }) => (<FormItem><FormLabel>Nome e Cognome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel>Telefono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingAddress" render={({ field }) => (<FormItem><FormLabel>Indirizzo di Fatturazione</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingCity" render={({ field }) => (<FormItem><FormLabel>Città</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingZipCode" render={({ field }) => (<FormItem><FormLabel>CAP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingProvince" render={({ field }) => (<FormItem><FormLabel>Provincia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingCountry" render={({ field }) => (<FormItem><FormLabel>Nazione</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="billingFiscalCode" render={({ field }) => (<FormItem><FormLabel>Codice Fiscale / P.IVA</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Dati Passeggeri</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Passeggero {index + 1}</h4>
                  {index > 0 && <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>Rimuovi</Button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <FormField control={form.control} name={`passengers.${index}.firstName`} render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`passengers.${index}.lastName`} render={({ field }) => (<FormItem><FormLabel>Cognome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`passengers.${index}.birthDate`} render={({ field }) => (<FormItem><FormLabel>Data di Nascita</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`passengers.${index}.nationality`} render={({ field }) => (<FormItem><FormLabel>Nazionalità</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ firstName: '', lastName: '', birthDate: '', nationality: '' })}>Aggiungi Passeggero</Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isLoading}>{isLoading ? 'Invio in corso...' : 'Invia Prenotazione'}</Button>
      </form>
    </Form>
  );
}