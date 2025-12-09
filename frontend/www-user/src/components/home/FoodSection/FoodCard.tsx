'use client'

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { FoodItem } from "@/lib/types";
import { FoodService } from "@/lib/api";
import { mockFoods, simulateDelay } from "@/lib/mockData";
import { FoodCardSkeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/components/ui/Notification";

interface FoodCardProps {
    onFoodClick?: (food: FoodItem) => void;
    onAddToCart?: (food: FoodItem) => void;
    limit?: number;
}

export default function FoodCard({ onFoodClick, onAddToCart, limit }: FoodCardProps) {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotifications();
    
    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            try {
                const response = await FoodService.getFeatured();
                if (response.success && response.data) {
                    setFoods(response.data);
                } else {
                    // Fallback to mock data
                    await simulateDelay(800);
                    setFoods(mockFoods as FoodItem[]);
                }
            } catch (error) {
                console.error('Failed to fetch foods:', error);
                await simulateDelay(800);
                setFoods(mockFoods as FoodItem[]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchFoods();
    }, []);

    const handleAddToCart = (e: React.MouseEvent, food: FoodItem) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(food);
        }
        notify.success('Сагсанд нэмэгдлээ', `${food.name} сагсанд нэмэгдлээ`);
    };
    
    const displayItems = limit ? foods.slice(0, limit) : foods;
    
    if (loading) {
        return (
            <>
                {[...Array(limit || 4)].map((_, i) => (
                    <FoodCardSkeleton key={i} />
                ))}
            </>
        );
    }
    
    return (
        <>
            {displayItems.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onFoodClick?.(item)}
                >
                    <div className="relative h-32 md:h-36 bg-gray-300">
                        {item.image && (
                            <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 select-none">
                            <FaStar className="text-mainGreen" /> {item.rating}
                        </div>
                        {item.discountedPrice && item.discountedPrice < item.price && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                -{Math.round((1 - item.discountedPrice / item.price) * 100)}%
                            </div>
                        )}
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 select-none">{item.name}</h3>
                        <p className="text-mainGreen text-xs mb-2 select-none">{item.restaurantName}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {item.discountedPrice && item.discountedPrice < item.price ? (
                                    <>
                                        <span className="font-semibold text-red-500">₮{item.discountedPrice.toLocaleString()}</span>
                                        <span className="text-xs text-gray-400 line-through">₮{item.price.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="font-semibold">₮{item.price.toLocaleString()}</span>
                                )}
                            </div>
                            <button 
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen hover:bg-mainGreen hover:text-white transition-colors group"
                                onClick={(e) => handleAddToCart(e, item)}
                            >
                                <IoIosAdd className="text-xl text-gray-600 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

// Re-export the FoodItem type for convenience
export type { FoodItem };