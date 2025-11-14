// src/app/(admin)/admin/viaggi/_components/ImageUpload.tsx
"use client";

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url?: string | null) => void;
  multiple?: boolean; // <-- Nuova prop per abilitare l'upload multiplo
  onMultipleChange?: (urls: string[]) => void; // <-- Nuovo callback per l'upload multiplo
}

export function ImageUpload({ value, onChange, multiple = false, onMultipleChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      if (multiple && onMultipleChange) {
        // --- LOGICA PER UPLOAD MULTIPLO ---
        const uploadPromises = Array.from(files).map(file =>
          fetch(`/api/admin/upload?filename=${file.name}`, {
            method: 'POST',
            body: file,
          }).then(res => res.json())
        );
        
        const uploadedBlobs = await Promise.all(uploadPromises);
        const newUrls = uploadedBlobs.map(blob => blob.url);
        onMultipleChange(newUrls);

      } else {
        // --- LOGICA PER UPLOAD SINGOLO (invariata) ---
        const file = files[0];
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
      }
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'upload.');
    } finally {
      setIsUploading(false);
      // Resetta l'input per permettere di caricare gli stessi file di nuovo
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // --- FUNZIONE CORRETTA PER LA RIMOZIONE ---
  const handleRemoveImage = async () => {
    if (!value) return;

    try {
      // 1. Chiama la nostra API per eliminare il file fisico
      const response = await fetch('/api/admin/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });

      if (!response.ok) {
        throw new Error('Eliminazione dal blob fallita.');
      }

      // 2. Se l'eliminazione fisica ha successo, aggiorna lo stato del form a null
      onChange(null);

    } catch (error) {
      console.error("Errore durante la rimozione dell'immagine:", error);
      alert("Non è stato possibile eliminare l'immagine dallo storage.");
    }
  };

   return (
    <div>
      {value && !multiple ? ( // Mostra l'anteprima solo per l'upload singolo
        <div className="relative group w-full aspect-video rounded-md overflow-hidden">
          <img src={value} alt="Immagine di copertina" className="w-full h-full object-cover" />
          <button type="button" onClick={handleRemoveImage} className="...">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            multiple={multiple} // <-- Abilita la selezione multipla nell'input
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Caricamento...' : (multiple ? 'Carica Immagini' : 'Carica Immagine')}
          </Button>
        </>
      )}
    </div>
  );
}