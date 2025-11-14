// src/app/(public)/contatti/page.tsx
export default function ContattiPage() {
  return (
    <div className="container py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl font-bold">Contattaci</h1>
        <p className="mt-4 text-lg text-gray-600">
          Hai domande, dubbi o vuoi semplicemente salutarci? Siamo qui per aiutarti. Scegli il modo che preferisci per metterti in contatto con noi.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-xl font-semibold">Email</h3>
          <p className="text-gray-600 mt-2">Per informazioni generali e prenotazioni:</p>
          <a href="mailto:info@oltreviaggi.com" className="text-blue-600 font-bold">info@oltreviaggi.com</a>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Telefono / WhatsApp</h3>
          <p className="text-gray-600 mt-2">Per un contatto più diretto:</p>
          <a href="tel:+391234567890" className="text-blue-600 font-bold">+39 123 456 7890</a>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Social Media</h3>
          <p className="text-gray-600 mt-2">Seguici per non perdere nessuna avventura:</p>
          {/* Aggiungi qui i link ai tuoi social */}
        </div>
      </div>
    </div>
  );
}