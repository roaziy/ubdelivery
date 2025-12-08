'use client'

import { useState } from "react";
import FoodCard, { FoodItem } from "@/components/home/FoodSection/FoodCard";
import FoodDetailModal from "@/components/home/FoodSection/FoodDetailModal";

interface FoodSectionProps {
    onViewAll?: () => void;
}

export default function FoodSection({ onViewAll }: FoodSectionProps) {
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FoodCard onFoodClick={handleFoodClick} />
                </div>
                <div className="flex justify-center mt-6">
                    <a 
                        href="/home/foods"
                        className="px-6 py-2 border border-mainGreen text-mainGreen rounded-full text-sm hover:bg-mainGreen hover:text-white transition-colors"
                    >
                        Бүгдийг харах
                    </a>
                </div>
            </section>

            {/* Food Detail Modal */}
            <FoodDetailModal 
                food={selectedFood}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
