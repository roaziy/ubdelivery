'use client'

import { usePathname, useRouter } from 'next/navigation';
import { IoHome, IoTime, IoWallet, IoPerson, IoNotifications } from 'react-icons/io5';
import { MdDeliveryDining } from 'react-icons/md';

interface DriverLayoutProps {
    children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { id: 'dashboard', label: 'Нүүр', icon: IoHome, path: '/dashboard' },
        { id: 'deliveries', label: 'Хүргэлт', icon: MdDeliveryDining, path: '/deliveries' },
        { id: 'history', label: 'Түүх', icon: IoTime, path: '/history' },
        { id: 'earnings', label: 'Орлого', icon: IoWallet, path: '/earnings' },
        { id: 'profile', label: 'Профайл', icon: IoPerson, path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-backgroundGreen pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-[600px] mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-mainGreen rounded-full flex items-center justify-center">
                            <MdDeliveryDining className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg">Go Delivery</span>
                    </div>
                    <button 
                        onClick={() => router.push('/notifications')}
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoNotifications size={22} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[600px] mx-auto px-4 py-6">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
                <div className="max-w-[600px] mx-auto flex items-center justify-around py-2">
                    {navItems.map(item => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => router.push(item.path)}
                                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${
                                    isActive ? 'text-mainGreen' : 'text-gray-400'
                                }`}
                            >
                                <Icon size={22} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
