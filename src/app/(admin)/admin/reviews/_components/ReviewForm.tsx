// src/app/(admin)/admin/reviews/_components/ReviewForm.tsx
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Review, Trip } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRatingInput } from '@/components/ui/StarRatingInput';
import { Checkbox } from '@/components/ui/checkbox';

export const reviewFormSchema = z.object({
  tripId: z.string().min(1, 'Devi selezionare un viaggio'),
  userName: z.string().min(2, 'Il nome utente è richiesto'),
  reviewText: z.string().min(10, 'Il testo della recensione è troppo corto'),
  rating: z.number().min(1).max(5),
  isFeatured: z.boolean().default(false),
  userPhotoUrl: z.string().url("URL foto non valido").or(z.literal("")).optional().nullable(),
  trustpilotUrl: z.string().url("URL Trustpilot non valido").or(z.literal("")).optional().nullable(),
});

// --- DEFINISCI ED ESPORTA IL TIPO ---
export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  initialData?: Review | null;
  trips: Trip[];
  onSave: (values: ReviewFormValues) => Promise<void>; // Usa il tipo esplicito
  isLoading: boolean;
}

export function ReviewForm({ initialData, trips, onSave, isLoading }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({ // Usa il tipo esplicito
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      tripId: initialData?.tripId || '',
      userName: initialData?.userName || '',
      reviewText: initialData?.reviewText || '',
      userPhotoUrl: initialData?.userPhotoUrl || '',
      trustpilotUrl: initialData?.trustpilotUrl || '',
      rating: initialData?.rating || 5,
      isFeatured: initialData?.isFeatured || false,
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle>Dettagli Recensione</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
            <FormField control={form.control} name="tripId" render={({ field }) => ( <FormItem> <FormLabel>Viaggio di Riferimento</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Seleziona un viaggio" /></SelectTrigger></FormControl> <SelectContent> {trips.map(trip => <SelectItem key={trip.id} value={trip.id}>{trip.title}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="userName" render={({ field }) => ( <FormItem> <FormLabel>Nome Utente</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="rating" render={({ field }) => ( <FormItem> <FormLabel>Valutazione</FormLabel> <FormControl><StarRatingInput value={field.value} onChange={field.onChange} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="reviewText" render={({ field }) => ( <FormItem> <FormLabel>Testo Recensione</FormLabel> <FormControl><Textarea {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="isFeatured" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl> <div className="space-y-1 leading-none"> <FormLabel>Recensione in Evidenza</FormLabel> <p className="text-sm text-muted-foreground">Apparirà nella homepage.</p> </div> </FormItem> )}/>
            <FormField control={form.control} name="userPhotoUrl" render={({ field }) => ( <FormItem> <FormLabel>URL Foto Utente (Opzionale)</FormLabel> <FormControl><Input type="url" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="trustpilotUrl" render={({ field }) => ( <FormItem> <FormLabel>Link Trustpilot (Opzionale)</FormLabel> <FormControl><Input type="url" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvataggio...' : 'Salva Recensione'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}