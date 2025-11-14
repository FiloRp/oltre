// src/components/ui/TripCard.tsx
import Link from 'next/link';
import { Trip, Departure, TeamMember } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Le props ora possono ricevere o un 'trip' o una 'departure'
interface TripCardProps {
  trip: Trip;
  departure?: Departure & { coordinator?: TeamMember | null }; // La partenza è opzionale
}

export function TripCard({ trip, departure }: TripCardProps) {
  return (
    <Link href={`/destinazioni/${trip.slug}`}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="p-0 relative">
          <img
            src={trip.heroImage || 'https://via.placeholder.com/400x225'}
            alt={trip.title}
            className="w-full h-48 object-cover"
          />
          {/* Mostra la data solo se la prop 'departure' è presente */}
          {departure && (
            <div className="absolute bottom-0 left-0 bg-black/60 text-white p-2 text-sm font-semibold">
              {format(new Date(departure.startDate), 'dd MMM yyyy')}
            </div>
          )}
          {departure?.coordinator && (
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img src={departure.coordinator.photoUrl} alt={departure.coordinator.name} className="h-10 w-10 rounded-full object-cover border-2 border-white" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coordinatore: {departure.coordinator.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl mb-2">{trip.title}</CardTitle>
          <p className="text-sm text-gray-600">{trip.shortDescription}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="font-semibold">Scopri di più</p>
          {/* Mostra il prezzo solo se la prop 'departure' è presente */}
          {departure && (
            <p className="text-lg font-bold">€{departure.price}</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}