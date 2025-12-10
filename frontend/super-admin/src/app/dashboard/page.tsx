'use client';

import { useState, useEffect } from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { analyticsService, restaurantApplicationService, driverApplicationService, orderService } from '@/lib/services';

interface DashboardStats {
  orders: { total: number; pending: number; delivered: number; cancelled: number };
  revenue: { total: number; deliveryFees: number };
  users: number;
  restaurants: number;
  drivers: number;
  pendingApplications: number;
}

interface Application {
  id: string;
  name: string;
  phone: string;
  type: string;
  status: string;
  restaurantName?: string;
  ownerName?: string;
  driverName?: string;
  vehicleType?: string;
}

interface Order {
  id: string;
  order_number?: string;
  status: string;
  total_amount: number;
  restaurant?: { name: string };
  user?: { full_name: string };
}

function StatCard({ title, value, change, prefix = '₮' }: { 
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
                <span className="text-gray-400 ml-1">өчигдрөөс</span>
            </div>
        </div>
    );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<Application[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<Application[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await analyticsService.getPlatformStats();
        if (statsRes.success && statsRes.data) {
          // Handle the nested data structure from backend
          const data = statsRes.data as { stats?: DashboardStats } & DashboardStats;
          setStats(data.stats || data);
        }

        // Fetch restaurant applications
        const restaurantRes = await restaurantApplicationService.getApplications({ status: 'pending' });
        if (restaurantRes.success && restaurantRes.data) {
          const items = restaurantRes.data.items || restaurantRes.data;
          setPendingRestaurants(Array.isArray(items) ? items : []);
        }

        // Fetch driver applications
        const driverRes = await driverApplicationService.getApplications({ status: 'pending' });
        if (driverRes.success && driverRes.data) {
          const items = driverRes.data.items || driverRes.data;
          setPendingDrivers(Array.isArray(items) ? items : []);
        }

        // Fetch recent orders
        const ordersRes = await orderService.getOrders({ limit: 8 });
        if (ordersRes.success && ordersRes.data) {
          const items = ordersRes.data.items || ordersRes.data;
          setRecentOrders(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Хүргэгдсэн';
      case 'cancelled': return 'Цуцлагдсан';
      case 'pending': return 'Хүлээгдэж буй';
      case 'preparing': return 'Бэлтгэж буй';
      case 'confirmed': return 'Баталгаажсан';
      case 'ready': return 'Бэлэн';
      case 'picked_up': return 'Авсан';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Хянах самбар</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Өнөөдрийн орлого" 
            value={stats?.revenue?.total || 0} 
            change={8.2} 
          />
          <StatCard 
            title="Өнөөдрийн захиалга" 
            value={stats?.orders?.total || 0}
            change={12.5}
            prefix=""
          />
          <StatCard 
            title="Нийт хэрэглэгч" 
            value={stats?.users || 0}
            change={5.1}
            prefix=""
          />
          <StatCard 
            title="Нийт жолооч" 
            value={stats?.drivers || 0}
            change={-2.3}
            prefix=""
          />
        </div>

        {/* Recent Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-mainBlack">Сүүлийн захиалгууд</h2>
            <Link 
              href="/orders" 
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              Бүгдийг харах
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Захиалгын ID</th>
                  <th className="text-left py-3 px-4 font-medium">Ресторан</th>
                  <th className="text-left py-3 px-4 font-medium">Хэрэглэгч</th>
                  <th className="text-left py-3 px-4 font-medium">Нийт</th>
                  <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Захиалга олдсонгүй
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr key={order.id || index} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">
                        {order.order_number || `#${order.id?.slice(0, 8)}`}
                      </td>
                      <td className="py-3 px-4 text-sm">{order.restaurant?.name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{order.user?.full_name || '-'}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ₮{(order.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Applications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Restaurant Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-mainBlack">Рестораны өргөдлүүд</h2>
              <Link 
                href="/applications" 
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Бүгдийг харах
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {pendingRestaurants.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Хүлээгдэж буй өргөдөл байхгүй
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingRestaurants.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-mainBlack">
                          {app.restaurantName || app.name || '-'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {app.ownerName || app.phone || '-'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                        Хүлээгдэж буй
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
              <h2 className="text-xl font-bold text-mainBlack">Жолоочийн өргөдлүүд</h2>
              <Link 
                href="/applications" 
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Бүгдийг харах
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {pendingDrivers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Хүлээгдэж буй өргөдөл байхгүй
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingDrivers.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-mainBlack">
                          {app.driverName || app.name || '-'}
                        </p>
                        <p className="text-sm text-gray-400 capitalize">
                          {app.vehicleType || 'Жолооч'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                        Хүлээгдэж буй
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
