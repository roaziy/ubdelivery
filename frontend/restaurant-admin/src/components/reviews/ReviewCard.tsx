'use client'

import { IoStar } from "react-icons/io5";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  onViewDetails: () => void;
}

export default function ReviewCard({ 
  review, 
  onViewDetails 
}: ReviewCardProps) {
  // Format date for display
  const formattedDate = new Date(review.createdAt).toLocaleString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="mb-3">
        <p className="font-semibold">
          Order: {review.orderId} – {review.userName}
        </p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>

      {/* Review Text */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-6">
        {review.comment || 'Сэтгэгдэл бичээгүй'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <IoStar className="text-mainGreen" size={16} />
          <span className="text-sm font-medium">
            {review.foodRating} / 5
          </span>
        </div>

        {/* View Details Button */}
        <button 
          onClick={onViewDetails}
          className="px-5 py-2 bg-mainGreen text-white rounded-full 
            text-sm font-medium hover:bg-green-600 transition-colors"
        >
          Захиалгын мэдээлэл
        </button>
      </div>
    </div>
  );
}
