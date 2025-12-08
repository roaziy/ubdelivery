'use client'

import { FaStar } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";

export interface FoodItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    rating: number;
    description?: string;
}

interface FoodCardProps {
    onFoodClick?: (food: FoodItem) => void;
}

const foodItems: FoodItem[] = [
    { id: 1, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё пицза нь хүн аймар гоч пицза юм!!!" },
    { id: 2, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё пицза нь хүн аймар гоч пицза юм!!!" },
    { id: 3, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё пицза нь хүн аймар гоч пицза юм!!!" },
    { id: 4, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё пицза нь хүн аймар гоч пицза юм!!!" },
];

export default function FoodCard({ onFoodClick }: FoodCardProps) {
    return (
        <>
            {foodItems.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onFoodClick?.(item)}
                >
                    <div className="relative h-32 md:h-36 bg-gray-400">
                        <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 select-none">
                            <FaStar className="text-mainGreen" /> {item.rating}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 select-none">{item.name}</h3>
                        <p className="text-mainGreen text-xs mb-2 select-none">{item.restaurant}</p>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">₮{item.price.toLocaleString()}</span>
                            <button 
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click when clicking add button
                                    // Add to cart logic here
                                }}
                            >
                                <IoIosAdd className="text-xl text-gray-600 hover:text-mainGreen" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}