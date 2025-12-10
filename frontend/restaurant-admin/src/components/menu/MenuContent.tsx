'use client'

import { useState, useEffect, useCallback } from "react";
import { IoSearch, IoAdd, IoClose } from "react-icons/io5";
import { MdThumbUp } from "react-icons/md";
import Image from "next/image";
import { useNotifications } from "@/components/ui/Notification";
import { menuService } from "@/lib/services";
import { Food, FoodCategory } from "@/types";
import { FoodCardSkeleton } from "@/components/ui/Skeleton";

interface FoodFormData {
    name: string;
    price: string;
    description: string;
    categoryId: string;
    preparationTime: string;
    image: File | null;
}

interface AddFoodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: FoodCategory[];
    editFood?: Food | null;
}

function AddFoodModal({ isOpen, onClose, onSuccess, categories, editFood }: AddFoodModalProps) {
    const notify = useNotifications();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FoodFormData>({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        preparationTime: "15",
        image: null,
    });

    useEffect(() => {
        if (editFood) {
            setFormData({
                name: editFood.name,
                price: editFood.price.toString(),
                description: editFood.description,
                categoryId: editFood.categoryId,
                preparationTime: editFood.preparationTime.toString(),
                image: null,
            });
        } else {
            setFormData({
                name: "", price: "", description: "", 
                categoryId: "", preparationTime: "15", image: null
            });
        }
    }, [editFood, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.categoryId) {
            notify.warning('Талбар дутуу', 'Бүх заавал талбаруудыг бөглөнө үү');
            return;
        }

        setLoading(true);
        try {
            const data: Partial<Food> = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                categoryId: formData.categoryId,
                preparationTime: parseInt(formData.preparationTime) || 15,
            };

            const response = editFood 
                ? await menuService.updateFood(editFood.id, data)
                : await menuService.createFood(data);

            if (response.success) {
                notify.success('Амжилттай', editFood ? 'Хоол шинэчлэгдлээ' : 'Шинэ хоол нэмэгдлээ');
                onSuccess();
                onClose();
            } else {
                notify.error('Алдаа гарлаа', response.error || 'Хоол хадгалахад алдаа гарлаа');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">
                            {editFood ? 'Хоол засах' : 'Шинэ хоол нэмэх'}
                        </h2>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <IoClose size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Хоолны нэр <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Хоолны нэрээ оруулна уу?"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Нэмэлт мэдээлэл
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Хоолны талаарх нэмэлт мэдээлэл"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Хоолны төрөл <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                >
                                    <option value="">Сонгох</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Бэлтгэх хугацаа (минут)
                                </label>
                                <input
                                    type="number"
                                    value={formData.preparationTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                                    placeholder="15"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Үнийн дүн (Төгрөг) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="Жишээ нь: 20000"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Хоолны зураг
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl h-[200px] flex items-center justify-center cursor-pointer hover:border-mainGreen transition-colors">
                                    <div className="text-center text-gray-400 text-sm">
                                        <p>Дарж эсвэл зөөж тавина</p>
                                        <p>хоолны зургийг байршуулна уу</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Цуцлах
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {loading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface FoodCardProps {
    food: Food;
    onToggle: () => void;
    onEdit: () => void;
}

function FoodCard({ food, onToggle, onEdit }: FoodCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-36 bg-gray-300">
                {food.image ? (
                    <Image 
                        src={food.image} 
                        alt={food.name} 
                        fill 
                        className="object-cover"
                        unoptimized={food.image?.includes('supabase.co')}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        Зураг байхгүй
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                    <MdThumbUp className="text-mainGreen" size={14} />
                    <span className="text-xs font-medium">0</span>
                </div>
            </div>
            
            <div className="p-4">
                <p className="text-sm font-medium text-mainBlack line-clamp-2 mb-2 min-h-10">
                    {food.name}
                </p>
                <p className="text-sm font-semibold text-mainBlack mb-3">
                    ₮{food.price.toLocaleString()}
                </p>
                
                <div className="flex items-center justify-between">
                    <button 
                        onClick={onEdit}
                        className="px-4 py-2 border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                        Засах
                    </button>
                    
                    <button
                        onClick={onToggle}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                            food.isAvailable ? 'bg-mainGreen' : 'bg-gray-300'
                        }`}
                    >
                        <span 
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                food.isAvailable ? 'right-1' : 'left-1'
                            }`} 
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function MenuPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 hover:text-mainBlack disabled:opacity-50"
            >
                &lt; Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-full text-sm ${
                        currentPage === page 
                            ? 'bg-mainGreen text-white' 
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}
            
            {totalPages > 3 && (
                <>
                    <span className="text-gray-400">...</span>
                    <button 
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm text-gray-500 hover:text-mainBlack disabled:opacity-50"
                    >
                        Next &gt;
                    </button>
                </>
            )}
        </div>
    );
}

export default function MenuContent() {
    const notify = useNotifications();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [foods, setFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editFood, setEditFood] = useState<Food | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await menuService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    const fetchFoods = useCallback(async () => {
        setLoading(true);
        try {
            const response = await menuService.getFoods({
                categoryId: activeCategory === 'all' ? undefined : activeCategory,
                search: searchQuery || undefined,
                page: currentPage,
                limit: 12
            });
            
            if (response.success && response.data) {
                setFoods(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch foods:', error);
        } finally {
            setLoading(false);
        }
    }, [activeCategory, searchQuery, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchFoods();
    }, [fetchFoods]);

    const handleToggleFood = async (foodId: string, isAvailable: boolean) => {
        const response = await menuService.toggleFoodAvailability(foodId, !isAvailable);
        if (response.success) {
            setFoods(prev => prev.map(f => 
                f.id === foodId ? { ...f, isAvailable: !isAvailable } : f
            ));
            notify.info(
                isAvailable ? 'Хоол идэвхгүй болгов' : 'Хоол идэвхтэй болгов',
                foods.find(f => f.id === foodId)?.name || ''
            );
        }
    };

    const handleEdit = (food: Food) => {
        setEditFood(food);
        setIsAddModalOpen(true);
    };

    const handleModalSuccess = () => {
        fetchFoods();
        setEditFood(null);
    };

    return (
        <div className="max-w-[1100px]">
            {/* Search and Add Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-[400px]">
                    <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Хоолны нэрээр хайх"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen transition-colors"
                    />
                </div>
                
                <button 
                    onClick={() => {
                        setEditFood(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-mainGreen text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                >
                    <IoAdd size={18} />
                    Шинэ хоол нэмэх
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <button
                    onClick={() => {
                        setActiveCategory('all');
                        setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === 'all'
                            ? 'bg-mainGreen text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Бүх хоол
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setActiveCategory(category.id);
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === category.id
                                ? 'bg-mainGreen text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Food Grid */}
            {loading ? (
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <FoodCardSkeleton key={i} />
                    ))}
                </div>
            ) : foods.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    Хоол олдсонгүй
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {foods.map(food => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            onToggle={() => handleToggleFood(food.id, food.isAvailable)}
                            onEdit={() => handleEdit(food)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && foods.length > 0 && (
                <MenuPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Add/Edit Food Modal */}
            <AddFoodModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditFood(null);
                }}
                onSuccess={handleModalSuccess}
                categories={categories}
                editFood={editFood}
            />
        </div>
    );
}
