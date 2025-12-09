'use client';

import { useState, useEffect } from "react";
import { FoodCategory } from "@/lib/types";
import { FoodService } from "@/lib/api";
import { mockCategories, simulateDelay } from "@/lib/mockData";
import { CategoryFilterSkeleton } from "@/components/ui/Skeleton";

interface FoodCategoryFilterProps {
    onCategoryChange?: (categoryId: string | null) => void;
}

export default function FoodCategoryFilter({ onCategoryChange }: FoodCategoryFilterProps) {
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await FoodService.getCategories();
                if (response.success && response.data) {
                    setCategories(response.data);
                } else {
                    await simulateDelay(500);
                    setCategories(mockCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                await simulateDelay(500);
                setCategories(mockCategories);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: string | null) => {
        setActiveCategory(categoryId);
        onCategoryChange?.(categoryId);
    };

    if (loading) {
        return <CategoryFilterSkeleton />;
    }

    return (
        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
            {categories.map((category) => (
                <button 
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id === '1' ? null : category.id)}
                    className={`px-4 md:px-5 py-2 rounded-full text-sm transition-colors ${
                        (activeCategory === null && category.id === '1') || activeCategory === category.id
                            ? 'bg-mainGreen text-white' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-mainGreen'
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}