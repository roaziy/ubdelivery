'use client'

import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import FoodDetailModal from "@/components/home/FoodSection/FoodDetailModal";

export interface FoodItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    rating: number;
    description?: string;
}

const categories = ['Бүх хоол', 'Пицца', 'Монгол хоол', 'Солонгос хоол', 'Япон хоол', 'Түргэн хоол'];

// Extended food items for the full list page
const allFoodItems: FoodItem[] = [
    { id: 1, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 2, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 3, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 4, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 5, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 6, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 7, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 8, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 9, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 10, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 11, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 12, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 13, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 14, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 15, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 16, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 17, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 18, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 19, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 20, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 21, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 22, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 23, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 24, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
    { id: 25, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, rating: 32, description: "Энэхүү хүн аймар гоё Пицца нь хүн аймар гоч Пицца юм!!!" },
];

export default function FoodsListSection() {
    const [activeCategory, setActiveCategory] = useState(0);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;
    const totalPages = Math.ceil(allFoodItems.length / itemsPerPage);

    // Get foods for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFoods = allFoodItems.slice(startIndex, endIndex);

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
            {/* Title and Categories */}
            <section className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Хоолны ангилалууд</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
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
                {/* Desktop: 5 columns grid */}
                <div className="hidden md:grid grid-cols-5 gap-4">
                    {currentFoods.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleFoodClick(item)}
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
                                            e.stopPropagation();
                                        }}
                                    >
                                        <IoIosAdd className="text-xl text-gray-600 hover:text-mainGreen" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: Vertical stack */}
                <div className="md:hidden flex flex-col gap-4">
                    {currentFoods.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleFoodClick(item)}
                        >
                            <div className="relative h-32 bg-gray-400">
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
                                            e.stopPropagation();
                                        }}
                                    >
                                        <IoIosAdd className="text-xl text-gray-600 hover:text-mainGreen" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mb-32 md:mb-16">
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

            {/* Food Detail Modal */}
            <FoodDetailModal 
                food={selectedFood}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
