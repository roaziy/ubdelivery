'use client'

import { useState } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const featuredRestaurants = [
    { id: 1, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 2, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 3, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 4, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
];

const allRestaurants = [
    { id: 1, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 2, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 3, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 4, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 5, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 6, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 7, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 8, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 9, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 10, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 11, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 12, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 13, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 14, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 15, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 16, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 17, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 18, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 19, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 20, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 21, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 22, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 23, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 24, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 25, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
];

interface Restaurant {
    id: number;
    name: string;
    type: string;
    hours: string;
    rating: number;
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <Link 
            href={`/home/restaurants/${restaurant.id}`}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
        >
            <div className="relative">
                <div className="h-24 md:h-28 bg-gray-200 rounded-t-xl"></div>
                <div className="absolute -bottom-2 left-4 bg-white w-12 h-12 border border-gray-200 rounded-xl"></div>
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
    
    const itemsPerPage = 20;
    const totalPages = Math.ceil(allRestaurants.length / itemsPerPage);
    
    // Get restaurants for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRestaurants = allRestaurants.slice(startIndex, endIndex);

    // Generate page numbers to display
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
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

            {/* Featured Restaurants */}
            <section className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Онцлох ресторанууд</h2>
                
                {/* Desktop: 4 columns grid */}
                <div className="hidden md:grid grid-cols-4 gap-4">
                    {featuredRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>

                {/* Mobile: Vertical stack */}
                <div className="md:hidden flex flex-col gap-4">
                    {featuredRestaurants.slice(0, 4).map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
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
                        {/* Desktop: 4 columns grid */}
                        <div className="hidden md:grid grid-cols-4 gap-4">
                            {currentRestaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>

                        {/* Mobile: Vertical stack */}
                        <div className="md:hidden flex flex-col gap-4">
                            {currentRestaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>

                        {/* Pagination */}
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
                                &lt; Previous
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
                                Next &gt;
                            </button>
                        </div>
                    </>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                    <div className="w-full h-[500px] md:h-[600px] bg-gray-100 rounded-2xl overflow-hidden mb-32 md:mb-16">
                        {/* Map placeholder - you can integrate Google Maps or Mapbox here */}
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <div className="text-center">
                                <div className="w-full h-full relative">
                                    {/* Placeholder map image */}
                                    <div className="absolute inset-0 bg-[url('/map-placeholder.png')] bg-cover bg-center opacity-50"></div>
                                    <div className="relative z-10 p-8">
                                        <p className="text-gray-600 text-lg font-medium">Газрын зураг</p>
                                        <p className="text-gray-500 text-sm mt-2">Ресторануудын байршлыг харах</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
