// src/components/ui/HeroCarousel.tsx
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { HomeCarouselImage } from "@prisma/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroCarouselProps {
  images: HomeCarouselImage[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  // 2. Crea un'istanza del plugin usando React.useRef
  //    - delay: 5000ms (5 secondi) tra una slide e l'altra
  //    - stopOnInteraction: l'autoplay si ferma se l'utente interagisce manualmente
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!images || images.length === 0) {
    return (
      <section className="h-[60vh] bg-gray-800 flex items-center justify-center text-white">
        <h1 className="font-heading text-4xl font-bold">Oltre Viaggi</h1>
      </section>
    );
  }

 return (
    <section className="relative h-[80vh] md:h-[90vh] text-white">
      <Carousel plugins={[plugin.current]} className="w-full h-full">
        <CarouselContent className="h-full">
          {images.map((image) => (
            <CarouselItem key={image.id} className="h-full">
              <img src={image.imageUrl} alt={image.altText || ""} className="w-full h-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Overlay e Contenuto Fisso */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
        <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight">
          {images[0]?.title || "LOREM IPSUM DOLOR SIT"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
          {images[0]?.subtitle || "Lorem ipsum dolor sit amet consectetur."}
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
            <Link href="/destinazioni">Scopri i Viaggi</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            <Link href="/chi-siamo">Chi Siamo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}