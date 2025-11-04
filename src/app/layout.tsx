// src/app/layout.tsx
import type { Metadata } from "next";
// 1. Importa 'Inter' invece di 'Geist'
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// 2. Inizializza il font Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oltre Travel", // Puoi personalizzare il titolo
  description: "Viaggi e avventure organizzate", // E la descrizione
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        {children}
      </body>
    </html>
  );
}