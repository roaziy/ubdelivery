'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";

export default function Header() {
    const router = useRouter();
    // In real app, this would come from API/context
    const restaurantName = "Pizzahut mongolia";

    const handleLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('setupCompleted');
        router.push('/');
    };

    return (
        <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-40">
            <div className="px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image 
                            src="/logos/logo.svg" 
                            alt="UB Delivery Admin Panel" 
                            width={140} 
                            height={36}
                        />
                    </Link>
                    
                    {/* Restaurant Name */}
                    <span className="text-lg font-semibold text-mainBlack">
                        {restaurantName}
                    </span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
                        <IoNotificationsOutline size={20} className="text-gray-600" />
                        {/* Notification dot */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="px-6 py-[9px] bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                        Гарах
                    </button>
                </div>
            </div>
        </header>
    );
}
