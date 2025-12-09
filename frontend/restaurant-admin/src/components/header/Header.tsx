'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('setupCompleted');
        router.push('/');
    };

    return (
        <header className="bg-white border-b border-gray-100 py-4">
            <div className="container max-w-[1250px] mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image 
                        src="/logos/logo.svg" 
                        alt="UB Delivery Admin Panel" 
                        width={160} 
                        height={40}
                    />
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                >
                    Гарах
                </button>
            </div>
        </header>
    );
}
