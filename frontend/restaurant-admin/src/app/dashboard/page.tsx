'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";

export default function DashboardPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if admin is logged in
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
            return;
        }
        
        // Check if setup is completed
        const setupCompleted = sessionStorage.getItem('setupCompleted');
        if (!setupCompleted) {
            router.push('/setup');
            return;
        }
        
        setIsLoggedIn(true);
    }, [router]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <Header />
            
            <main className="flex-1 py-8">
                <div className="container max-w-[1250px] mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <p className="text-gray-600 text-center">
                            Dashboard хуудас удахгүй бэлэн болно...
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
