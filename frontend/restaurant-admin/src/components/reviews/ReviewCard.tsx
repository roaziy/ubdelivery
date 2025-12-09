'use client'

import { IoStar } from "react-icons/io5";

interface Review {
    id: string;
    orderId: string;
    customerName: string;
    date: string;
    rating: number;
    reviewText: string;
}

interface ReviewCardProps {
    review: Review;
    onViewDetails: () => void;
}

export default function ReviewCard({ review, onViewDetails }: ReviewCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Header */}
            <div className="mb-3">
                <p className="font-semibold">Order: {review.orderId} – {review.customerName}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-6">
                {review.reviewText}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {/* Rating */}
                <div className="flex items-center gap-1">
                    <IoStar className="text-mainGreen" size={16} />
                    <span className="text-sm font-medium">{review.rating} / 5</span>
                </div>

                {/* View Details Button */}
                <button 
                    onClick={onViewDetails}
                    className="px-5 py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                    Захиалгын мэдээлэл
                </button>
            </div>
        </div>
    );
}

export type { Review };
