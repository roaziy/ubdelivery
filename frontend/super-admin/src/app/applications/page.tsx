'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { restaurantApplicationService, driverApplicationService } from '@/lib/services';
import { useNotifications } from '@/components/ui/Notification';

interface Application {
  id: string;
  name: string;
  owner_name?: string;
  phone: string;
  email?: string;
  address?: string;
  type: string;
  status: string;
  vehicle_type?: string;
  cuisine_type?: string;
  created_at?: string;
}

type TabType = 'restaurants' | 'drivers';

export default function ApplicationsPage() {
  const notify = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantApps, setRestaurantApps] = useState<Application[]>([]);
  const [driverApps, setDriverApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch restaurant applications
        const restaurantRes = await restaurantApplicationService.getApplications();
        if (restaurantRes.success && restaurantRes.data) {
          const items = restaurantRes.data.items || restaurantRes.data;
          setRestaurantApps(Array.isArray(items) ? (items as unknown as Application[]) : []);
        }

        // Fetch driver applications
        const driverRes = await driverApplicationService.getApplications();
        if (driverRes.success && driverRes.data) {
          const items = driverRes.data.items || driverRes.data;
          setDriverApps(Array.isArray(items) ? (items as unknown as Application[]) : []);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string, type: 'restaurant' | 'driver', name: string) => {
    try {
      if (type === 'restaurant') {
        const res = await restaurantApplicationService.approveApplication(id);
        if (res.success) {
          // Remove approved application from the list
          setRestaurantApps((prev) => prev.filter((a) => a.id !== id));
          notify.success('Зөвшөөрөгдлөө', `${name} ресторан зөвшөөрөгдлөө. Ресторанууд хуудас руу ороод шалгана уу.`);
        } else {
          notify.error('Алдаа', res.error || 'Зөвшөөрөхөд алдаа гарлаа');
        }
      } else {
        const res = await driverApplicationService.approveApplication(id);
        if (res.success) {
          // Remove approved application from the list
          setDriverApps((prev) => prev.filter((a) => a.id !== id));
          notify.success('Зөвшөөрөгдлөө', `${name} жолооч зөвшөөрөгдлөө`);
        } else {
          notify.error('Алдаа', res.error || 'Зөвшөөрөхөд алдаа гарлаа');
        }
      }
    } catch (error) {
      console.error('Approve error:', error);
      notify.error('Алдаа', 'Зөвшөөрөхөд алдаа гарлаа');
    }
  };

  const handleReject = async (id: string, type: 'restaurant' | 'driver', name: string) => {
    try {
      if (type === 'restaurant') {
        const res = await restaurantApplicationService.rejectApplication(id, 'Шаардлага хангаагүй');
        if (res.success) {
          setRestaurantApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a));
          notify.error('Татгалзсан', `${name} ресторан татгалзагдлаа`);
        }
      } else {
        const res = await driverApplicationService.rejectApplication(id, 'Шаардлага хангаагүй');
        if (res.success) {
          setDriverApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a));
          notify.error('Татгалзсан', `${name} жолооч татгалзагдлаа`);
        }
      }
    } catch (error) {
      console.error('Reject error:', error);
      notify.error('Алдаа', 'Татгалзахад алдаа гарлаа');
    }
  };

  // Safe filter with null checks
  const filteredRestaurants = restaurantApps.filter((a) =>
    (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.owner_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = driverApps.filter((a) =>
    (a.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-mainGreen';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Зөвшөөрсөн';
      case 'rejected': return 'Татгалзсан';
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
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Өргөдлүүд</h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'restaurants' ? 'bg-mainGreen text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MdStorefront size={18} />
            Ресторан ({restaurantApps.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'drivers' ? 'bg-mainGreen text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiTruck size={18} />
            Жолооч ({driverApps.filter((a) => a.status === 'pending').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'restaurants' ? 'Ресторан хайх...' : 'Жолооч хайх...'}
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
                  <th className="text-left py-3 px-4 font-medium">Ресторан</th>
                  <th className="text-left py-3 px-4 font-medium">Эзэн</th>
                  <th className="text-left py-3 px-4 font-medium">И-мэйл</th>
                  <th className="text-left py-3 px-4 font-medium">Утас</th>
                  <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                  <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">Өргөдөл олдсонгүй</td>
                  </tr>
                ) : (
                  filteredRestaurants.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">{app.name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.owner_name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.email || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${getStatusColor(app.status)}`}>{getStatusLabel(app.status)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id, 'restaurant', app.name || 'Ресторан')}
                              className="p-2 bg-mainGreen text-white rounded-full hover:bg-green-600"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app.id, 'restaurant', app.name || 'Ресторан')}
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
                  <th className="text-left py-3 px-4 font-medium">Жолооч</th>
                  <th className="text-left py-3 px-4 font-medium">Тээвэр</th>
                  <th className="text-left py-3 px-4 font-medium">И-мэйл</th>
                  <th className="text-left py-3 px-4 font-medium">Утас</th>
                  <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                  <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">Өргөдөл олдсонгүй</td>
                  </tr>
                ) : (
                  filteredDrivers.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">{app.name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 capitalize">{app.vehicle_type || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.email || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${getStatusColor(app.status)}`}>{getStatusLabel(app.status)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id, 'driver', app.name || 'Жолооч')}
                              className="p-2 bg-mainGreen text-white rounded-full hover:bg-green-600"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app.id, 'driver', app.name || 'Жолооч')}
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
