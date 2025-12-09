'use client';

import Link from "next/link";
import Image from "next/image";
import { IoLocationSharp, IoSearch, IoPersonCircle } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function HeaderDesktop() {
    const pathname = usePathname();        
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

    if (!isLoggedIn) {
        return null; // or loading spinner
    }

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50 z-20 md:block hidden">
            <div className="container max-w-[1250px] mx-auto px-4 py-4 flex justify-between items-center select-none">
                <Link href="/home" draggable={false}>
                    <Image 
                        src="/LandingPage/logo.svg" 
                        alt="UB Delivery Logo" 
                        width={180} 
                        height={28} 
                        className="max-w-[180px] max-h-[28.09px]"
                        draggable={false}
                    />
                </Link>

                {/* Search Bar
                <div className="hidden md:flex flex-1 max-w-[500px] mx-8">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
                        <IoSearch className="text-gray-500 mr-2" size={20} />
                        <input 
                            type="text" 
                            placeholder="Рестораун, хоол хайх..." 
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div> */}

                {/* Links */}
                <div className="container flex flex-row max-w-[400px] justify-between">
                    <Link 
                        href="/home" 
                        draggable={false}
                        className={`transition-all select-none ${pathname === '/home' ? 'text-mainGreen' : 'text-gray-900 hover:text-gray-800'}`}
                    >
                        Нүүр
                    </Link>
                    <Link 
                        href="/home/restaurants" 
                        draggable={false}
                        className={`transition-all select-none ${pathname === '/home/restaurants' ? 'text-mainGreen' : 'text-gray-900 hover:text-gray-800'}`}
                    >
                        Ресторанууд
                    </Link>
                    <Link 
                        href="/home/foods" 
                        draggable={false}
                        className={`transition-all select-none ${pathname === '/home/foods' ? 'text-mainGreen' : 'text-gray-900 hover:text-gray-800'}`}
                    >
                        Бүх хоол
                    </Link>
                </div>

                {/* Location & Profile */}
                <div className="items-center gap-4 flex">
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                        <IoLocationSharp className="text-mainGreen" size={20} />
                        <span>Улаанбаатар</span>
                    </div>
                    <Link 
                        href="/home/cart" 
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiShoppingCart className="text-gray-700" size={24} />
                    </Link>
                    <Link 
                        href="/home/settings"
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoPersonCircle className="text-mainGreen" size={36} />
                    </Link>
                </div>
            </div>
        </header>
    )
}