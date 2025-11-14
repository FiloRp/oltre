// src/app/(admin)/viaggi/_components/TripForm.tsx
"use client";

import { z } from "zod";
import { useFieldArray, Control, ControllerRenderProps, UseFormSetValue } from "react-hook-form"; // Importa ControllerRenderProps
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ImageGalleryForm } from "./ImageGalleryForm";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
// import { TeamMember } from "@prisma/client";

export const formSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  country: z.string().min(2, "Il paese deve avere almeno 2 caratteri"),
  shortDescription: z.string().min(10, "La descrizione breve deve avere almeno 10 caratteri"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), 
  includes: z.string().optional(),
  notIncludes: z.string().optional(),
  program: z.array(z.object({ title: z.string().min(3), description: z.string().min(10) })).optional(),
  faq: z.array(z.object({ question: z.string().min(3), answer: z.string().min(10) })).optional(),
  galleryImages: z.array(z.string()).optional(),
  heroImage: z.string().url().nullable().optional(),
  mapLatitude: z.coerce.number().nullable().optional(),
  mapLongitude: z.coerce.number().nullable().optional(),
  // ledByIds: z.array(z.string()).optional(),
});

export type TripFormValues = z.infer<typeof formSchema>;

interface TripFormProps {
  formControl: Control<TripFormValues>; // Usa il tipo esplicito
  formSetValue: UseFormSetValue<TripFormValues>; // Usa il tipo esplicito
  // teamMembers: TeamMember[];
}

export function TripForm({ formControl, formSetValue, /* teamMembers */ }: TripFormProps) {
  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({ control: formControl, name: "program" });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control: formControl, name: "faq" });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Informazioni Principali</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={formControl} name="title" render={({ field }) => ( <FormItem> <FormLabel>Titolo</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={formControl} name="country" render={({ field }) => ( <FormItem> <FormLabel>Paese</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={formControl} name="shortDescription" render={({ field }) => ( <FormItem> <FormLabel>Descrizione Breve</FormLabel> <FormControl><Textarea {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={formControl} name="status" render={({ field }) => ( <FormItem> <FormLabel>Stato</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl> <SelectContent><SelectItem value="DRAFT">Bozza</SelectItem><SelectItem value="PUBLISHED">Pubblicato</SelectItem><SelectItem value="ARCHIVED">Archiviato (nascosto dal sito)</SelectItem></SelectContent></Select> <FormMessage /> </FormItem> )}/>
         <FormField
          control={formControl}
          name="heroImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immagine di Copertina</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={(url) => formSetValue("heroImage", url, { shouldValidate: true, shouldDirty: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contenuti</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={formControl} name="includes" render={({ field }) => ( <FormItem> <FormLabel>La Quota Comprende</FormLabel> <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={formControl} name="notIncludes" render={({ field }) => ( <FormItem> <FormLabel>La Quota Non Comprende</FormLabel> <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Programma</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {programFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg relative">
              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeProgram(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <FormField control={formControl} name={`program.${index}.title`} render={({ field }) => ( <FormItem className="mb-4"> <FormLabel>Titolo Giorno {index + 1}</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={formControl} name={`program.${index}.description`} render={({ field }) => ( <FormItem> <FormLabel>Descrizione</FormLabel> <FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendProgram({ title: "", description: "" })}>Aggiungi Giorno</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {faqFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg relative">
              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeFaq(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <FormField control={formControl} name={`faq.${index}.question`} render={({ field }) => ( <FormItem className="mb-4"> <FormLabel>Domanda {index + 1}</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={formControl} name={`faq.${index}.answer`} render={({ field }) => ( <FormItem> <FormLabel>Risposta</FormLabel> <FormControl><Textarea {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendFaq({ question: "", answer: "" })}>Aggiungi Domanda</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Geolocalizzazione (Mappa)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={formControl}
            name="mapLatitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitudine</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="Es. 41.902782" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formControl}
            name="mapLongitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitudine</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="Es. 12.496366" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader><CardTitle>Coordinatori del Viaggio</CardTitle></CardHeader>
        <CardContent>
          <FormField
            control={formControl}
            name="ledByIds"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Seleziona i coordinatori</FormLabel>
                </div>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <FormField
                      key={member.id}
                      control={formControl}
                      name="ledByIds"
                      render={({ field }) => {
                        return (
                          <FormItem key={member.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(member.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), member.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== member.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {member.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card> */}

      <FormField
        control={formControl}
        name="galleryImages"
        render={({ field }: { field: ControllerRenderProps<TripFormValues, 'galleryImages'> }) => (
          <ImageGalleryForm
            imageUrls={field.value || []}
            onImageUrlsChange={field.onChange}
          />
        )}
      />
    </div>
  );
}