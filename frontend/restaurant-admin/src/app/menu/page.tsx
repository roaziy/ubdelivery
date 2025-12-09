'use client'

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { IoSearch, IoAdd, IoClose } from "react-icons/io5";
import { MdThumbUp } from "react-icons/md";

// Mock data
const mockCategories = ["Бүх хоол", "Үндсэн хоол", "Хачир", "Нэмэлт"];

const mockMenuTypes = [
    { id: "main", label: "Үндсэн хоол" },
    { id: "appetizer", label: "Хачир" },
    { id: "dessert", label: "Амттан" },
    { id: "drink", label: "Ундаа" },
    { id: "extra", label: "Нэмэлт" },
];

const mockFoods = Array(12).fill(null).map((_, i) => ({
    id: i + 1,
    name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза",
    price: 35000,
    likes: 32,
    isAvailable: true,
    image: null,
    category: mockCategories[Math.floor(Math.random() * 3) + 1],
}));

interface FoodFormData {
    name: string;
    price: string;
    description: string;
    category: string;
    menuType: string;
    customCategory: string;
    image: File | null;
}

function AddFoodModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState<FoodFormData>({
        name: "",
        price: "",
        description: "",
        category: "",
        menuType: "",
        customCategory: "",
        image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form data:", formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Food Name */}
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

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Нэмэлт мэдээлэл <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Хоолны талаарх нэмэлт мэдээллийг оруулна уу?"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen resize-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Хоолны төрөл <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                >
                                    <option value="">Select category</option>
                                    {mockCategories.slice(1).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Menu Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Мenu ангилал <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.menuType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, menuType: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                >
                                    <option value="">Select menu type</option>
                                    {mockMenuTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Custom Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Дэд ангилал
                                </label>
                                <select
                                    value={formData.customCategory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                >
                                    <option value="">Сонгох</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Үнийн дүн (Төгрөг) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="Жишээ нь: 20000"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mainGreen"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Хоолны зураг <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl h-[240px] flex items-center justify-center cursor-pointer hover:border-mainGreen transition-colors">
                                    <div className="text-center text-gray-400 text-sm">
                                        <p>Дарж эсвэл зөөж тавина, хоолны</p>
                                        <p>зургийг байршуулна уу.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Цуцлах
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                            Хадгалах
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FoodCard({ food, onToggle, onEdit }: { 
    food: typeof mockFoods[0]; 
    onToggle: () => void; 
    onEdit: () => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Food Image */}
            <div className="relative h-36 bg-gray-300">
                {/* Likes Badge */}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                    <MdThumbUp className="text-mainGreen" size={14} />
                    <span className="text-xs font-medium">{food.likes}</span>
                </div>
            </div>
            
            {/* Food Info */}
            <div className="p-4">
                <p className="text-sm font-medium text-mainBlack line-clamp-2 mb-2 min-h-[40px]">
                    {food.name}
                </p>
                <p className="text-sm font-semibold text-mainBlack mb-3">
                    ₮{food.price.toLocaleString()}
                </p>
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button 
                        onClick={onEdit}
                        className="px-4 py-2 border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                        Засах
                    </button>
                    
                    {/* Toggle Switch */}
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

function Pagination({ currentPage, totalPages, onPageChange }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
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

export default function MenuPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Бүх хоол");
    const [foods, setFoods] = useState(mockFoods);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleToggleFood = (foodId: number) => {
        setFoods(prev => prev.map(food => 
            food.id === foodId ? { ...food, isAvailable: !food.isAvailable } : food
        ));
    };

    const filteredFoods = foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "Бүх хоол" || food.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
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
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-mainGreen text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                        <IoAdd size={18} />
                        Шинэ хоол нэмэх
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    {mockCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeCategory === category
                                    ? 'bg-mainGreen text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Food Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {filteredFoods.map(food => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            onToggle={() => handleToggleFood(food.id)}
                            onEdit={() => console.log("Edit food:", food.id)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Add Food Modal */}
            <AddFoodModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
        </DashboardLayout>
    );
}
