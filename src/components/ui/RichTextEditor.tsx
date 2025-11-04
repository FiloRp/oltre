// src/components/ui/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="border border-input border-b-0 rounded-t-lg p-2 flex gap-4 items-center bg-transparent">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200 p-1 rounded' : 'p-1'}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200 p-1 rounded' : 'p-1'}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200 p-1 rounded' : 'p-1'}>List</button>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    // --- LA MODIFICA CHIAVE È QUI ---
    immediatelyRender: false, // Dice a Tiptap di non fare nulla finché non è pronto
    // --------------------------------

    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert min-h-[150px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Questa parte rimane fondamentale come rete di sicurezza
  if (!isMounted || !editor) {
    return <div className="min-h-[210px] border rounded-lg bg-gray-100 animate-pulse"></div>;
  }

  // Ora che siamo sicuri di essere nel client, possiamo renderizzare
  return (
    <div className="flex flex-col">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}