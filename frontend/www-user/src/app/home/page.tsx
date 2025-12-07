'use client';

import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";

import Footer from "@/components/LandingPage/footer/footer";
import HeaderHomeTopper from "@/components/home/header/headerHomeTopper";
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom";

// Sample food data
const foodItems = [
    { id: 1, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 2, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 3, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 4, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
];

const categories = ['Өнөөдрийн онцлох', 'Пицза', 'Монгол хоол', 'Солонгос хоол', 'Япон хоол', 'Түргэн хоол'];

const restaurants = [
    { id: 1, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 2, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 3, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 4, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
];

const deals = [
    { id: 1, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
    { id: 2, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
    { id: 3, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
];

export default function HomePage() {
    const [activeCategory, setActiveCategory] = useState(0);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Desktop Header */}
            <HeaderHomeTopper />
            {/* Mobile Header Placeholder */}
            <HeaderHomeBottom />

            {/* Main Content */}
            <main className="flex-1 pt-20 md:pt-24">
                <div className="container max-w-[1250px] mx-auto px-4">
                    {/* Hero Banner */}
                    <section className="mb-8 hidden md:block">
                        <div className="w-full h-[200px] bg-gray-500 rounded-2xl"></div>
                    </section>

                    {/* Food Categories */}
                    <section className="mb-8">
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

                    {/* Food Items Grid */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {foodItems.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="relative h-32 md:h-36 bg-gray-400">
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                            ⭐ {item.rating}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                                        <p className="text-mainGreen text-xs mb-2">{item.restaurant}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">₮{item.price.toLocaleString()}</span>
                                            <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors">
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button className="px-6 py-2 border border-mainGreen text-mainGreen rounded-full text-sm hover:bg-mainGreen hover:text-white transition-colors">
                                Бүгдийг харах
                            </button>
                        </div>
                    </section>

                    {/* Today's Deals */}
                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Өнөөдрийн хямдрал</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {deals.map((deal) => (
                                <div 
                                    key={deal.id} 
                                    className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl p-4 md:p-6 text-white flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-semibold text-base md:text-lg mb-1">{deal.title}</h3>
                                        <p className="text-sm text-gray-200">{deal.subtitle}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-sm font-medium">{deal.discount}</span>
                                        <button className="bg-mainGreen text-white text-xs px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
                                            Захиалах
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Featured Restaurants */}
                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Онцлох ресторанууд</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {restaurants.map((restaurant) => (
                                <div 
                                    key={restaurant.id} 
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="h-24 md:h-28 bg-gray-300"></div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm mb-1">{restaurant.name}</h3>
                                        <p className="text-gray-500 text-xs mb-2">{restaurant.type}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FaRegClock size={12} />
                                                <span>{restaurant.hours}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-mainGreen">
                                                <span>★</span>
                                                <span>{restaurant.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button className="px-6 py-2 border border-mainGreen text-mainGreen rounded-full text-sm hover:bg-mainGreen hover:text-white transition-colors">
                                Бүгдийг харах
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
