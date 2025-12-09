'use client'

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { FoodItem } from "@/lib/types";
import { CartAPI } from "@/lib/api";
import { useNotifications } from "@/components/ui/Notification";

interface FoodDetailModalProps {
    food: FoodItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const notify = useNotifications();

    if (!isOpen || !food) return null;

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        try {
            const response = await CartAPI.addItem(food.id, quantity);
            if (response.success) {
                notify.success('Амжилттай', `${food.name} (${quantity}ш) сагсанд нэмэгдлээ`);
                setQuantity(1);
                onClose();
            } else {
                notify.error('Алдаа', response.error || 'Сагсанд нэмэхэд алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const totalPrice = food.price * quantity;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-hidden shadow-xl">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                    <IoClose size={20} className="text-gray-600" />
                </button>

                {/* Food Image */}
                <div className="h-48 md:h-48 bg-gray-400 w-full">
                    {food.image && (
                        <img 
                            src={food.image} 
                            alt={food.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title and Restaurant */}
                    <h2 className="text-lg font-semibold mb-1">{food.name}</h2>
                    <p className="text-mainGreen text-sm mb-4">{food.restaurantName}</p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {food.category && (
                            <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                                {food.category}
                            </span>
                        )}
                        {food.servings && (
                            <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                                {food.servings} хүн
                            </span>
                        )}
                        {food.calories && (
                            <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                                {food.calories} ккал
                            </span>
                        )}
                        {food.preparationTime && (
                            <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                                {food.preparationTime} мин
                            </span>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="mb-4">
                        <h3 className="font-medium text-sm mb-2">Нэмэлт мэдээлэл</h3>
                        <p className="text-gray-600 text-sm">
                            {food.description || "Энэхүү хоол маш амттай, чанартай орцуудаар хийгдсэн."}
                        </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500">Нийт үнэ</p>
                            <p className="text-xl font-bold">₮{totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoIosRemove size={20} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(1)}
                                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors"
                            >
                                <IoIosAdd size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || !food.isAvailable}
                        className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAddingToCart ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Нэмэж байна...
                            </>
                        ) : !food.isAvailable ? (
                            'Дууссан'
                        ) : (
                            'Сагсанд нэмэх'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
