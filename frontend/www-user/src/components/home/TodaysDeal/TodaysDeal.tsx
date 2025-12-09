'use client'

import { useState } from "react";
import DealDetailModal from "./DealDetailModal";

interface Deal {
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

const deals: Deal[] = [
    { 
        id: 1, 
        title: "Нэгийн үнээр хоёрыг", 
        subtitle: "Пицца + Ундаа багц", 
        discount: "20% off",
        restaurant: "Pizza Palace",
        originalPrice: 35000,
        discountedPrice: 28000,
        items: ["Том пепперони пицца x1", "Дунд маргарита пицца x1", "1.5л Coca Cola x1"],
        validUntil: "Өнөөдөр дуусна"
    },
    { 
        id: 2, 
        title: "Гэр бүлийн багц", 
        subtitle: "4 хүний хоол", 
        discount: "30% off",
        restaurant: "Mongol Kitchen",
        originalPrice: 68000,
        discountedPrice: 47600,
        items: ["Хуушуур x8", "Бууз x12", "Цуйван x2", "Сүүтэй цай x4"],
        validUntil: "2 өдөр үлдсэн"
    },
    { 
        id: 3, 
        title: "Бургер комбо", 
        subtitle: "Бургер + Фри + Ундаа", 
        discount: "25% off",
        restaurant: "Burger House",
        originalPrice: 24000,
        discountedPrice: 18000,
        items: ["Чизбургер x1", "Том фри x1", "Pepsi 0.5л x1"],
        validUntil: "Энэ долоо хоногт"
    },
];

export default function TodaysDeal() {
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDealClick = (deal: Deal) => {
        setSelectedDeal(deal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDeal(null);
    };

    return (
        <>
            {deals.map((deal) => (
                <div 
                    key={deal.id} 
                    onClick={() => handleDealClick(deal)}
                    className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl p-4 md:p-6 text-white flex items-center justify-between cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all"
                >
                    <div>
                        <h3 className="font-semibold text-base md:text-lg mb-1">{deal.title}</h3>
                        <p className="text-sm text-gray-200">{deal.subtitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium bg-neutral-400/30 backdrop-blur-3xl px-2 py-0.5 rounded-full">{deal.discount}</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDealClick(deal);
                            }}
                            className="bg-mainGreen text-white text-xs px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Захиалах
                        </button>
                    </div>
                </div>
            ))}

            {/* Deal Detail Modal */}
            <DealDetailModal 
                deal={selectedDeal}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    )
}