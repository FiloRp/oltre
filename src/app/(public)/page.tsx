// src/app/(public)/page.tsx
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TripCard } from '@/components/ui/TripCard';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { ReviewCard } from '@/components/ui/ReviewCard'; // Importa la review card
import { TripGallery } from './destinazioni/_components/TripGallery'; // Importa la galleria

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [upcomingDepartures, carouselImages, featuredReviews, galleryImages] = await Promise.all([
    prisma.departure.findMany({
      where: { startDate: { gte: new Date() }, trip: { status: 'PUBLISHED' } },
      orderBy: { startDate: 'asc' },
      take: 3,
      include: { trip: true, coordinator: true },
    }),
    prisma.homeCarouselImage.findMany({ orderBy: { order: 'asc' } }),
    prisma.review.findMany({ where: { isFeatured: true }, take: 4 }), 
    prisma.trip.findMany({ // Query per le immagini della galleria
      where: { status: 'PUBLISHED', galleryImages: { isEmpty: false } },
      select: { galleryImages: true },
      take: 6,
    }),
  ]);

  const allGalleryImages = galleryImages.flatMap(trip => trip.galleryImages).slice(0, 6);

  return (
    <div className="bg-white text-slate-800">
      <HeroCarousel images={carouselImages} />

      {/* SEZIONE PROSSIMI VIAGGI */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Prossimi Viaggi</h2>
            <Button variant="outline" asChild>
              <Link href="/destinazioni">Altre Partenze</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingDepartures.map(departure => (
              <TripCard key={departure.id} departure={departure} trip={departure.trip} />
            ))}
          </div>
        </div>
      </section>

      {/* SEZIONE PERCHÉ OLTRE (Placeholder) */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Perché Oltre</h2>
          <p className="text-lg text-slate-600">"Lorem ipsum dolor sit amet consectetur..."</p>
        </div>
      </section>

      {/* SEZIONE DICONO DI NOI */}
      {featuredReviews.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Dicono di Noi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEZIONE GALLERIA */}
      {allGalleryImages.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-100">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Galleria</h2>
            {/* Usiamo il componente che già gestisce lo slideshow */}
            <TripGallery images={allGalleryImages} />
          </div>
        </section>
      )}

      {/* SEZIONE CONTATTI (Placeholder) */}
      <section className="py-16 md:py-24 bg-slate-800 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Hai Domande?</h2>
          <p className="text-lg text-slate-300 mb-8">Siamo qui per aiutarti a pianificare la tua prossima avventura.</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contatti">Contattaci</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}