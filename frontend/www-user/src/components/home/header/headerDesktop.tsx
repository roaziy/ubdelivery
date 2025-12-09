'use client';

import Link from "next/link";
import Image from "next/image";
import { IoLocationSharp, IoSearch } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";

import { FaCartShopping } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function HeaderDesktop() {
    const pathname = usePathname();        
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        // Check if user is logged in
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        if (!loggedIn) {
            router.push('/login');
        } else {
            setIsLoggedIn(true);
        }

        // Get cart restaurant groups count (count by restaurant, not individual items)
        const cartData = sessionStorage.getItem('cartRestaurants');
        if (cartData) {
            try {
                const restaurants = JSON.parse(cartData);
                // Count unique restaurants in cart
                setCartItemCount(restaurants.length || 0);
            } catch {
                setCartItemCount(2); // Default mock count (2 restaurants)
            }
        } else {
            setCartItemCount(2); // Default mock count for demo (2 restaurants)
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
                <div className="items-center gap-4 flex select-none" draggable={false}>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                        <IoLocationSharp className="text-mainGreen" size={20} />
                        <span>Улаанбаатар</span>
                    </div>
                    <Link 
                        href="/home/cart" 
                        draggable={false}
                        className="relative p-2  bg-mainGreen hover:bg-green-600 rounded-full transition-colors"
                    >
                        <FaCartShopping className="text-white" size={18} />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                    <Link 
                        href="/home/settings"
                        className="bg-mainGreen w-[34px] h-[34px] rounded-full transition-colors items-center justify-center flex hover:bg-green-600"
                        draggable={false}
                    >
                        <FaUserAlt className="text-white" size={18} />
                    </Link>
                </div>
            </div>
        </header>
    )
}