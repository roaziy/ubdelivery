'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoLocationSharp, IoSearch, IoPersonCircle } from "react-icons/io5";

export default function OrderPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        if (!loggedIn) {
            router.push('/login');
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('phoneNumber');
        router.push('/');
    };

    if (!isLoggedIn) {
        return null; // or loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50 z-20">
                <div className="container max-w-[1250px] mx-auto px-4 py-4 flex justify-between items-center select-none">
                    <Link href="/order" draggable={false}>
                        <Image 
                            src="/LandingPage/logo.svg" 
                            alt="UB Delivery Logo" 
                            width={180} 
                            height={28} 
                            className="max-w-[180px] max-h-[28.09px]"
                            draggable={false}
                        />
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-[500px] mx-8">
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
                            <IoSearch className="text-gray-500 mr-2" size={20} />
                            <input 
                                type="text" 
                                placeholder="Рестораун, хоол хайх..." 
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Location & Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                            <IoLocationSharp className="text-mainGreen" size={20} />
                            <span>Улаанбаатар</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:text-mainGreen transition-colors"
                            >
                                Гарах
                            </button>
                            <IoPersonCircle className="text-mainGreen" size={36} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 px-4 pb-8">
                <div className="container max-w-[1250px] mx-auto">
                    {/* Categories */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Ангилал</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {['Бүгд', 'Фаст фүүд', 'Пицца', 'Азийн', 'Кофе', 'Десерт', 'Хоолны газар'].map((category, index) => (
                                <button 
                                    key={index}
                                    className={`px-6 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
                                        index === 0 
                                            ? 'bg-mainGreen text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Featured Restaurants */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Онцлох рестораунууд</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div 
                                    key={item} 
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                        <span className="text-4xl">🍔</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">Рестораун {item}</h3>
                                        <p className="text-sm text-gray-500 mb-2">Фаст фүүд • Бургер</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-mainGreen font-medium">⭐ 4.{item + 2}</span>
                                            <span className="text-gray-500">20-30 мин</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* All Restaurants */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Бүх рестораунууд</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <div 
                                    key={item} 
                                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🍕</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm mb-1">Хоолны газар {item}</h3>
                                        <p className="text-xs text-gray-500">15-25 мин • ⭐ 4.{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
