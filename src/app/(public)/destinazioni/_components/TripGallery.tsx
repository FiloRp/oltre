// src/app/(public)/destinazioni/_components/TripGallery.tsx
"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface TripGalleryProps {
  images: string[];
}

export function TripGallery({ images }: TripGalleryProps) {
  const [index, setIndex] = useState(-1);

  // Crea l'array di oggetti { src } richiesto dalla libreria
  const slides = images.map(url => ({ src: url }));

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4 text-center">Galleria</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <div
            key={i}
            className="aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer"
            onClick={() => setIndex(i)} // Apre lo slideshow all'immagine cliccata
          >
            <img
              src={url}
              alt={`Galleria immagine ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </section>
  );
}