'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Restaurant } from "@/lib/types";
import { RestaurantService } from "@/lib/api";
import { mockRestaurants, simulateDelay } from "@/lib/mockData";
import { RestaurantCardSkeleton } from "@/components/ui/Skeleton";

interface RestaurantCardListProps {
    limit?: number;
}

export default function RestaurantCard({ limit = 4 }: RestaurantCardListProps) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await RestaurantService.getAll({
                    page: 1,
                    pageSize: limit || 4,
                    sortBy: 'rating'
                });
                if (response.success && response.data) {
                    setRestaurants(response.data.items);
                } else {
                    // Fallback to mock data
                    await simulateDelay(800);
                    setRestaurants(mockRestaurants as Restaurant[]);
                }
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
                await simulateDelay(800);
                setRestaurants(mockRestaurants as Restaurant[]);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) {
        return (
            <>
                {[...Array(limit)].map((_, i) => (
                    <RestaurantCardSkeleton key={i} />
                ))}
            </>
        );
    }

    return (
        <>
            {restaurants.slice(0, limit).map((restaurant) => (
                <Link 
                    key={restaurant.id}
                    href={`/home/restaurants/${restaurant.id}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                    <div className="relative">
                        <div className="h-24 md:h-28 bg-gray-300 rounded-t-xl">
                            {restaurant.banner && (
                                <img 
                                    src={restaurant.banner} 
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover rounded-t-xl"
                                />
                            )}
                        </div>
                        <div className="absolute -bottom-2 left-4 bg-white w-12 h-12 border border-gray-200 rounded-xl overflow-hidden">
                            {restaurant.logo && (
                                <img 
                                    src={restaurant.logo} 
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        {!restaurant.isOpen && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                Хаалттай
                            </div>
                        )}
                    </div>
                    <div className="pt-4 pb-4 px-4">
                        <h3 className="font-semibold text-base mb-0 select-none">{restaurant.name}</h3>
                        <p className="text-gray-500 text-[12px] mb-1 select-none">{restaurant.type}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1.5 select-none">
                                <FaRegClock size={14} />
                                <span>{restaurant.hours}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-mainGreen select-none">
                                <FaStar size={14} />
                                <span>{restaurant.rating}</span>
                            </div>
                        </div>
                        {restaurant.deliveryTime && (
                            <p className="text-xs text-gray-400 mt-2">
                                Хүргэлт: {restaurant.deliveryTime}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </>
    );
}