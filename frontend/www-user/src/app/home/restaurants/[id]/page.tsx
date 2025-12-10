'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HeaderHomeTopper from "@/components/home/header/headerHomeTopper";
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom";
import FooterHome from "@/components/home/footerHome";
import RestaurantProfile from "@/components/home/restaurant/RestaurantProfile";
import RestaurantFoodSection from "@/components/home/restaurant/RestaurantFoodSection";
import { RestaurantService } from "@/lib/api";
import { Restaurant } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RestaurantDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!id) return;
            
            setLoading(true);
            try {
                const response = await RestaurantService.getById(id);
                if (response.success && response.data) {
                    setRestaurant(response.data);
                } else {
                    console.error('Failed to fetch restaurant:', response.error);
                }
            } catch (error) {
                console.error('Error fetching restaurant:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-backgroundGreen flex flex-col">
                <HeaderHomeTopper />
                <HeaderHomeBottom />
                <main className="flex-1 pt-20 md:pt-24">
                    <div className="container max-w-[1250px] mx-auto px-4">
                        <Skeleton className="w-full h-[300px] rounded-2xl mb-8" />
                        <Skeleton className="w-full h-64 rounded-2xl" />
                    </div>
                </main>
                <FooterHome />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-backgroundGreen flex flex-col">
                <HeaderHomeTopper />
                <HeaderHomeBottom />
                <main className="flex-1 pt-20 md:pt-24">
                    <div className="container max-w-[1250px] mx-auto px-4">
                        <div className="text-center py-12">
                            <p className="text-gray-500">Ресторан олдсонгүй</p>
                        </div>
                    </div>
                </main>
                <FooterHome />
            </div>
        );
    }

    // Transform Restaurant type to match RestaurantProfile props
    const restaurantData = {
        id: parseInt(restaurant.id) || 0,
        name: restaurant.name,
        type: restaurant.cuisineType || restaurant.type || '',
        hours: restaurant.hours || '09:00 - 22:00',
        rating: restaurant.rating || 0,
        reviews: restaurant.reviewCount || 0,
        distance: '0.20 км', // This would come from location calculation
        phone: restaurant.phone || '',
        email: restaurant.phone || '' // Email not in Restaurant type, using phone as fallback
    };

    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <HeaderHomeTopper />
            <HeaderHomeBottom />

            <main className="flex-1 pt-20 md:pt-24">
                <div className="container max-w-[1250px] mx-auto px-4">
                    {/* Restaurant Profile */}
                    <RestaurantProfile restaurant={restaurantData} />

                    {/* Restaurant Foods */}
                    <RestaurantFoodSection restaurantName={restaurant.name} restaurantId={restaurant.id} />
                </div>
            </main>

            <FooterHome />
        </div>
    );
}
