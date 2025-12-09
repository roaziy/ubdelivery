'use client'

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { IoPersonCircle } from "react-icons/io5";
import { useState } from "react";

export default function HeaderMobile() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="md:hidden">
            <div className="container mx-auto px-4 py-3 select-none">
                <div className="flex justify-between items-center">
                    <Link href="/home" draggable={false}>
                        <Image 
                            src="/LandingPage/logo.svg" 
                            alt="UB Delivery Logo" 
                            width={140} 
                            height={22} 
                            className="w-[140px] h-auto"
                            draggable={false}
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/home/settings" className="text-mainGreen hidden md:block">
                            <IoPersonCircle size={28} />
                        </Link>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-mainGreen"
                            aria-label="Menu"
                        >
                            <IoMenu size={28} />
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <nav className="flex flex-col gap-6 pt-4 pb-2 text-sm border-t border-gray-200 mt-3">
                        <Link 
                            href="/home" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Нүүр
                        </Link>
                        <Link 
                            href="/home/restaurants" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/restaurants' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Ресторанууд
                        </Link>
                        <Link 
                            href="/home/foods" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/foods' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Бүх хоол
                        </Link>
                        <Link 
                            href="/home/cart" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/cart' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Сагс
                        </Link>
                        <Link 
                            href="/home/settings" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/settings' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Тохиргоо
                        </Link>
                    </nav>
                )}
            </div>
        </div>
    );
}