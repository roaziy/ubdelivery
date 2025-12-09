'use client';

import { useState } from "react";

// Sample food data
const categories = ['Өнөөдрийн онцлох', 'Пицца', 'Монгол хоол', 'Солонгос хоол', 'Япон хоол', 'Түргэн хоол'];

export default function FoodCategoryFilter() {
    const [activeCategory, setActiveCategory] = useState(0);

    return (
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
    )
}