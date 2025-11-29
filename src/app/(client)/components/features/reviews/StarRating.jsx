import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  // If no rating or rating is 0, show 5 gray filled stars
  if (!rating || rating === 0) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={`gray-${i}`} className="text-gray-300 fill-gray-300 w-5 h-5" />
        ))}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="text-yellow-300 fill-yellow-300 w-5 h-5" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative w-5 h-5">
          <Star className="text-yellow-300 w-5 h-5 absolute" />
          <div className="overflow-hidden w-1/2 absolute">
            <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300 fill-gray-300 w-5 h-5" />
      ))}
    </div>
  );
};


export default StarRating