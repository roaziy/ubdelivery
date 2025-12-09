'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if admin is logged in
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        router.push('/');
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-backgroundGreen">
            <div className="container max-w-[1250px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Гарах
                    </button>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <p className="text-gray-600 text-center">
                        Dashboard хуудас удахгүй бэлэн болно...
                    </p>
                </div>
            </div>
        </div>
    );
}
