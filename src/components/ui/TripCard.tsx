// src/components/ui/TripCard.tsx
import Link from 'next/link';
import { Trip, Departure, TeamMember } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Le props ora possono ricevere o un 'trip' o una 'departure'
interface TripCardProps {
  trip: Trip;
  departure?: Departure & { coordinator?: TeamMember | null }; // La partenza è opzionale
}

export function TripCard({ trip, departure }: TripCardProps) {
  return (
    <Link href={`/destinazioni/${trip.slug}`}>
      <Card className="rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <img src={trip.heroImage || '...'} alt={trip.title} className="w-full h-56 object-cover rounded-t-3xl" />
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-2xl font-heading font-bold text-[--foreground] mb-2">{trip.title}</CardTitle>
          <p className="text-gray-600 line-clamp-2">{trip.shortDescription}</p>
          {departure && (
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-700">
              <span>✈️ {format(new Date(departure.startDate), 'dd MMM')} - {format(new Date(departure.endDate), 'dd MMM yyyy')}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <p className="text-2xl font-bold text-[--foreground]">{departure ? `€${departure.price}` : 'Scopri'}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}