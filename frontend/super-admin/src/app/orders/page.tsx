'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingBag } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { Order } from '@/types';
import { OrderService } from '@/lib/services';

type StatusFilter = 'all' | 'pending' | 'preparing' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OrderService.getAllOrders();
        if (response.success && response.data) {
          const data = response.data as any;
          const items = data.items || data;
          setOrders(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredOrders = orders.filter((order: any) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.restaurantName || order.restaurant_name || order.restaurant?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-mainGreen';
      case 'cancelled': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'preparing': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Хүргэгдсэн';
      case 'cancelled': return 'Цуцлагдсан';
      case 'pending': return 'Хүлээгдэж буй';
      case 'preparing': return 'Бэлтгэж буй';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Захиалгууд</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Захиалга хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'preparing', 'delivered', 'cancelled'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-mainGreen text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'Бүгд' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="text-left py-3 px-4 font-medium">Захиалгын ID</th>
                <th className="text-left py-3 px-4 font-medium">Ресторан</th>
                <th className="text-left py-3 px-4 font-medium">Хэрэглэгч</th>
                <th className="text-left py-3 px-4 font-medium">Жолооч</th>
                <th className="text-left py-3 px-4 font-medium">Нийт</th>
                <th className="text-left py-3 px-4 font-medium">Огноо</th>
                <th className="text-left py-3 px-4 font-medium">Төлөв</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <FiShoppingBag className="mx-auto mb-2" size={32} />
                    Захиалга олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">#{order.order_number || order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.restaurantName || order.restaurant_name || order.restaurant?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.customerName || order.customer_name || order.user?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.driverName || order.driver_name || order.driver?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium">₮{(order.totalAmount ?? order.total_amount ?? order.total ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString() : '-'}
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
    </AdminLayout>
  );
}
