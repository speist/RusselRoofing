import React from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Review } from "@/types/review";

export interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  review,
  isOpen,
  onClose
}) => {
  if (!review) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPlatformName = () => {
    switch (review.platform) {
      case 'google':
        return 'Google';
      case 'facebook':
        return 'Facebook';
      case 'yelp':
        return 'Yelp';
      default:
        return 'Review';
    }
  };

  const getPlatformLogo = () => {
    switch (review.platform) {
      case 'google':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header with platform and verification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getPlatformLogo()}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {getPlatformName()} Review
              </h3>
              {review.verified && (
                <Badge variant="success" size="sm">
                  Verified Review
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={review.rating} size="lg" />
            <p className="text-text-secondary text-sm mt-1">
              {formatDate(review.date)}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-text-primary text-lg mb-1">
            {review.customerName}
          </h4>
          {review.neighborhood && (
            <p className="text-text-secondary text-sm">
              {review.neighborhood}
            </p>
          )}
        </div>

        {/* Full Review Text */}
        <div className="prose prose-lg max-w-none">
          <p className="text-text-primary leading-relaxed text-lg">
            {review.reviewText}
          </p>
        </div>

        {/* Business Response */}
        {review.response && (
          <div className="bg-primary-burgundy/5 border-l-4 border-primary-burgundy rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary-burgundy rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">RR</span>
              </div>
              <div>
                <p className="font-semibold text-text-primary">Russell Roofing</p>
                <p className="text-text-secondary text-sm">Business Owner</p>
              </div>
            </div>
            <p className="text-text-primary italic">
              {review.response}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "text-text-secondary hover:text-text-primary",
                "border border-gray-200 hover:border-gray-300",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2"
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
            
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "text-text-secondary hover:text-text-primary",
                "border border-gray-200 hover:border-gray-300",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2"
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Helpful
            </button>
          </div>

          <p className="text-text-secondary text-sm">
            Review from {getPlatformName()}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export { ReviewModal };