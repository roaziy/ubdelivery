'use client'

import { IoClose } from "react-icons/io5";
import { IoIosRemove, IoIosAdd } from "react-icons/io";

interface FoodItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    rating: number;
    description?: string;
    size?: string;
    servings?: string;
    calories?: string;
}

interface FoodDetailModalProps {
    food: FoodItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
    if (!isOpen || !food) return null;

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
                <div className="h-48 md:h-48 bg-gray-400 w-full" />

                {/* Content */}
                <div className="p-5">
                    {/* Title and Restaurant */}
                    <h2 className="text-lg font-semibold mb-1">{food.name}</h2>
                    <p className="text-mainGreen text-sm mb-4">{food.restaurant}</p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                            Үхэр
                        </span>
                        <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                            1 хүн
                        </span>
                        <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                            330 ккал
                        </span>
                    </div>

                    {/* Additional Info */}
                    <div className="mb-4">
                        <h3 className="font-medium text-sm mb-2">Нэмэлт мэдээлэл</h3>
                        <p className="text-gray-600 text-sm">
                            {food.description || "Энэхүү хүн аймар гоё пицза нь хүн аймар гоч пицза юм!!!"}
                        </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500">Нийт үнэ</p>
                            <p className="text-xl font-bold">₮{food.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors">
                                <IoIosRemove size={20} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-medium w-8 text-center">1</span>
                            <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors">
                                <IoIosAdd size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors">
                        Сагсанд нэмэх
                    </button>
                </div>
            </div>
        </div>
    );
}
