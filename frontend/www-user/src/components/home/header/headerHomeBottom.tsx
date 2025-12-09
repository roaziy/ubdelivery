'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";


export default function HeaderHomeBottom() {
    const pathname = usePathname();
    const [cartGroupCount, setCartGroupCount] = useState(0);

    useEffect(() => {
        // Get cart restaurant groups count (count by restaurant, not individual items)
        const cartData = sessionStorage.getItem('cartRestaurants');
        if (cartData) {
            try {
                const restaurants = JSON.parse(cartData);
                setCartGroupCount(restaurants.length || 0);
            } catch {
                setCartGroupCount(2); // Default mock count
            }
        } else {
            setCartGroupCount(2); // Default mock count for demo (2 restaurants)
        }
    }, []);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50 z-25 border-t border-[#D9D9D9] block md:hidden">
            <div className="container max-w-[370px] mx-auto px-4 py-5 flex justify-between items-center select-none md:hidden">
                <Link 
                    href="/home"
                    className={`transition-colors ${pathname === '/home' ? 'text-mainGreen' : 'text-[#D9D9D9] hover:text-gray-400'}`}
                >
                    <FaHome size={24} />
                </Link>
                <Link 
                    href="/home/cart"
                    className={`relative transition-colors ${pathname === '/home/cart' ? 'text-mainGreen' : 'text-[#D9D9D9] hover:text-gray-400'}`}
                >
                    <FaCartShopping size={22} />
                    {/* Cart badge - shows number of restaurant groups */}
                    {cartGroupCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                            {cartGroupCount > 9 ? '9+' : cartGroupCount}
                        </span>
                    )}
                </Link>
                <Link 
                    href="/home/settings"
                    className={`transition-colors ${pathname === '/home/settings' ? 'text-mainGreen' : 'text-[#D9D9D9] hover:text-gray-400'}`}
                >
                    <MdAccountCircle size={25} />
                </Link>
            </div>
        </div>
    )
}