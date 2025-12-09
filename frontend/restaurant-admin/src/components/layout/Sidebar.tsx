'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdRestaurantMenu, MdShoppingCart, MdStar, MdSettings } from "react-icons/md";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <MdDashboard size={20} /> },
    { label: "Хоолны жагсаалт", href: "/menu", icon: <MdRestaurantMenu size={20} /> },
    { label: "Захиалгууд", href: "/orders", icon: <MdShoppingCart size={20} /> },
    { label: "Reviews", href: "/reviews", icon: <MdStar size={20} /> },
    { label: "Тохиргоо", href: "/settings", icon: <MdSettings size={20} /> },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
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
    );
}
