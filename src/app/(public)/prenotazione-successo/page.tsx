// src/app/(public)/prenotazione-successo/page.tsx
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrenotazioneSuccessoPage() {
  return (
    <div className="container flex items-center justify-center py-20">
      <div className="text-center max-w-2xl">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-4xl font-bold">Grazie per la tua prenotazione!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Abbiamo ricevuto correttamente la tua richiesta. A breve riceverai un'email di riepilogo con tutti i dettagli e le istruzioni per i prossimi passi.
        </p>
        <p className="mt-2 text-gray-600">
          Per qualsiasi dubbio o richiesta, non esitare a contattarci.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Torna alla Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/destinazioni">Scopri altri viaggi</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}