'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { RestaurantApplication, DriverApplication } from '@/types';
import { ApplicationService } from '@/lib/services';
import { mockRestaurantApplications, mockDriverApplications } from '@/lib/mockData';

type TabType = 'restaurants' | 'drivers';

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantApps, setRestaurantApps] = useState<RestaurantApplication[]>([]);
  const [driverApps, setDriverApps] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, driverRes] = await Promise.all([
          ApplicationService.getRestaurantApplications(),
          ApplicationService.getDriverApplications(),
        ]);
        if (restaurantRes.success) setRestaurantApps(restaurantRes.data!);
        if (driverRes.success) setDriverApps(driverRes.data!);
      } catch {
        setRestaurantApps(mockRestaurantApplications);
        setDriverApps(mockDriverApplications);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string, type: 'restaurant' | 'driver') => {
    if (type === 'restaurant') {
      await ApplicationService.approveRestaurant(id);
      setRestaurantApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' as const } : a));
    } else {
      await ApplicationService.approveDriver(id);
      setDriverApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' as const } : a));
    }
  };

  const handleReject = async (id: string, type: 'restaurant' | 'driver') => {
    if (type === 'restaurant') {
      await ApplicationService.rejectRestaurant(id, 'Does not meet requirements');
      setRestaurantApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' as const } : a));
    } else {
      await ApplicationService.rejectDriver(id, 'Does not meet requirements');
      setDriverApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' as const } : a));
    }
  };

  const filteredRestaurants = restaurantApps.filter((a) =>
    a.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = driverApps.filter((a) =>
    a.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-mainGreen';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
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
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Applications</h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'restaurants' ? 'bg-mainGreen text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MdStorefront size={18} />
            Restaurants ({restaurantApps.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'drivers' ? 'bg-mainGreen text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiTruck size={18} />
            Drivers ({driverApps.filter((a) => a.status === 'pending').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {activeTab === 'restaurants' ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Restaurant</th>
                  <th className="text-left py-3 px-4 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">No applications found</td>
                  </tr>
                ) : (
                  filteredRestaurants.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">{app.restaurantName}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.ownerName}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm capitalize ${getStatusColor(app.status)}`}>{app.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id, 'restaurant')}
                              className="p-2 bg-mainGreen text-white rounded-full hover:bg-green-600"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app.id, 'restaurant')}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Driver</th>
                  <th className="text-left py-3 px-4 font-medium">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">No applications found</td>
                  </tr>
                ) : (
                  filteredDrivers.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">{app.driverName}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 capitalize">{app.vehicleType}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm capitalize ${getStatusColor(app.status)}`}>{app.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id, 'driver')}
                              className="p-2 bg-mainGreen text-white rounded-full hover:bg-green-600"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app.id, 'driver')}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
