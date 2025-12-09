'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiPhone,
  FiMail,
  FiEdit,
  FiPause,
  FiPlay,
  FiTrash2,
  FiX,
  FiDollarSign,
  FiTruck,
  FiMapPin,
} from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { Driver } from '@/types';
import { DriverService } from '@/lib/services';
import { mockDrivers } from '@/lib/mockData';

type StatusFilter = 'all' | 'active' | 'suspended' | 'offline';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const listRef = useRef<HTMLTableSectionElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DriverService.getAllDrivers();
        if (response.success) {
          setDrivers(response.data!);
        }
      } catch {
        setDrivers(mockDrivers);
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
    if (selectedDriver && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedDriver]);

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await DriverService.suspendDriver(id);
      if (response.success) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: 'suspended' as const } : d
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
      const response = await DriverService.activateDriver(id);
      if (response.success) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: 'active' as const } : d
          )
        );
      }
    } catch (error) {
      console.error('Failed to activate:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      case 'offline':
        return 'bg-gray-100 text-gray-700';
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
            <h1 className="text-2xl font-bold text-mainBlack">Drivers</h1>
            <p className="text-gray-500 mt-1">
              Manage all registered drivers ({drivers.length} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              {drivers.filter((d) => d.status === 'active').length} Active
            </div>
            <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
              {drivers.filter((d) => d.status === 'offline').length} Offline
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {drivers.filter((d) => d.status === 'suspended').length} Suspended
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
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
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Driver
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Vehicle
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Performance
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Earnings
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
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <FiTruck className="mx-auto text-gray-300" size={48} />
                      <p className="text-gray-500 mt-4">No drivers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiTruck className="text-blue-500" size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-mainBlack">
                              {driver.name}
                            </p>
                            <p className="text-gray-500 text-sm">{driver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-mainBlack capitalize">
                          {driver.vehicleType}
                        </p>
                        <p className="text-gray-500 text-sm">{driver.vehicleModel}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FiStar className="text-yellow-500" />
                          <span className="font-medium">{driver.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {driver.totalDeliveries} deliveries
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-mainGreen">
                          ${driver.totalEarnings.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            driver.status
                          )}`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDriver(driver)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <FiEdit size={18} className="text-gray-600" />
                          </button>
                          {driver.status === 'active' || driver.status === 'offline' ? (
                            <button
                              onClick={() => handleSuspend(driver.id)}
                              disabled={actionLoading === driver.id}
                              className="p-2 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              <FiPause size={18} className="text-red-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(driver.id)}
                              disabled={actionLoading === driver.id}
                              className="p-2 hover:bg-green-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              <FiPlay size={18} className="text-mainGreen" />
                            </button>
                          )}
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

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">
                  Driver Details
                </h2>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FiTruck className="text-blue-500" size={48} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-mainBlack">
                      {selectedDriver.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                        selectedDriver.status
                      )}`}
                    >
                      {selectedDriver.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1 capitalize">
                    {selectedDriver.vehicleType} - {selectedDriver.vehicleModel}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <FiStar className="text-yellow-500" />
                    <span className="font-medium">{selectedDriver.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({selectedDriver.totalDeliveries} deliveries)</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-mainGreen/10 rounded-xl text-center">
                  <FiDollarSign className="mx-auto text-mainGreen mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    ${selectedDriver.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Total Earnings</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <FiTruck className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedDriver.totalDeliveries}
                  </p>
                  <p className="text-gray-500 text-sm">Deliveries</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <FiStar className="mx-auto text-purple-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedDriver.rating.toFixed(1)}
                  </p>
                  <p className="text-gray-500 text-sm">Rating</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <FiMapPin className="mx-auto text-orange-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedDriver.completionRate}%
                  </p>
                  <p className="text-gray-500 text-sm">Completion</p>
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
                    {selectedDriver.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedDriver.phone}
                  </p>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Vehicle Type</p>
                  <p className="font-medium text-mainBlack mt-1 capitalize">
                    {selectedDriver.vehicleType}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Vehicle Model</p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedDriver.vehicleModel}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">License Plate</p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedDriver.licensePlate}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedDriver.status !== 'suspended' ? (
                  <button
                    onClick={() => {
                      handleSuspend(selectedDriver.id);
                      setSelectedDriver(null);
                    }}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPause size={20} />
                    Suspend Driver
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleActivate(selectedDriver.id);
                      setSelectedDriver(null);
                    }}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlay size={20} />
                    Activate Driver
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
