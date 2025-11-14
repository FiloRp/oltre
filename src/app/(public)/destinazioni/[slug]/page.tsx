// src/app/(public)/destinazioni/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { TripGallery } from '../_components/TripGallery'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TripDetailPageProps {
  params: {
    slug: string;
  };
}

export function formatAvailableSeats(seats?: number | null): string | null {
  if (seats === null || typeof seats === 'undefined') return null;
  if (seats <= 0) return "Esaurito";
  if (seats === 1) return "Ultimo posto!";
  if (seats > 5) return "5+ posti disponibili";
  return `${seats} posti disponibili`;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const trip = await prisma.trip.findUnique({
    where: { slug: params.slug },
    include: {
      departures: {
        where: { 
          startDate: { gte: new Date() },
          status: { not: 'ARCHIVED' }, 
        },
        orderBy: { startDate: 'asc' },
        include: {
					coordinator: true,
					_count: {
						select: { 
							// --- CORREZIONE QUI ---
							bookings: true 
						},
					},
				},
			},
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!trip || trip.status !== 'PUBLISHED') {
    notFound();
  }

  const programDays = (trip.program && typeof trip.program === 'string' ? JSON.parse(trip.program) : []) as { title: string; description: string }[];
  const faqs = (trip.faq && typeof trip.faq === 'string' ? JSON.parse(trip.faq) : []) as { question: string; answer: string }[];
  // const seatsText = formatAvailableSeats(departure.availableSeats);
	
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative h-[45vh] text-white flex items-center justify-center text-center">
        <img src={trip.heroImage || ''} alt={trip.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight">{trip.title}</h1>
          <p className="mt-2 text-xl text-gray-200">{trip.shortDescription}</p>
        </div>
      </section>

      {/* SEZIONE PRINCIPALE */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLONNA SINISTRA (Contenuti) */}
          <div className="lg:col-span-8 space-y-16">
            
            <section>
              <h2 className="text-3xl font-bold mb-4">Il Viaggio in Breve</h2>
              <p className="text-gray-700 leading-relaxed">{trip.shortDescription}</p>
            </section>

            {trip.reviews.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-4">Dicono di noi</h2>
                <div className="space-y-6">
                  {trip.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                </div>
              </section>
            )}

            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">La Quota Comprende</h3>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {trip.includes?.split('\n').map((line, i) => <p key={i} className="my-1">{line}</p>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">La Quota Non Comprende</h3>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {trip.notIncludes?.split('\n').map((line, i) => <p key={i} className="my-1">{line}</p>)}
                  </div>
                </div>
              </div>
            </section>

            {programDays.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-4">Programma di Viaggio</h2>
                <Accordion type="single" collapsible className="w-full">
                  {programDays.map((day, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg font-semibold">{day.title}</AccordionTrigger>
                      <AccordionContent><div className="prose max-w-none pt-2" dangerouslySetInnerHTML={{ __html: day.description }} /></AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {faqs.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-4">Domande Frequenti</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent><p className="pt-2">{faq.answer}</p></AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* {trip.galleryImages && trip.galleryImages.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-4">Galleria</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trip.galleryImages.map((url, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden shadow-md">
                      <img src={url} alt={`Galleria immagine ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )} */}
						{trip.galleryImages && trip.galleryImages.length > 0 && (
							<TripGallery images={trip.galleryImages} />
						)}
          </div>

          {/* COLONNA DESTRA (Partenze e Mappa) - STICKY */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              
              {trip.mapLatitude && trip.mapLongitude && (
                <div className="rounded-lg overflow-hidden shadow-lg aspect-video">
                  <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://www.openstreetmap.org/export/embed.html?bbox=${trip.mapLongitude - 0.5},${trip.mapLatitude - 0.5},${trip.mapLongitude + 0.5},${trip.mapLatitude + 0.5}&layer=mapnik&marker=${trip.mapLatitude},${trip.mapLongitude}`}></iframe>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-4">Prossime Partenze</h3>
                <div className="space-y-4">
                  {trip.departures.length > 0 ? (
                    trip.departures.map(departure => {
                      const seatsText = formatAvailableSeats(departure.availableSeats);

                      return (
                        <div key={departure.id} className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
                          {/* Parte Superiore: Date, Prezzo, Coordinatore */}
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg">{format(new Date(departure.startDate), 'dd MMM')} - {format(new Date(departure.endDate), 'dd MMM yyyy')}</p>
                              <p className="text-2xl font-bold">€{departure.price}</p>
                              {seatsText && (
                                <p className="text-sm text-blue-600 font-semibold mt-1">{seatsText}</p>
                              )}
                            </div>
                            {departure.coordinator && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/team/${departure.coordinator.id}`}>
                                      <img src={departure.coordinator.photoUrl} alt={departure.coordinator.name} className="h-14 w-14 rounded-full object-cover" />
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent><p>{departure.coordinator.name}</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {/* Parte Inferiore: Stato e Pulsante Prenota */}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <Badge variant={departure.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                              {departure.status}
                            </Badge>
                            <Button asChild>
                              <Link href={`/prenota/${departure.id}`}>Prenota</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="border rounded-lg p-4 text-center text-gray-500 bg-white"><p>Nessuna partenza in programma.</p></div>
                  )}
                </div>
              </div>
              {/* --- FINE BLOCCO PARTENZE MODIFICATO --- */}

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}