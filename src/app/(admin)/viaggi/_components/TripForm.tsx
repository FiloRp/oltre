// src/app/(admin)/viaggi/_components/TripForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Trip } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Trash2 } from "lucide-react";
import { ImageGalleryForm } from "./ImageGalleryForm";

const formSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  includes: z.string().optional(),
  notIncludes: z.string().optional(),
  program: z.array(
    z.object({
      title: z.string().min(3, "Il titolo del giorno è richiesto"),
      description: z.string().min(10, "La descrizione del giorno è richiesta"),
    })
  ).optional(),
  faq: z.array(
    z.object({
      question: z.string().min(3, "La domanda è richiesta"),
      answer: z.string().min(10, "La risposta è richiesta"),
    })
  ).optional(),
  galleryImages: z.array(z.string()).optional(),
});

type TripFormValues = z.infer<typeof formSchema>;

interface TripFormProps {
  initialData?: Trip | null;
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
      status: initialData?.status || "DRAFT",
      includes: initialData?.includes || "",
      notIncludes: initialData?.notIncludes || "",
      program: initialData?.program ? JSON.parse(JSON.stringify(initialData.program)) : [],
      faq: initialData?.faq ? JSON.parse(JSON.stringify(initialData.faq)) : [],
      galleryImages: initialData?.galleryImages || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "program",
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({
    control: form.control,
    name: "program",
  });

  // --- AGGIUNGI QUESTO ---
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        
        <Card>
          <CardHeader>
              <CardTitle>Informazioni Principali</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            {/* <FormField 
              control={form.control} 
              name="status" render={({ field }) => ( 
              <FormItem> <FormLabel>Stato</FormLabel> 
              <Select onValueChange={field.onChange} 
              defaultValue={field.value}> 
              <FormControl> 
                <SelectTrigger> 
                  <SelectValue placeholder="Seleziona lo stato" /> 
                  </SelectTrigger> 
                  </FormControl> 
                  <SelectContent> 
                    <SelectItem value="DRAFT">Bozza (non visibile)</SelectItem> 
                    <SelectItem value="PUBLISHED">Pubblicato (visibile)</SelectItem> 
                    </SelectContent> 
                    </Select> 
                    <FormMessage /> 
                    </FormItem> 
                  )}
                  /> */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Stato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona lo stato del viaggio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="DRAFT">Bozza (non visibile sul sito)</SelectItem>
                    <SelectItem value="PUBLISHED">Pubblicato (visibile sul sito)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>La Quota Comprende</FormLabel>
                <FormControl>
                  <Textarea placeholder="Elenca cosa è incluso nel prezzo..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notIncludes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>La Quota Non Comprende</FormLabel>
                <FormControl>
                  <Textarea placeholder="Elenca cosa NON è incluso nel prezzo..." {...field} />
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

        <Card>
          <CardHeader>
            <CardTitle>FAQ (Domande Frequenti)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeFaq(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <FormField
                  control={form.control}
                  name={`faq.${index}.question`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Domanda {index + 1}</FormLabel>
                      <FormControl><Input placeholder="Es. Quali documenti servono?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`faq.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risposta</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Scrivi qui la risposta..." {...field} />
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
              onClick={() => appendFaq({ question: "", answer: "" })}
            >
              Aggiungi Domanda
            </Button>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="galleryImages"
          render={({ field }) => (
            <ImageGalleryForm
              imageUrls={field.value || []}
              onImageUrlsChange={field.onChange}
            />
          )}
        />

        <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? "Salvataggio in corso..." : "Salva"}
        </Button>
      </form>
    </Form>
  );
}