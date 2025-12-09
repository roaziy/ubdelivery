'use client'

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoStar, IoStarOutline } from "react-icons/io5";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantName: string;
    orderId: string;
    onSubmit: (rating: { food: number; delivery: number; comment: string }) => void;
}

export default function RatingModal({ isOpen, onClose, restaurantName, orderId, onSubmit }: RatingModalProps) {
    const [foodRating, setFoodRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (foodRating === 0 || deliveryRating === 0) return;
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onSubmit({ food: foodRating, delivery: deliveryRating, comment });
            setIsSubmitting(false);
            setIsSubmitted(true);
            // Auto close after showing success
            setTimeout(() => {
                onClose();
                // Reset state
                setFoodRating(0);
                setDeliveryRating(0);
                setComment("");
                setIsSubmitted(false);
            }, 1500);
        }, 500);
    };

    const StarRating = ({ 
        rating, 
        onRate, 
        label 
    }: { 
        rating: number; 
        onRate: (value: number) => void; 
        label: string;
    }) => (
        <div className="mb-4">
            <p className="text-sm font-medium mb-2">{label}</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRate(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        {star <= rating ? (
                            <IoStar size={32} className="text-yellow-400" />
                        ) : (
                            <IoStarOutline size={32} className="text-gray-300" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-xl">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <IoClose size={20} className="text-gray-600" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {isSubmitted ? (
                        // Success State
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-mainGreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IoStar size={32} className="text-mainGreen" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Баярлалаа!</h3>
                            <p className="text-gray-600 text-sm">Таны үнэлгээг хүлээн авлаа</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold mb-1">Үнэлгээ өгөх</h2>
                                <p className="text-sm text-gray-500">{restaurantName}</p>
                                <p className="text-xs text-gray-400">Order ID: {orderId}</p>
                            </div>

                            {/* Restaurant/Food Image */}
                            <div className="w-20 h-20 bg-gray-200 rounded-xl mx-auto mb-6"></div>

                            {/* Food Rating */}
                            <StarRating 
                                rating={foodRating}
                                onRate={setFoodRating}
                                label="Хоолны чанар"
                            />

                            {/* Delivery Rating */}
                            <StarRating 
                                rating={deliveryRating}
                                onRate={setDeliveryRating}
                                label="Хүргэлтийн үйлчилгээ"
                            />

                            {/* Comment */}
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Нэмэлт сэтгэгдэл (заавал биш)</p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Таны сэтгэгдэл..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-mainGreen resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Submit Button */}
                            <button 
                                onClick={handleSubmit}
                                disabled={foodRating === 0 || deliveryRating === 0 || isSubmitting}
                                className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Илгээж байна..." : "Үнэлгээ илгээх"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
