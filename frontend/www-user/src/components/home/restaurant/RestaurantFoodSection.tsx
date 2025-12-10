'use client'

import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FoodItem, FoodCategory } from "@/lib/types";
import { FoodService, CartService, RestaurantService } from "@/lib/api";
import FoodDetailModal from "@/components/home/FoodSection/FoodDetailModal";
import { FoodCardSkeleton } from "@/components/ui/Skeleton";
import { FaStar } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { useNotifications } from "@/components/ui/Notification";

interface RestaurantFoodSectionProps {
    restaurantName: string;
    restaurantId?: string;
}

export default function RestaurantFoodSection({ restaurantName, restaurantId }: RestaurantFoodSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const notify = useNotifications();

    const handleFoodClick = (food: FoodItem) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedFood(null);
        setIsModalOpen(false);
    };

    // Fetch categories for this restaurant
    useEffect(() => {
        const fetchCategories = async () => {
            if (!restaurantId) return;
            
            setCategoriesLoading(true);
            try {
                const response = await RestaurantService.getById(restaurantId);
                if (response.success && response.data) {
                    // Get categories from restaurant data
                    const restaurantCategories = (response.data as any).food_categories || [];
                    // Add "Бүгд" as first option
                    setCategories([
                        { id: 'all', name: 'Бүгд' },
                        ...restaurantCategories.map((cat: any) => ({
                            id: cat.id,
                            name: cat.name
                        }))
                    ]);
                } else {
                    // Fallback to default categories
                    setCategories([
                        { id: 'all', name: 'Бүгд' },
                        { id: 'main', name: 'Үндсэн хоол' },
                        { id: 'extras', name: 'Хачир' },
                        { id: 'addons', name: 'Нэмэлт' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch restaurant categories:', error);
                // Fallback to default categories
                setCategories([
                    { id: 'all', name: 'Бүгд' },
                    { id: 'main', name: 'Үндсэн хоол' },
                    { id: 'extras', name: 'Хачир' },
                    { id: 'addons', name: 'Нэмэлт' }
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [restaurantId]);

    // Fetch foods for this restaurant
    useEffect(() => {
        const fetchFoods = async () => {
            if (!restaurantId) return;
            
            setLoading(true);
            try {
                const response = await FoodService.getAll({
                    restaurantId: restaurantId,
                    category: activeCategory === 'all' || !activeCategory ? undefined : activeCategory,
                    page: currentPage,
                    pageSize: 20
                });
                
                if (response.success && response.data) {
                    // Filter only available foods
                    const availableFoods = response.data.items.filter(food => food.isAvailable);
                    setFoods(availableFoods);
                    setTotalPages(response.data.totalPages);
                } else {
                    setFoods([]);
                }
            } catch (error) {
                console.error('Failed to fetch restaurant foods:', error);
                setFoods([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, [restaurantId, activeCategory, currentPage]);

    const handleAddToCart = async (e: React.MouseEvent, food: FoodItem) => {
        e.stopPropagation();
        try {
            const response = await CartService.addItem(food.id, 1);
            if (response.success) {
                notify.success('Сагсанд нэмэгдлээ', `${food.name} сагсанд нэмэгдлээ`);
            } else {
                notify.error('Алдаа', response.error || 'Сагсанд нэмэхэд алдаа гарлаа');
            }
        } catch (error) {
            notify.error('Алдаа', 'Сагсанд нэмэхэд алдаа гарлаа');
        }
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
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-[250px] md:w-[500px] items-center mx-auto">
                    {categoriesLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
                        ))
                    ) : (
                        categories.map((category) => (
                            <button 
                                key={category.id}
                                onClick={() => setActiveCategory(category.id === 'all' ? null : category.id)}
                                className={`px-4 md:px-5 py-2 rounded-full text-sm transition-colors ${
                                    (activeCategory === null && category.id === 'all') || activeCategory === category.id
                                        ? 'bg-mainGreen text-white' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            </section>

            {/* Food Grid */}
            <section className="mb-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <FoodCardSkeleton key={i} />
                        ))}
                    </div>
                ) : foods.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Хоол олдсонгүй</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {foods.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleFoodClick(item)}
                            >
                                <div className="relative h-32 md:h-36 bg-gray-300">
                                    {item.image ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                            Зураг байхгүй
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 select-none">
                                        <FaStar className="text-mainGreen" /> {item.rating}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm mb-1 line-clamp-2 select-none">{item.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-semibold">₮{item.price.toLocaleString()}</span>
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
                    </div>
                )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-16">
                    <button 
                        className="text-sm text-gray-500 hover:text-mainGreen transition-colors flex items-center gap-1"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        &lt; Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) {
                            page = i + 1;
                        } else if (currentPage <= 3) {
                            page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                        } else {
                            page = currentPage - 2 + i;
                        }
                        return (
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
                        );
                    })}
                    {totalPages > 5 && <span className="text-gray-400">...</span>}
                    <button 
                        className="text-sm text-gray-500 hover:text-mainGreen transition-colors flex items-center gap-1"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next &gt;
                    </button>
                </div>
            )}

            {/* Food Detail Modal */}
            <FoodDetailModal 
                food={selectedFood}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
