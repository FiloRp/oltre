// src/app/layout.tsx
import type { Metadata } from "next";
// 1. Importa 'Inter' invece di 'Geist'
import { Inter } from "next/font/google";
import "./globals.css";

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
      {/* 3. Applica la classe del font Inter al body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}