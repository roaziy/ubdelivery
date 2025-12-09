'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import {
  FiHome,
  FiUsers,
  FiTruck,
  FiShoppingBag,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiFileText,
  FiUser,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import { AdminUser } from '@/types';
import { mockAdminUser } from '@/lib/mockData';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { href: '/applications', icon: FiFileText, label: 'Applications' },
  { href: '/restaurants', icon: MdStorefront, label: 'Restaurants' },
  { href: '/drivers', icon: FiTruck, label: 'Drivers' },
  { href: '/users', icon: FiUsers, label: 'Users' },
  { href: '/orders', icon: FiShoppingBag, label: 'Orders' },
  { href: '/finance', icon: FiDollarSign, label: 'Finance' },
  { href: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [notifications, setNotifications] = useState(5);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    setAdmin(mockAdminUser);
  }, [router]);

  useEffect(() => {
    if (sidebarOpen) {
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        display: 'block',
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/');
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backgroundGreen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mainGreen border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundGreen">
      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 h-full w-64 bg-mainBlack z-50 transform -translate-x-full lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mainGreen rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">UB</span>
                </div>
                <div>
                  <h1 className="text-white font-bold">UB Delivery</h1>
                  <p className="text-gray-400 text-xs">Super Admin</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-mainGreen text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {item.label === 'Applications' && notifications > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {notifications}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin Profile & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mainGreen/20 rounded-full flex items-center justify-center">
                <FiUser className="text-mainGreen" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {admin.name}
                </p>
                <p className="text-gray-400 text-xs truncate capitalize">
                  {admin.role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              <FiMenu size={24} />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-mainBlack capitalize">
                {pathname === '/dashboard'
                  ? 'Dashboard'
                  : pathname.replace('/', '')}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-gray-100">
                <FiBell size={24} className="text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-mainGreen rounded-full flex items-center justify-center">
                  <FiUser className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-mainBlack text-sm">
                    {admin.name}
                  </p>
                  <p className="text-gray-500 text-xs capitalize">
                    {admin.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
