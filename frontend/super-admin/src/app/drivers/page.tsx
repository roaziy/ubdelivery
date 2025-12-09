'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiPause, FiPlay, FiTruck, FiKey } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import PasswordChangeModal from '@/components/ui/PasswordChangeModal';
import { useNotifications } from '@/components/ui/Notification';
import { Driver } from '@/types';
import { DriverService } from '@/lib/services';
import { mockDrivers } from '@/lib/mockData';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; driver: Driver | null }>({ open: false, driver: null });
  const notify = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DriverService.getAllDrivers();
        if (response.success) setDrivers(response.data!);
      } catch {
        setDrivers(mockDrivers);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    if (currentStatus === 'active') {
      await DriverService.suspendDriver(id);
      setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status: 'suspended' as const } : d));
      notify.warning('Түдгэлзүүлсэн', `${name} жолооч түдгэлзүүлэгдлээ`);
    } else {
      await DriverService.activateDriver(id);
      setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status: 'active' as const } : d));
      notify.success('Идэвхжүүлсэн', `${name} жолооч идэвхжүүлэгдлээ`);
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-mainGreen';
      case 'suspended': return 'text-red-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Идэвхтэй';
      case 'suspended': return 'Түдгэлсэн';
      case 'offline': return 'Оффлайн';
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
          <h1 className="text-2xl font-bold text-mainBlack">Жолооч</h1>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-mainGreen rounded-full text-sm font-medium">
              {drivers.filter((d) => d.status === 'active').length} Идэвхтэй
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
              {drivers.filter((d) => d.status === 'offline').length} Оффлайн
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium">
              {drivers.filter((d) => d.status === 'suspended').length} Түдгэлсэн
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Жолооч хайх..."
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
                <th className="text-left py-3 px-4 font-medium">Жолооч</th>
                <th className="text-left py-3 px-4 font-medium">Тээвэр</th>
                <th className="text-left py-3 px-4 font-medium">Утас</th>
                <th className="text-left py-3 px-4 font-medium">Үнэлгээ</th>
                <th className="text-left py-3 px-4 font-medium">Хүргэлт</th>
                <th className="text-left py-3 px-4 font-medium">Орлого</th>
                <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    <FiTruck className="mx-auto mb-2" size={32} />
                    Жолооч олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">{driver.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{driver.vehicleModel}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{driver.phone}</td>
                    <td className="py-3 px-4 text-sm">{driver.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{driver.totalDeliveries}</td>
                    <td className="py-3 px-4 text-sm font-medium">₮{driver.totalEarnings.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${getStatusColor(driver.status)}`}>
                        {getStatusLabel(driver.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPasswordModal({ open: true, driver })}
                          className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200"
                          title="Change Password"
                        >
                          <FiKey size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(driver.id, driver.status, driver.name)}
                          className={`p-2 rounded-full ${
                            driver.status === 'active'
                              ? 'bg-red-100 text-red-500 hover:bg-red-200'
                              : 'bg-green-100 text-mainGreen hover:bg-green-200'
                          }`}
                        >
                          {driver.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
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
          onClose={() => setPasswordModal({ open: false, driver: null })}
          entityType="driver"
          entityName={passwordModal.driver?.name || ''}
          entityId={passwordModal.driver?.id || ''}
        />
      </div>
    </AdminLayout>
  );
}
