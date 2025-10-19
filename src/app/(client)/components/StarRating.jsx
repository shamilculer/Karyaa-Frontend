// File: components/StarRating.jsx (New File)

import React from 'react';
import { Star } from 'lucide-react'; // Using Lucide icon for better integration, but the SVG logic works too

// Function to determine if a star should be full, half, or empty
const getStarType = (rating, starIndex) => {
    // starIndex runs from 1 to 5
    if (rating >= starIndex) {
        return 'full';
    } else if (rating > starIndex - 1 && rating < starIndex) {
        return 'half';
    } else {
        return 'empty';
    }
};

const StarRating = ({ rating = 0, size = 5, totalStars = 5 }) => {
    // Ensure rating is clamped between 0 and totalStars
    const safeRating = Math.max(0, Math.min(totalStars, rating));
    
    // Array to iterate over (1, 2, 3, 4, 5)
    const starArray = Array.from({ length: totalStars }, (_, i) => i + 1);

    return (
        <div className="flex items-center">
            {starArray.map((starIndex) => {
                const type = getStarType(safeRating, starIndex);
                
                // You can swap the Lucide <Star /> component for your original SVG if preferred
                return (
                    <span key={starIndex} className="relative inline-flex items-center">
                        {/* 1. Full/Empty/Half Star Base */}
                        <Star 
                            className={`w-${size} h-${size} me-1 ${type === 'empty' ? 'text-gray-300' : 'text-yellow-400'} fill-current`} 
                            aria-hidden="true" 
                        />
                        
                        {/* 2. Overlay the Half Star logic if needed */}
                        {type === 'half' && (
                            <div 
                                className="absolute top-0 left-0 overflow-hidden" 
                                style={{ width: `${(safeRating - (starIndex - 1)) * 100}%` }}
                            >
                                <Star 
                                    className={`w-${size} h-${size} me-1 text-yellow-400 fill-current`} 
                                    aria-hidden="true" 
                                />
                            </div>
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;