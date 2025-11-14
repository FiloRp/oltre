// src/components/ui/StarRatingInput.tsx
"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-6 w-6 cursor-pointer",
            star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}