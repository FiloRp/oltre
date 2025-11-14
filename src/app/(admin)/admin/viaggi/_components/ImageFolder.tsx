// src/app/(admin)/viaggi/_components/ImageUpload.tsx
"use client";

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url?: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
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
        onChange(newBlob.url);
      } else {
        throw new Error(newBlob.error || 'Upload fallito');
      }
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative group w-full aspect-video rounded-md overflow-hidden">
          <img src={value} alt="Immagine di copertina" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Caricamento...' : 'Carica Immagine di Copertina'}
          </Button>
        </>
      )}
    </div>
  );
}