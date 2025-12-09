'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MdDashboard,
  MdDescription,
  MdStorefront,
  MdLocalShipping,
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdSettings,
} from 'react-icons/md';
import { IoNotificationsOutline } from 'react-icons/io5';
import { AdminUser } from '@/types';
import { mockAdminUser } from '@/lib/mockData';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { href: '/applications', icon: MdDescription, label: 'Applications' },
  { href: '/restaurants', icon: MdStorefront, label: 'Restaurants' },
  { href: '/drivers', icon: MdLocalShipping, label: 'Drivers' },
  { href: '/users', icon: MdPeople, label: 'Users' },
  { href: '/orders', icon: MdShoppingCart, label: 'Orders' },
  { href: '/finance', icon: MdAttachMoney, label: 'Finance' },
  { href: '/settings', icon: MdSettings, label: 'Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    setAdmin(mockAdminUser);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminUser');
    router.push('/');
  };

  if (!admin) {
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
              <div className="w-10 h-10 bg-mainGreen rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">UB</span>
              </div>
              <div className="hidden md:block">
                <span className="text-lg font-bold text-mainBlack">UB Delivery</span>
                <span className="text-xs text-gray-400 block">Super Admin</span>
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
              <IoNotificationsOutline size={20} className="text-gray-600" />
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[200px] h-[calc(100vh-73px)] bg-white border-r border-gray-100 py-6 px-4 shrink-0 sticky top-[73px] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

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
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-73px)]">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
