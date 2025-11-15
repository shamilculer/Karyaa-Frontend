
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { getInitials } from '@/utils';

// Helper to pick a consistent color from name
function getBgColor(name) {
    const colors = [
        "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    ];
    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

const Reviews = ({ reviews }) => {

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {reviews.map((reviewData) => (
                    <ReviewCard key={reviewData._id} review={reviewData} />
                ))}
            </div>
        </div>
    );
};

export default Reviews



const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    );
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const ReviewCard = ({ review }) => {
    const { user, rating, comment, createdAt } = review;

    const userInitials = getInitials(user.username)
    const bgColor = getBgColor(user.username);

    return (
        <div>

            {/* 1. Header: User Info and Rating */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">

                    <Avatar className="size-16 rounded-full">
                        <AvatarImage
                            src={user.profileImage}
                            alt={user.username}
                            className="size-full object-cover mr-4 ring-2 ring-indigo-400/50"
                        />
                        <AvatarFallback className={`${bgColor} text-white font-bold flex items-center justify-center`} >{userInitials}</AvatarFallback>
                    </Avatar>

                    {/* Username and Date */}
                    <div>
                        <p className="!text-lg font-bold text-gray-800 capitalize">{user.username}</p>
                        <p className="!text-sm text-gray-500">
                            Reviewed on {formatDate(createdAt)}
                        </p>
                    </div>
                </div>

                {/* Rating Stars */}
                <StarRating rating={rating} />
            </div>

            {/* 2. Review Comment */}
            <div>
                <p className="text-gray-700 leading-relaxed">
                    {comment}
                </p>
            </div>
        </div>
    );
};
