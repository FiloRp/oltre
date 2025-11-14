// src/app/(admin)/team/_components/TeamMemberForm.tsx
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control } from 'react-hook-form'; // Importa Control
import { z } from 'zod';
import { TeamMember } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const teamMemberFormSchema = z.object({
  name: z.string().min(3, 'Il nome è richiesto'),
  role: z.string().min(3, 'Il ruolo è richiesto'),
  photoUrl: z.string().url('Deve essere un URL valido per la foto'),
  bio: z.string().nullable().optional(),
});

// Definiamo il tipo esatto dei valori del form
export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

interface TeamMemberFormProps {
  initialData?: TeamMember | null;
  onSave: (values: TeamMemberFormValues) => Promise<void>;
  isLoading: boolean;
}

export function TeamMemberForm({ initialData, onSave, isLoading }: TeamMemberFormProps) {
  const form = useForm<TeamMemberFormValues>({ // Usa il tipo esplicito
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || '',
      photoUrl: initialData?.photoUrl || '',
      bio: initialData?.bio || '', // Ora accetta null e lo converte in stringa vuota
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dettagli Membro del Team</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome e Cognome</FormLabel>
                  <FormControl>
                    <Input placeholder="Mario Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruolo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tour Leader" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Foto</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Una breve biografia..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''} // Mantiene la gestione del null
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvataggio...' : 'Salva'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}