// src/app/(admin)/viaggi/_components/ImageGalleryForm.tsx
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Upload } from 'lucide-react';

interface ImageGalleryFormProps {
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
}

export function ImageGalleryForm({ imageUrls, onImageUrlsChange }: ImageGalleryFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/admin/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();
      if (response.ok) {
        onImageUrlsChange([...imageUrls, newBlob.url]);
      } else {
        throw new Error(newBlob.error || 'Upload fallito');
      }
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'upload dell\'immagine.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    onImageUrlsChange(imageUrls.filter(url => url !== urlToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galleria Immagini</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {imageUrls.map((url) => (
            <div key={url} className="relative group">
              <img src={url} alt="Immagine viaggio" className="rounded-md object-cover aspect-video" />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Caricamento...' : 'Carica Immagine'}
        </Button>
      </CardContent>
    </Card>
  );
}