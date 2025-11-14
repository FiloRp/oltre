// src/components/ui/ReviewCard.tsx
import { Review } from '@prisma/client';
import { Star } from 'lucide-react';
import { StarRatingDisplay } from './StarRatingDisplay';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center mb-4">
        <img
          src={review.userPhotoUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${review.userName}`}
          alt={review.userName}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-bold">{review.userName}</p>
					<StarRatingDisplay rating={review.rating} />
				</div>
			</div>
      <p className="text-gray-600">{review.reviewText}</p>
      {review.trustpilotUrl && (
        <a href={review.trustpilotUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 mt-4 inline-block">
          Leggi su Trustpilot
        </a>
      )}
    </div>
  );
}