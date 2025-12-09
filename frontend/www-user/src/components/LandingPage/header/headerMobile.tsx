'use client'

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

export default function HeaderMobile() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="md:hidden">
            <div className="container mx-auto px-4 py-3 select-none">
                <div className="flex justify-between items-center">
                    <Link href="/" draggable={false}>
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
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-900 hover:text-mainGreen transition-colors"
                            aria-label="Menu"
                        >
                            <IoMenu size={28} />
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <nav className="flex flex-col gap-6 pt-4 pb-2 text-sm border-t border-gray-200 mt-3 ">
                        <Link 
                            href="/collaborate" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/collaborate' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Хамтран ажиллах
                        </Link>
                        <Link 
                            href="/terms" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/terms' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Үйлчилгээний нөхцөл
                        </Link>
                        <Link 
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-mainGreen text-white px-5 py-2 rounded-full hover:bg-green-600 transition-colors text-sm whitespace-nowrap text-center"
                        >
                            Нэвтрэх
                        </Link>
                    </nav>
                )}
            </div>
        </div>
    );
}