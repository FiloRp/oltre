// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontHeading = Montserrat({ subsets: ["latin"], variable: "--font-heading", weight: ['700', '800'] });

export const metadata: Metadata = {
  title: "Oltre Viaggi",
  description: "Viaggi che lasciano il segno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable, fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}