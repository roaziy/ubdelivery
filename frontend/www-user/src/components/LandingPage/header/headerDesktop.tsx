'use client'

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderDesktop() {
    const pathname = usePathname();

    return (
        <div className="hidden md:block">
            <div className="container max-w-[1250px] mx-auto px-4 py-4 flex justify-between items-center select-none">
                <Link href="/" draggable={false}>
                    <Image 
                        src="/LandingPage/logo.svg" 
                        alt="UB Delivery Logo" 
                        width={180} 
                        height={28} 
                        className="max-w-[180px] max-h-[28.09px]"
                        draggable={false}
                    />
                </Link>
                <div className="container max-w-[450px] mx-auto flex justify-between">
                    <Link 
                        href="/collaborate" 
                        draggable={false}
                        className={`transition-all ${pathname === '/collaborate' ? 'text-mainGreen' : 'text-gray-900 hover:text-gray-800'}`}
                    >
                        Хамтран ажиллах
                    </Link>
                    <Link 
                        href="/terms" 
                        draggable={false}
                        className={`transition-all ${pathname === '/terms' ? 'text-mainGreen' : 'text-gray-900 hover:text-gray-800'}`}
                    >
                        Үйлчилгээний нөхцөл
                    </Link>
                </div>
                <button className="bg-mainGreen text-white px-7 py-[12px] rounded-full hover:bg-green-600 transition-colors">
                    Нэвтрэх
                </button>
            </div>
        </div>
    );
}