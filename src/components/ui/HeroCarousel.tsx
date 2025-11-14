// src/components/ui/HeroCarousel.tsx
"use client";

import * as React from "react";
// 1. Importa il plugin che abbiamo appena installato
import Autoplay from "embla-carousel-autoplay";
import { HomeCarouselImage } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
        <h1 className="text-4xl font-bold">Oltre Viaggi</h1>
      </section>
    );
  }

  return (
    <Carousel
      // 3. Passa il plugin al componente Carousel
      plugins={[plugin.current]}
      className="w-full"
      // 4. (Opzionale ma consigliato) Metti in pausa l'autoplay al passaggio del mouse
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative h-[60vh] w-full">
              <img src={image.imageUrl} alt={image.altText || "Hero image"} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-white text-4xl md:text-6xl font-bold">
                    LOREM IPSUM DOLOR SIT
                  </h1>
                  <p className="text-white text-lg mt-2">Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}