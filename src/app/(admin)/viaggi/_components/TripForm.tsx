// src/app/(admin)/viaggi/_components/TripForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trip } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
  // AGGIUNGI QUESTO
  program: z.array(
    z.object({
      title: z.string().min(3, "Il titolo del giorno è richiesto"),
      description: z.string().min(10, "La descrizione del giorno è richiesta"),
    })
  ).optional(),
});

type TripFormValues = z.infer<typeof formSchema>;

interface TripFormProps {
  initialData?: Trip | null; // Dati iniziali per la modifica
  onSave: (values: TripFormValues) => Promise<void>;
  isLoading: boolean;
}

export function TripForm({ initialData, onSave, isLoading }: TripFormProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      country: initialData?.country || "",
      shortDescription: initialData?.shortDescription || "",
      // Assicurati che il programma sia un array, anche se i dati iniziali sono null
      program: initialData?.program ? JSON.parse(JSON.stringify(initialData.program)) : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "program",
  });

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Informazioni Principali</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Titolo del Viaggio</FormLabel>
                    <FormControl>
                        <Input placeholder="Es. Giappone: The Land of the Rising Sun" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Paese</FormLabel>
                    <FormControl>
                        <Input placeholder="Es. Giappone" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Descrizione Breve</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Una breve descrizione che apparirà nelle card di anteprima."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                    )}
                />
        </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Programma Giorno per Giorno</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <FormField
                  control={form.control}
                  name={`program.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Titolo Giorno {index + 1}</FormLabel>
                      <FormControl><Input placeholder="Es. Arrivo a Tokyo" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`program.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrizione</FormLabel>
                      <FormControl>
                       <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ title: "", description: "" })}
            >
              Aggiungi Giorno
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvataggio in corso..." : "Salva"}
        </Button>
        </form>
    </Form>
    
  );
}