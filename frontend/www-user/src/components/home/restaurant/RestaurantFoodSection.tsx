'use client'

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import FoodCard, { FoodItem } from "@/components/home/FoodSection/FoodCard";
import FoodDetailModal from "@/components/home/FoodSection/FoodDetailModal";

interface RestaurantFoodSectionProps {
    restaurantName: string;
}

const categories = ['Бүх хоол', 'Үндсэн хоол', 'Хачир', 'Нэмэлт'];

export default function RestaurantFoodSection({ restaurantName }: RestaurantFoodSectionProps) {
    const [activeCategory, setActiveCategory] = useState(0);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFoodClick = (food: FoodItem) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFood(null);
    };

    return (
        <>
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex justify-center mb-6">
                <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full max-w-[500px]">
                    <IoSearch className="text-gray-400 mr-2" size={20} />
                    <input 
                        type="text" 
                        placeholder={`${restaurantName}-ын menu дээрээс хайх`}
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

            {/* Food Categories */}
            <section className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Хоолны ангилалууд</h2>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {categories.map((category, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveCategory(index)}
                            className={`px-4 md:px-5 py-2 rounded-full text-sm transition-colors ${
                                activeCategory === index 
                                    ? 'bg-mainGreen text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Food Grid */}
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <FoodCard onFoodClick={handleFoodClick} />
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mb-16">
                <button 
                    className="text-sm text-gray-500 hover:text-mainGreen transition-colors flex items-center gap-1"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                    &lt; Previous
                </button>
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-full text-sm transition-colors ${
                            currentPage === page 
                                ? 'bg-mainGreen text-white' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <span className="text-gray-400">...</span>
                <button 
                    className="text-sm text-gray-500 hover:text-mainGreen transition-colors flex items-center gap-1"
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next &gt;
                </button>
            </div>

            {/* Food Detail Modal */}
            <FoodDetailModal 
                food={selectedFood}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
