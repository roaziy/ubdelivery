'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiEdit,
  FiPause,
  FiPlay,
  FiTrash2,
  FiX,
  FiDollarSign,
  FiShoppingBag,
  FiClock,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import AdminLayout from '@/components/layout/AdminLayout';
import { Restaurant } from '@/types';
import { RestaurantService } from '@/lib/services';
import { mockRestaurants } from '@/lib/mockData';

type StatusFilter = 'all' | 'active' | 'suspended' | 'pending';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantService.getAllRestaurants();
        if (response.success) {
          setRestaurants(response.data!);
        }
      } catch {
        setRestaurants(mockRestaurants);
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
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }, [loading, statusFilter]);

  useEffect(() => {
    if (selectedRestaurant && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedRestaurant]);

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await RestaurantService.suspendRestaurant(id);
      if (response.success) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: 'suspended' as const } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to suspend:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await RestaurantService.activateRestaurant(id);
      if (response.success) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: 'active' as const } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to activate:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

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
            <h1 className="text-2xl font-bold text-mainBlack">Restaurants</h1>
            <p className="text-gray-500 mt-1">
              Manage all registered restaurants ({restaurants.length} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              {restaurants.filter((r) => r.status === 'active').length} Active
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {restaurants.filter((r) => r.status === 'suspended').length} Suspended
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRestaurants.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl">
              <MdStorefront className="mx-auto text-gray-300" size={48} />
              <p className="text-gray-500 mt-4">No restaurants found</p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MdStorefront className="text-orange-500" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-mainBlack truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-500 text-sm">{restaurant.cuisineType}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(
                          restaurant.status
                        )}`}
                      >
                        {restaurant.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiStar className="text-yellow-500" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiShoppingBag size={14} />
                    {restaurant.totalOrders} orders
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                  <FiMapPin size={14} />
                  <span className="truncate">{restaurant.address}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-mainGreen font-bold">
                    ${restaurant.totalRevenue.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <FiEdit size={18} className="text-gray-600" />
                    </button>
                    {restaurant.status === 'active' ? (
                      <button
                        onClick={() => handleSuspend(restaurant.id)}
                        disabled={actionLoading === restaurant.id}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <FiPause size={18} className="text-red-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(restaurant.id)}
                        disabled={actionLoading === restaurant.id}
                        className="p-2 hover:bg-green-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <FiPlay size={18} className="text-mainGreen" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">
                  Restaurant Details
                </h2>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <MdStorefront className="text-orange-500" size={48} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-mainBlack">
                      {selectedRestaurant.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                        selectedRestaurant.status
                      )}`}
                    >
                      {selectedRestaurant.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">{selectedRestaurant.cuisineType}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <FiStar className="text-yellow-500" />
                    <span className="font-medium">{selectedRestaurant.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({selectedRestaurant.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-mainGreen/10 rounded-xl text-center">
                  <FiDollarSign className="mx-auto text-mainGreen mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    ${selectedRestaurant.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <FiShoppingBag className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedRestaurant.totalOrders}
                  </p>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <FiStar className="mx-auto text-purple-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedRestaurant.rating.toFixed(1)}
                  </p>
                  <p className="text-gray-500 text-sm">Rating</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <FiClock className="mx-auto text-orange-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedRestaurant.avgDeliveryTime}
                  </p>
                  <p className="text-gray-500 text-sm">Avg. Delivery</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiMail size={14} />
                    Email
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedRestaurant.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedRestaurant.phone}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <FiMapPin size={14} />
                  Address
                </p>
                <p className="font-medium text-mainBlack mt-1">
                  {selectedRestaurant.address}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedRestaurant.status === 'active' ? (
                  <button
                    onClick={() => {
                      handleSuspend(selectedRestaurant.id);
                      setSelectedRestaurant(null);
                    }}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPause size={20} />
                    Suspend Restaurant
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleActivate(selectedRestaurant.id);
                      setSelectedRestaurant(null);
                    }}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlay size={20} />
                    Activate Restaurant
                  </button>
                )}
                <button className="px-6 py-3 border border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2">
                  <FiTrash2 size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
