'use client'

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { FoodItem, FoodCategory } from "@/lib/types";
import { FoodService, CartService, AuthService } from "@/lib/api";
import { FoodCardSkeleton, CategorySkeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/components/ui/Notification";
import FoodDetailModal from "@/components/home/FoodSection/FoodDetailModal";

export default function FoodsListSection() {
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const notify = useNotifications();

    const itemsPerPage = 20;

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await FoodService.getCategories();
                if (response.success && response.data) {
                    setCategories([{ id: 'all', name: 'Бүх хоол', icon: '🍽️' }, ...response.data]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Set default categories
                setCategories([{ id: 'all', name: 'Бүх хоол', icon: '🍽️' }]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch foods
    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            try {
                const response = await FoodService.getAll({
                    category: activeCategory === 'all' ? undefined : activeCategory || undefined,
                    page: currentPage,
                    pageSize: itemsPerPage
                });
                if (response.success && response.data) {
                    setFoods(response.data.items);
                    setTotalPages(response.data.totalPages);
                } else {
                    setFoods([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
                setFoods([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, [activeCategory, currentPage]);

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

    const handleCategoryChange = (categoryId: string | null) => {
        setActiveCategory(categoryId);
        setCurrentPage(1);
    };

    const handleFoodClick = (food: FoodItem) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFood(null);
    };

    const handleAddToCart = async (e: React.MouseEvent, food: FoodItem) => {
        e.stopPropagation();
        
        // Check if user is logged in
        if (!AuthService.isLoggedIn()) {
            notify.warning('Нэвтрэх шаардлагатай', 'Сагсанд нэмэхийн тулд эхлээд нэвтэрнэ үү');
            return;
        }
        
        setAddingToCart(food.id);
        try {
            const response = await CartService.addItem(food.id, 1);
            if (response.success) {
                notify.success('Сагсанд нэмэгдлээ', `${food.name} сагсанд нэмэгдлээ`);
            } else {
                notify.error('Алдаа', response.error || 'Сагсанд нэмэхэд алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setAddingToCart(null);
        }
    };

    // Render food card
    const renderFoodCard = (item: FoodItem, isMobile = false) => (
        <div 
            key={item.id} 
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleFoodClick(item)}
        >
            <div className={`relative ${isMobile ? 'h-32' : 'h-32 md:h-36'} bg-gray-300`}>
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
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">Дууссан</span>
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
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors disabled:opacity-50"
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={addingToCart === item.id || !item.isAvailable}
                    >
                        {addingToCart === item.id ? (
                            <div className="w-4 h-4 border-2 border-mainGreen border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <IoIosAdd className="text-xl text-gray-600 hover:text-mainGreen" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Title and Categories */}
            <section className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Хоолны ангилалууд</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                    {categoriesLoading ? (
                        [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
                    ) : (
                        categories.map((category) => (
                            <button 
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-4 md:px-5 py-2 rounded-full text-sm transition-colors ${
                                    (activeCategory === category.id) || (activeCategory === null && category.id === 'all')
                                        ? 'bg-mainGreen text-white' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                                }`}
                            >
                                {category.icon && <span className="mr-1">{category.icon}</span>}
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            </section>

            {/* Food Grid */}
            <section className="mb-8">
                {loading ? (
                    <>
                        {/* Desktop skeleton */}
                        <div className="hidden md:grid grid-cols-5 gap-4">
                            {[...Array(itemsPerPage)].map((_, i) => (
                                <FoodCardSkeleton key={i} />
                            ))}
                        </div>
                        {/* Mobile skeleton */}
                        <div className="md:hidden flex flex-col gap-4">
                            {[...Array(4)].map((_, i) => (
                                <FoodCardSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : foods.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Хоол олдсонгүй</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop: 5 columns grid */}
                        <div className="hidden md:grid grid-cols-5 gap-4">
                            {foods.map((item) => renderFoodCard(item))}
                        </div>

                        {/* Mobile: Vertical stack */}
                        <div className="md:hidden flex flex-col gap-4">
                            {foods.map((item) => renderFoodCard(item, true))}
                        </div>
                    </>
                )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
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

            {/* Food Detail Modal */}
            <FoodDetailModal 
                food={selectedFood}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
