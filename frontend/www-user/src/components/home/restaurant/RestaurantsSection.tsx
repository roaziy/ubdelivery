'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Restaurant } from "@/lib/types";
import { RestaurantService } from "@/lib/api";
import { RestaurantCardSkeleton } from "@/components/ui/Skeleton";
import dynamic from 'next/dynamic';

const RestaurantMap = dynamic(() => import('./RestaurantMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainGreen mx-auto mb-4"></div>
                <p className="text-gray-600">Газрын зураг ачаалж байна...</p>
            </div>
        </div>
    ),
});

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <Link 
            href={`/home/restaurants/${restaurant.id}`}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
        >
            <div className="relative">
                <div className="h-24 md:h-28 bg-gray-200 rounded-t-xl">
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
            </div>
        </Link>
    );
}

export default function RestaurantsSection() {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    
    const itemsPerPage = 20;

    // Fetch featured restaurants (top rated)
    useEffect(() => {
        const fetchFeatured = async () => {
            setFeaturedLoading(true);
            try {
                const response = await RestaurantService.getAll({
                    page: 1,
                    pageSize: 4,
                    sortBy: 'rating'
                });
                if (response.success && response.data) {
                    setFeaturedRestaurants(response.data.items);
                }
            } catch (error) {
                console.error('Error fetching featured restaurants:', error);
            } finally {
                setFeaturedLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Fetch all restaurants with pagination and search
    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await RestaurantService.getAll({
                    page: currentPage,
                    pageSize: itemsPerPage,
                    query: searchQuery || undefined
                });
                if (response.success && response.data) {
                    setAllRestaurants(response.data.items);
                    setTotalPages(response.data.totalPages);
                } else {
                    setAllRestaurants([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setAllRestaurants([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, [currentPage, searchQuery]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-3 w-full max-w-[500px]">
                    <IoSearch className="text-gray-400 mr-2" size={20} />
                    <input 
                        type="text" 
                        placeholder="Restaurant-ны нэрээр хайх"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

            {/* Featured Restaurants */}
            <section className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Онцлох ресторанууд</h2>
                
                {featuredLoading ? (
                    <>
                        <div className="hidden md:grid grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <RestaurantCardSkeleton key={i} />
                            ))}
                        </div>
                        <div className="md:hidden flex flex-col gap-4">
                            {[...Array(2)].map((_, i) => (
                                <RestaurantCardSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="hidden md:grid grid-cols-4 gap-4">
                            {featuredRestaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                        <div className="md:hidden flex flex-col gap-4">
                            {featuredRestaurants.slice(0, 4).map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* All Restaurants */}
            <section className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Бүх ресторанууд</h2>
                
                {/* View Toggle */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2 rounded-full text-sm transition-colors ${
                            viewMode === 'list'
                                ? 'bg-mainGreen text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                        }`}
                    >
                        Жагсаалтаар
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-6 py-2 rounded-full text-sm transition-colors ${
                            viewMode === 'map'
                                ? 'bg-mainGreen text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                        }`}
                    >
                        Газрын зурагаас
                    </button>
                </div>

                {/* List View */}
                {viewMode === 'list' && (
                    <>
                        {loading ? (
                            <>
                                <div className="hidden md:grid grid-cols-4 gap-4">
                                    {[...Array(itemsPerPage)].map((_, i) => (
                                        <RestaurantCardSkeleton key={i} />
                                    ))}
                                </div>
                                <div className="md:hidden flex flex-col gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <RestaurantCardSkeleton key={i} />
                                    ))}
                                </div>
                            </>
                        ) : allRestaurants.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Ресторан олдсонгүй</p>
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 text-mainGreen hover:underline"
                                    >
                                        Хайлт арилгах
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:grid grid-cols-4 gap-4">
                                    {allRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                                <div className="md:hidden flex flex-col gap-4">
                                    {allRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && !loading && (
                            <div className="flex justify-center items-center gap-2 mt-8 mb-32 md:mb-16">
                                <button 
                                    className={`text-sm transition-colors flex items-center gap-1 ${
                                        currentPage === 1 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-500 hover:text-mainGreen'
                                    }`}
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &lt; Өмнөх
                                </button>
                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-full text-sm transition-colors ${
                                                currentPage === page 
                                                    ? 'bg-mainGreen text-white' 
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ) : (
                                        <span key={index} className="text-gray-400">{page}</span>
                                    )
                                ))}
                                <button 
                                    className={`text-sm transition-colors flex items-center gap-1 ${
                                        currentPage === totalPages 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-500 hover:text-mainGreen'
                                    }`}
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Дараах &gt;
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                    <div className="w-full h-[500px] md:h-[600px] bg-gray-100 rounded-2xl overflow-hidden mb-32 md:mb-16">
                        <RestaurantMap restaurants={allRestaurants} />
                    </div>
                )}
            </section>
        </>
    );
}
