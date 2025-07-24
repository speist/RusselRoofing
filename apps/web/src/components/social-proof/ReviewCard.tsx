import React from "react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { Review } from "@/types/review";

export interface ReviewCardProps {
  review: Review;
  onReadMore?: (review: Review) => void;
  showStaggerAnimation?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReadMore,
  showStaggerAnimation = false,
  className
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getPlatformIcon = () => {
    switch (review.platform) {
      case 'google':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'yelp':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0c-6.632 0-12.017 5.385-12.017 12.017s5.385 12.017 12.017 12.017 12.017-5.385 12.017-12.017-5.385-12.017-12.017-12.017zm5.109 16.775l-1.328 3.49c-.084.202-.292.318-.511.285-.219-.034-.396-.215-.434-.438l-.49-2.842c-.019-.108-.003-.219.046-.317l1.063-2.128c.067-.133.203-.216.352-.216.149 0 .285.083.352.216l1.063 2.128c.049.098.065.209.046.317l-.159.505z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-card shadow-card hover:shadow-card-hover",
        "p-6 transition-all duration-300 ease-in-out",
        "min-h-[280px] flex flex-col",
        className
      )}
    >
      {/* Header with rating and platform */}
      <div className="flex items-center justify-between mb-4">
        <StarRating 
          rating={review.rating} 
          showStaggerAnimation={showStaggerAnimation}
          size="md"
        />
        <div className="flex items-center gap-2">
          {review.verified && (
            <span className="text-accent-success-green text-xs font-medium">
              Verified
            </span>
          )}
          <div className="text-gray-400">
            {getPlatformIcon()}
          </div>
        </div>
      </div>

      {/* Review text */}
      <div className="flex-1 mb-4">
        <p className="text-text-primary text-body leading-relaxed">
          {review.shortText}
        </p>
        {review.reviewText.length > review.shortText.length && onReadMore && (
          <button
            onClick={() => onReadMore(review)}
            className={cn(
              "text-primary-burgundy text-sm font-medium mt-2",
              "hover:underline focus:outline-none focus:underline",
              "transition-colors duration-200"
            )}
            aria-label={`Read full review by ${review.customerName}`}
          >
            Read more
          </button>
        )}
      </div>

      {/* Customer info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-primary font-medium text-body">
            {review.customerName}
          </p>
          {review.neighborhood && (
            <p className="text-text-secondary text-body-sm">
              {review.neighborhood}
            </p>
          )}
        </div>
        <p className="text-text-secondary text-body-sm">
          {formatDate(review.date)}
        </p>
      </div>
    </div>
  );
};

export { ReviewCard };