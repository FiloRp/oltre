// src/app/(admin)/admin/impostazioni/_components/CarouselManager.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeCarouselImage } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '../../viaggi/_components/ImageUpload';

interface CarouselManagerProps {
  initialImages: HomeCarouselImage[];
}

export function CarouselManager({ initialImages }: CarouselManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMultipleImages = (urls: string[]) => {
    const newImages = urls.map((url, index) => ({
      id: `new-${Date.now()}-${index}`,
      imageUrl: url,
      altText: 'Immagine carousel',
      order: images.length + index,
      createdAt: new Date(),
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: images.map(img => ({ imageUrl: img.imageUrl })) }),
      });
      if (!response.ok) throw new Error('Salvataggio fallito');
      alert('Carousel salvato con successo!');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Errore durante il salvataggio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carousel Homepage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {images.map(image => (
            <div key={image.id} className="relative">
              <img src={image.imageUrl} alt={image.altText || ''} className="rounded-md aspect-video object-cover" />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveImage(image.id)}>Elimina</Button>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <p className="font-medium mb-2">Aggiungi nuova immagine</p>
          <ImageUpload
            value={null}
            onChange={() => {}} // onChange non è più usato qui
            multiple={true}
            onMultipleChange={handleAddMultipleImages}
          />
        </div>
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? 'Salvataggio...' : 'Salva Modifiche Carousel'}
        </Button>
      </CardContent>
    </Card>
  );
}