'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiX,
  FiMapPin,
  FiClock,
  FiUser,
  FiTruck,
  FiDollarSign,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import AdminLayout from '@/components/layout/AdminLayout';
import { Order } from '@/types';
import { OrderService } from '@/lib/services';
import { mockOrders } from '@/lib/mockData';

type StatusFilter = 'all' | 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const listRef = useRef<HTMLTableSectionElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OrderService.getAllOrders();
        if (response.success) {
          setOrders(response.data!);
        }
      } catch {
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && listRef.current) {
      gsap.from(listRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out',
      });
    }
  }, [loading, statusFilter]);

  useEffect(() => {
    if (selectedOrder && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedOrder]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-purple-100 text-purple-700';
      case 'picked_up':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusCounts = () => {
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-mainBlack">Orders</h1>
            <p className="text-gray-500 mt-1">
              Monitor all platform orders ({orders.length} total)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium">
              {statusCounts.pending} Pending
            </div>
            <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
              {statusCounts.preparing} Preparing
            </div>
            <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              {statusCounts.delivered} Delivered
            </div>
            <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {statusCounts.cancelled} Cancelled
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, restaurant or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="picked_up">Picked Up</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Restaurant
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody ref={listRef} className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <FiDollarSign className="mx-auto text-gray-300" size={48} />
                      <p className="text-gray-500 mt-4">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono font-medium text-mainBlack">
                          #{order.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-mainGreen/10 rounded-full flex items-center justify-center">
                            <FiUser className="text-mainGreen" size={14} />
                          </div>
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <MdStorefront className="text-orange-500" size={14} />
                          </div>
                          <span>{order.restaurantName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-mainBlack">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <FiEye size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-mainBlack">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 text-sm font-medium rounded-full capitalize ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer & Restaurant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-mainGreen/10 rounded-full flex items-center justify-center">
                      <FiUser className="text-mainGreen" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-mainBlack">Customer</p>
                      <p className="text-gray-500 text-sm">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <FiMapPin size={14} className="mt-1 flex-shrink-0" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MdStorefront className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-mainBlack">Restaurant</p>
                      <p className="text-gray-500 text-sm">{selectedOrder.restaurantName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedOrder.driverName && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiTruck className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-mainBlack">Driver</p>
                      <p className="text-gray-500 text-sm">{selectedOrder.driverName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-mainBlack mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-mainGreen/10 rounded-lg flex items-center justify-center text-sm font-medium text-mainGreen">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Service Fee</span>
                  <span>${selectedOrder.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-mainBlack pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-mainGreen">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-bold text-mainBlack mb-3 flex items-center gap-2">
                  <FiClock size={18} />
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-mainGreen rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-mainGreen rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order Confirmed</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-mainGreen rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-gray-500 text-xs">
                          {selectedOrder.deliveredAt
                            ? new Date(selectedOrder.deliveredAt).toLocaleString()
                            : 'Completed'}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-500">Cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
