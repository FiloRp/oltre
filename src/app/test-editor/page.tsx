// src/app/test-editor/page.tsx
"use client";

import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useState } from "react";

export default function TestEditorPage() {
  const [content, setContent] = useState("<p>Ciao mondo!</p>");

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold mb-4">Pagina di Test per l'Editor</h1>
      <p className="mb-2">Se vedi l'editor qui sotto, il componente funziona correttamente.</p>
      
      <RichTextEditor value={content} onChange={setContent} />

      <div className="mt-8 p-4 border bg-gray-50 rounded">
        <h2 className="font-semibold">Contenuto HTML:</h2>
        <pre className="text-sm whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
}