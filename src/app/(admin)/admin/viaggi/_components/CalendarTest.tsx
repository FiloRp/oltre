// src/app/(admin)/viaggi/_components/CalendarTest.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarTest() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div className="border-4 border-red-500 p-4 my-8">
      <h2 className="font-bold text-lg mb-2">--- INIZIO BLOCCO DI TEST ---</h2>
      <p>Questo è un test isolato. Se questo calendario si apre, il problema è l'interferenza con il Dialog.</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <h2 className="font-bold text-lg mt-2">--- FINE BLOCCO DI TEST ---</h2>
    </div>
  );
}