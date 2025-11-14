import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAvailableSeats(seats?: number | null): string | null {
  if (seats === null || typeof seats === 'undefined') return null;
  if (seats <= 0) return "Esaurito";
  if (seats === 1) return "Ultimo posto!";
  if (seats > 5) return "5+ posti";
  return `${seats} posti`;
}