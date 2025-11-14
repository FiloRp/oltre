// src/components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-2">OLTRE</h3>
            <p className="text-sm text-gray-600">Viaggi che lasciano il segno.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Navigazione</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/chi-siamo">Chi Siamo</Link></li>
              <li><Link href="/destinazioni">Destinazioni</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legale</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/termini-e-condizioni">Termini e Condizioni</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Social</h3>
            {/* Aggiungi qui i link ai social */}
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Oltre. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}