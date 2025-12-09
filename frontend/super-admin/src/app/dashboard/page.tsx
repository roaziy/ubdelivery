'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiUsers,
  FiTruck,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiFileText,
  FiAlertCircle,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { PlatformStats, RestaurantApplication, DriverApplication, Order } from '@/types';
import { StatsService, ApplicationService, OrderService } from '@/lib/services';
import {
  mockPlatformStats,
  mockRestaurantApplications,
  mockDriverApplications,
  mockOrders,
} from '@/lib/mockData';

export default function DashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<RestaurantApplication[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<DriverApplication[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, these would be API calls
        const [statsRes, restaurantRes, driverRes, ordersRes] = await Promise.all([
          StatsService.getPlatformStats(),
          ApplicationService.getRestaurantApplications(),
          ApplicationService.getDriverApplications(),
          OrderService.getAllOrders(),
        ]);

        if (statsRes.success) setStats(statsRes.data!);
        if (restaurantRes.success) setPendingRestaurants(restaurantRes.data!.filter(a => a.status === 'pending'));
        if (driverRes.success) setPendingDrivers(driverRes.data!.filter(a => a.status === 'pending'));
        if (ordersRes.success) setRecentOrders(ordersRes.data!.slice(0, 5));
      } catch {
        // Use mock data as fallback
        setStats(mockPlatformStats);
        setPendingRestaurants(mockRestaurantApplications.filter(a => a.status === 'pending'));
        setPendingDrivers(mockDriverApplications.filter(a => a.status === 'pending'));
        setRecentOrders(mockOrders.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && stats) {
      // Animate stats cards
      gsap.from(statsRef.current?.children || [], {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Animate content cards
      gsap.from(cardsRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out',
      });
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Today's Orders",
      value: stats?.today.orders || 0,
      change: '+12%',
      positive: true,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Revenue",
      value: `$${stats?.today.revenue.toLocaleString() || 0}`,
      change: '+8%',
      positive: true,
      icon: FiDollarSign,
      color: 'bg-mainGreen',
    },
    {
      title: 'Active Users',
      value: stats?.today.activeUsers || 0,
      change: '+5%',
      positive: true,
      icon: FiUsers,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Drivers',
      value: stats?.today.activeDrivers || 0,
      change: '-2%',
      positive: false,
      icon: FiTruck,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-mainBlack mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.positive ? (
                      <FiTrendingUp className="text-mainGreen" size={14} />
                    ) : (
                      <FiTrendingDown className="text-red-500" size={14} />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.positive ? 'text-mainGreen' : 'text-red-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-400 text-xs">vs yesterday</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-mainBlack flex items-center gap-2">
                <FiFileText className="text-mainGreen" />
                Pending Applications
              </h3>
              <Link
                href="/applications"
                className="text-mainGreen text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All
                <FiArrowRight size={14} />
              </Link>
            </div>

            {pendingRestaurants.length === 0 && pendingDrivers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No pending applications
              </p>
            ) : (
              <div className="space-y-3">
                {pendingRestaurants.slice(0, 2).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MdStorefront className="text-orange-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mainBlack truncate">
                        {app.restaurantName}
                      </p>
                      <p className="text-gray-500 text-sm">Restaurant Application</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  </div>
                ))}
                {pendingDrivers.slice(0, 2).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiTruck className="text-blue-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mainBlack truncate">
                        {app.driverName}
                      </p>
                      <p className="text-gray-500 text-sm">Driver Application</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-mainBlack flex items-center gap-2">
                <FiShoppingBag className="text-mainGreen" />
                Recent Orders
              </h3>
              <Link
                href="/orders"
                className="text-mainGreen text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All
                <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-mainBlack">#{order.id}</p>
                    <p className="text-gray-500 text-sm truncate">
                      {order.restaurantName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-mainBlack">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-mainBlack mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/applications"
                className="flex flex-col items-center gap-2 p-4 bg-mainGreen/5 rounded-xl hover:bg-mainGreen/10 transition-colors"
              >
                <div className="w-12 h-12 bg-mainGreen rounded-xl flex items-center justify-center">
                  <FiFileText className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-mainBlack">
                  Review Applications
                </span>
              </Link>
              <Link
                href="/finance"
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-mainBlack">
                  Process Payouts
                </span>
              </Link>
              <Link
                href="/restaurants"
                className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <MdStorefront className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-mainBlack">
                  Manage Restaurants
                </span>
              </Link>
              <Link
                href="/drivers"
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <FiTruck className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-mainBlack">
                  Manage Drivers
                </span>
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-mainBlack mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-red-500" />
              Attention Required
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiDollarSign className="text-red-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-mainBlack">2 Pending Refunds</p>
                  <p className="text-gray-500 text-sm">Customers waiting for refunds</p>
                </div>
                <Link
                  href="/finance"
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Review
                </Link>
              </div>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FiFileText className="text-yellow-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-mainBlack">
                    {pendingRestaurants.length + pendingDrivers.length} Pending Applications
                  </p>
                  <p className="text-gray-500 text-sm">Waiting for review</p>
                </div>
                <Link
                  href="/applications"
                  className="text-yellow-600 text-sm font-medium hover:underline"
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
