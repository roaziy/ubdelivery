'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiPause, FiPlay, FiKey } from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import AdminLayout from '@/components/layout/AdminLayout';
import PasswordChangeModal from '@/components/ui/PasswordChangeModal';
import { Restaurant } from '@/types';
import { RestaurantService } from '@/lib/services';
import { mockRestaurants } from '@/lib/mockData';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; restaurant: Restaurant | null }>({ open: false, restaurant: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantService.getAllRestaurants();
        if (response.success) setRestaurants(response.data!);
      } catch {
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'active') {
      await RestaurantService.suspendRestaurant(id);
      setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, status: 'suspended' as const } : r));
    } else {
      await RestaurantService.activateRestaurant(id);
      setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, status: 'active' as const } : r));
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-mainGreen';
      case 'suspended': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Идэвхтэй';
      case 'suspended': return 'Түдгэлсэн';
      default: return 'Хүлээгдэж буй';
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-mainBlack">Рестораны</h1>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-mainGreen rounded-full text-sm font-medium">
              {restaurants.filter((r) => r.status === 'active').length} Идэвхтэй
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium">
              {restaurants.filter((r) => r.status === 'suspended').length} Түдгэлсэн
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ресторан хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="text-left py-3 px-4 font-medium">Ресторан</th>
                <th className="text-left py-3 px-4 font-medium">Хоолны төрөл</th>
                <th className="text-left py-3 px-4 font-medium">Үнэлгээ</th>
                <th className="text-left py-3 px-4 font-medium">Захиалга</th>
                <th className="text-left py-3 px-4 font-medium">Орлого</th>
                <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <MdStorefront className="mx-auto mb-2" size={32} />
                    Ресторан олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">{restaurant.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{restaurant.cuisineType}</td>
                    <td className="py-3 px-4 text-sm">{restaurant.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{restaurant.totalOrders}</td>
                    <td className="py-3 px-4 text-sm font-medium">₮{restaurant.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${getStatusColor(restaurant.status)}`}>
                        {getStatusLabel(restaurant.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPasswordModal({ open: true, restaurant })}
                          className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200"
                          title="Change Password"
                        >
                          <FiKey size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(restaurant.id, restaurant.status)}
                          className={`p-2 rounded-full ${
                            restaurant.status === 'active'
                              ? 'bg-red-100 text-red-500 hover:bg-red-200'
                              : 'bg-green-100 text-mainGreen hover:bg-green-200'
                          }`}
                        >
                          {restaurant.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PasswordChangeModal
          isOpen={passwordModal.open}
          onClose={() => setPasswordModal({ open: false, restaurant: null })}
          entityType="restaurant"
          entityName={passwordModal.restaurant?.name || ''}
          entityId={passwordModal.restaurant?.id || ''}
        />
      </div>
    </AdminLayout>
  );
}
