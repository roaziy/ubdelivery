'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiEye,
  FiTruck,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import AdminLayout from '@/components/layout/AdminLayout';
import { RestaurantApplication, DriverApplication } from '@/types';
import { ApplicationService } from '@/lib/services';
import { mockRestaurantApplications, mockDriverApplications } from '@/lib/mockData';

type TabType = 'restaurants' | 'drivers';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('restaurants');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantApps, setRestaurantApps] = useState<RestaurantApplication[]>([]);
  const [driverApps, setDriverApps] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantApplication | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
  }, [loading, activeTab, statusFilter]);

  useEffect(() => {
    if (selectedRestaurant || selectedDriver) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedRestaurant, selectedDriver]);

  const handleApproveRestaurant = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await ApplicationService.approveRestaurant(id);
      if (response.success) {
        setRestaurantApps((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'approved' as const } : app
          )
        );
        setSelectedRestaurant(null);
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRestaurant = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await ApplicationService.rejectRestaurant(id, 'Does not meet requirements');
      if (response.success) {
        setRestaurantApps((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'rejected' as const } : app
          )
        );
        setSelectedRestaurant(null);
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveDriver = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await ApplicationService.approveDriver(id);
      if (response.success) {
        setDriverApps((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'approved' as const } : app
          )
        );
        setSelectedDriver(null);
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDriver = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await ApplicationService.rejectDriver(id, 'Does not meet requirements');
      if (response.success) {
        setDriverApps((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: 'rejected' as const } : app
          )
        );
        setSelectedDriver(null);
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRestaurants = restaurantApps.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredDrivers = driverApps.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
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
        <div>
          <h1 className="text-2xl font-bold text-mainBlack">Applications</h1>
          <p className="text-gray-500 mt-1">
            Review and manage restaurant and driver applications
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'restaurants'
                ? 'text-mainGreen'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <MdStorefront size={20} />
              Restaurants
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {restaurantApps.filter((a) => a.status === 'pending').length}
              </span>
            </div>
            {activeTab === 'restaurants' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mainGreen"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'drivers'
                ? 'text-mainGreen'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiTruck size={20} />
              Drivers
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {driverApps.filter((a) => a.status === 'pending').length}
              </span>
            </div>
            {activeTab === 'drivers' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mainGreen"></div>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div ref={listRef} className="space-y-4">
          {activeTab === 'restaurants' ? (
            filteredRestaurants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <MdStorefront className="mx-auto text-gray-300" size={48} />
                <p className="text-gray-500 mt-4">No restaurant applications found</p>
              </div>
            ) : (
              filteredRestaurants.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MdStorefront className="text-orange-500" size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-mainBlack text-lg">
                            {app.restaurantName}
                          </h3>
                          <p className="text-gray-500">{app.ownerName}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiMail size={14} />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiPhone size={14} />
                          {app.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin size={14} />
                          {app.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRestaurant(app)}
                        className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FiEye size={20} className="text-gray-600" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRestaurant(app.id)}
                            disabled={actionLoading === app.id}
                            className="p-3 bg-mainGreen text-white rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                          >
                            <FiCheck size={20} />
                          </button>
                          <button
                            onClick={() => handleRejectRestaurant(app.id)}
                            disabled={actionLoading === app.id}
                            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            <FiX size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <FiTruck className="mx-auto text-gray-300" size={48} />
              <p className="text-gray-500 mt-4">No driver applications found</p>
            </div>
          ) : (
            filteredDrivers.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiTruck className="text-blue-500" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-mainBlack text-lg">
                          {app.driverName}
                        </h3>
                        <p className="text-gray-500 capitalize">
                          {app.vehicleType} Driver
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiMail size={14} />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPhone size={14} />
                        {app.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDriver(app)}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <FiEye size={20} className="text-gray-600" />
                    </button>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveDriver(app.id)}
                          disabled={actionLoading === app.id}
                          className="p-3 bg-mainGreen text-white rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                        >
                          <FiCheck size={20} />
                        </button>
                        <button
                          onClick={() => handleRejectDriver(app.id)}
                          disabled={actionLoading === app.id}
                          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <FiX size={20} />
                        </button>
                      </>
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
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">
                  Restaurant Application
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
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MdStorefront className="text-orange-500" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-mainBlack">
                    {selectedRestaurant.restaurantName}
                  </h3>
                  <p className="text-gray-500">{selectedRestaurant.cuisineType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Owner Name</p>
                  <p className="font-medium text-mainBlack">
                    {selectedRestaurant.ownerName}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium text-mainBlack">
                    {selectedRestaurant.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium text-mainBlack">
                    {selectedRestaurant.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Business License</p>
                  <p className="font-medium text-mainBlack">
                    {selectedRestaurant.businessLicense}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-medium text-mainBlack">
                  {selectedRestaurant.address}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-sm">Description</p>
                <p className="font-medium text-mainBlack">
                  {selectedRestaurant.description}
                </p>
              </div>

              {selectedRestaurant.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApproveRestaurant(selectedRestaurant.id)}
                    disabled={actionLoading === selectedRestaurant.id}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiCheck size={20} />
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleRejectRestaurant(selectedRestaurant.id)}
                    disabled={actionLoading === selectedRestaurant.id}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiX size={20} />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">
                  Driver Application
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
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiTruck className="text-blue-500" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-mainBlack">
                    {selectedDriver.driverName}
                  </h3>
                  <p className="text-gray-500 capitalize">
                    {selectedDriver.vehicleType} Driver
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium text-mainBlack">
                    {selectedDriver.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium text-mainBlack">
                    {selectedDriver.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Driver License</p>
                  <p className="font-medium text-mainBlack">
                    {selectedDriver.driverLicense}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Vehicle Type</p>
                  <p className="font-medium text-mainBlack capitalize">
                    {selectedDriver.vehicleType}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Vehicle Model</p>
                  <p className="font-medium text-mainBlack">
                    {selectedDriver.vehicleModel}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">License Plate</p>
                  <p className="font-medium text-mainBlack">
                    {selectedDriver.licensePlate}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-medium text-mainBlack">
                  {selectedDriver.address}
                </p>
              </div>

              {selectedDriver.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApproveDriver(selectedDriver.id)}
                    disabled={actionLoading === selectedDriver.id}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiCheck size={20} />
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleRejectDriver(selectedDriver.id)}
                    disabled={actionLoading === selectedDriver.id}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiX size={20} />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
