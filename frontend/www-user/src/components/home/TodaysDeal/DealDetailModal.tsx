'use client'

import { IoClose } from "react-icons/io5";
import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { useState } from "react";

interface DealItem {
    id: number;
    title: string;
    subtitle: string;
    discount: string;
    restaurant?: string;
    originalPrice?: number;
    discountedPrice?: number;
    description?: string;
    validUntil?: string;
    items?: string[];
}

interface DealDetailModalProps {
    deal: DealItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DealDetailModal({ deal, isOpen, onClose }: DealDetailModalProps) {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !deal) return null;

    const originalPrice = deal.originalPrice || 25000;
    const discountedPrice = deal.discountedPrice || 20000;
    const totalPrice = discountedPrice * quantity;

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-hidden shadow-xl">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                    <IoClose size={20} className="text-gray-600" />
                </button>

                {/* Deal Image with gradient overlay */}
                <div className="h-48 md:h-56 bg-gradient-to-r from-gray-700 to-gray-500 w-full relative">
                    {/* Discount badge */}
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {deal.discount}
                    </div>
                    {/* Deal title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">{deal.title}</h2>
                        <p className="text-gray-200 text-sm mt-1">{deal.subtitle}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Restaurant */}
                    <p className="text-mainGreen text-sm mb-4">{deal.restaurant || "UB Delivery Partner"}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            Хямдрал
                        </span>
                        <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                            Хязгаартай
                        </span>
                        <span className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                            {deal.validUntil || "Өнөөдөр дуусна"}
                        </span>
                    </div>

                    {/* Deal includes */}
                    <div className="mb-4">
                        <h3 className="font-medium text-sm mb-2">Багтсан зүйлс</h3>
                        <ul className="text-gray-600 text-sm space-y-1">
                            {deal.items ? (
                                deal.items.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-mainGreen rounded-full"></span>
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-mainGreen rounded-full"></span>
                                        Том пицца x1
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-mainGreen rounded-full"></span>
                                        Дунд пицца x1
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-mainGreen rounded-full"></span>
                                        1.5л ундаа x1
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h3 className="font-medium text-sm mb-2">Нэмэлт мэдээлэл</h3>
                        <p className="text-gray-600 text-sm">
                            {deal.description || "Энэхүү хямдралын багц нь гэр бүл, найз нөхөдтэйгээ хамт хооллоход тохиромжтой. Хязгаарлагдмал хугацаанд хүчинтэй!"}
                        </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500">Нийт үнэ</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-bold text-mainGreen">₮{totalPrice.toLocaleString()}</p>
                                <p className="text-sm text-gray-400 line-through">₮{(originalPrice * quantity).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={handleDecrease}
                                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors"
                            >
                                <IoIosRemove size={20} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                            <button 
                                onClick={handleIncrease}
                                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-mainGreen transition-colors"
                            >
                                <IoIosAdd size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors">
                        Сагсанд нэмэх
                    </button>
                </div>
            </div>
        </div>
    );
}
