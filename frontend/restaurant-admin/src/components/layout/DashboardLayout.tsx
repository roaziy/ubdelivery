'use client'

import { ReactNode } from "react";
import Header from "@/components/header/Header";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-backgroundGreen">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 min-h-[calc(100vh-73px)]">
                    <div className="max-w-[1100px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
