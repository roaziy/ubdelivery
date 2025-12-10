'use client'

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDashboard, MdStorefront } from "react-icons/md";
import { FiFileText, FiTruck, FiUsers, FiShoppingBag, FiDollarSign, FiSettings } from "react-icons/fi";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: "Хянах самбар", href: "/dashboard", icon: <MdDashboard size={20} /> },
    { label: "Өргөдлүүд", href: "/applications", icon: <FiFileText size={20} /> },
    { label: "Рестораны", href: "/restaurants", icon: <MdStorefront size={20} /> },
    { label: "Жолооч", href: "/drivers", icon: <FiTruck size={20} /> },
    { label: "Хэрэглэгч", href: "/users", icon: <FiUsers size={20} /> },
    { label: "Захиалга", href: "/orders", icon: <FiShoppingBag size={20} /> },
    { label: "Санхүү", href: "/finance", icon: <FiDollarSign size={20} /> },
    { label: "Тохиргоо", href: "/settings", icon: <FiSettings size={20} /> },
];

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token');
        const auth = sessionStorage.getItem('adminAuthenticated');
        if (!token || !auth) {
            // Clear any stale data
            sessionStorage.removeItem('admin_token');
            sessionStorage.removeItem('admin_user');
            sessionStorage.removeItem('adminAuthenticated');
            router.push('/');
            return;
        }
        setIsAuthenticated(true);
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('adminAuthenticated');
        router.push('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-mainGreen border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-backgroundGreen">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-40">
                <div className="px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image src="/logoSmall.svg" alt="UB Delivery" width={40} height={40} />
                            <div>
                                <span className="text-lg font-bold text-mainBlack">UB Delivery</span>
                                <span className="text-xs text-gray-400 block">Super Admin</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
                            <IoNotificationsOutline size={20} className="text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            Гарах
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-[180px] h-[calc(100vh-73px)] bg-white border-r border-gray-100 py-6 px-4 shrink-0 sticky top-[73px] overflow-y-auto">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                                        isActive 
                                            ? 'bg-mainGreen text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 min-h-[calc(100vh-73px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
