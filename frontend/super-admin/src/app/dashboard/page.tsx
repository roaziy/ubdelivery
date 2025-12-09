'use client';

import { useState, useEffect } from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
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

function StatCard({ title, value, change, prefix = '$' }: { 
    title: string; 
    value: number | string; 
    change: number;
    prefix?: string;
}) {
    const isPositive = change >= 0;
    const displayValue = typeof value === 'number' 
        ? `${prefix}${value.toLocaleString()}` 
        : value;
    
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{title}</p>
            <p className="text-3xl font-bold text-mainBlack">{displayValue}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-mainGreen' : 'text-red-500'}`}>
                {isPositive ? <IoTrendingUp size={16} /> : <IoTrendingDown size={16} />}
                <span>{isPositive ? '+' : ''}{change}%</span>
                <span className="text-gray-400 ml-1">vs yesterday</span>
            </div>
        </div>
    );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<RestaurantApplication[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<DriverApplication[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, restaurantRes, driverRes, ordersRes] = await Promise.all([
          StatsService.getPlatformStats(),
          ApplicationService.getRestaurantApplications(),
          ApplicationService.getDriverApplications(),
          OrderService.getAllOrders(),
        ]);

        if (statsRes.success) setStats(statsRes.data!);
        if (restaurantRes.success) setPendingRestaurants(restaurantRes.data!.filter(a => a.status === 'pending'));
        if (driverRes.success) setPendingDrivers(driverRes.data!.filter(a => a.status === 'pending'));
        if (ordersRes.success) setRecentOrders(ordersRes.data!.slice(0, 8));
      } catch {
        setStats(mockPlatformStats);
        setPendingRestaurants(mockRestaurantApplications.filter(a => a.status === 'pending'));
        setPendingDrivers(mockDriverApplications.filter(a => a.status === 'pending'));
        setRecentOrders(mockOrders.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-mainGreen';
      case 'cancelled':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      case 'preparing':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Today's Revenue" 
            value={stats?.today.revenue || 0} 
            change={8.2} 
          />
          <StatCard 
            title="Today's Orders" 
            value={stats?.today.orders || 0}
            change={12.5}
            prefix=""
          />
          <StatCard 
            title="Active Users" 
            value={stats?.today.activeUsers || 0}
            change={5.1}
            prefix=""
          />
          <StatCard 
            title="Active Drivers" 
            value={stats?.today.activeDrivers || 0}
            change={-2.3}
            prefix=""
          />
        </div>

        {/* Recent Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-mainBlack">Recent Orders</h2>
            <Link 
              href="/orders" 
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              View All Orders
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Restaurant</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">#{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.restaurantName}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm font-medium">${order.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Applications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Restaurant Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-mainBlack">Restaurant Applications</h2>
              <Link 
                href="/applications" 
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {pendingRestaurants.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No pending applications
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingRestaurants.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-mainBlack">{app.restaurantName}</p>
                        <p className="text-sm text-gray-400">{app.ownerName}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Driver Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-mainBlack">Driver Applications</h2>
              <Link 
                href="/applications" 
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {pendingDrivers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No pending applications
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingDrivers.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-mainBlack">{app.driverName}</p>
                        <p className="text-sm text-gray-400 capitalize">{app.vehicleType} Driver</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
