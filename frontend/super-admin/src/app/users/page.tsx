'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSearch,
  FiFilter,
  FiPhone,
  FiMail,
  FiEye,
  FiX,
  FiShoppingBag,
  FiCalendar,
  FiPause,
  FiPlay,
  FiUser,
} from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/types';
import { UserService } from '@/lib/services';
import { mockUsers } from '@/lib/mockData';

type StatusFilter = 'all' | 'active' | 'suspended';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const listRef = useRef<HTMLTableSectionElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getAllUsers();
        if (response.success) {
          setUsers(response.data!);
        }
      } catch {
        setUsers(mockUsers);
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
    if (selectedUser && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedUser]);

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await UserService.suspendUser(id);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: 'suspended' as const } : u
          )
        );
        if (selectedUser?.id === id) {
          setSelectedUser({ ...selectedUser, status: 'suspended' });
        }
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
      const response = await UserService.activateUser(id);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: 'active' as const } : u
          )
        );
        if (selectedUser?.id === id) {
          setSelectedUser({ ...selectedUser, status: 'active' });
        }
      }
    } catch (error) {
      console.error('Failed to activate:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
            <h1 className="text-2xl font-bold text-mainBlack">Users</h1>
            <p className="text-gray-500 mt-1">
              Manage all registered users ({users.length} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              {users.filter((u) => u.status === 'active').length} Active
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {users.filter((u) => u.status === 'suspended').length} Suspended
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
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
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Orders
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Total Spent
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Joined
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <FiUser className="mx-auto text-gray-300" size={48} />
                      <p className="text-gray-500 mt-4">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-mainGreen/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="text-mainGreen" size={20} />
                          </div>
                          <p className="font-medium text-mainBlack">
                            {user.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-mainBlack">{user.email}</p>
                        <p className="text-gray-500 text-sm">{user.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium">{user.totalOrders}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-mainGreen">
                          ${user.totalSpent.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <FiEye size={18} className="text-gray-600" />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              <FiPause size={18} className="text-red-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              disabled={actionLoading === user.id}
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-mainGreen/10 rounded-2xl flex items-center justify-center">
                  <FiUser className="text-mainGreen" size={40} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-mainBlack">
                      {selectedUser.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-mainGreen/10 rounded-xl text-center">
                  <FiShoppingBag className="mx-auto text-mainGreen mb-2" size={24} />
                  <p className="text-2xl font-bold text-mainBlack">
                    {selectedUser.totalOrders}
                  </p>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <span className="text-2xl">💰</span>
                  <p className="text-2xl font-bold text-mainBlack mt-1">
                    ${selectedUser.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiMail size={14} />
                    Email
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedUser.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiCalendar size={14} />
                    Last Order
                  </p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedUser.lastOrderDate
                      ? new Date(selectedUser.lastOrderDate).toLocaleDateString()
                      : 'No orders yet'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => handleSuspend(selectedUser.id)}
                    disabled={actionLoading === selectedUser.id}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiPause size={20} />
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(selectedUser.id)}
                    disabled={actionLoading === selectedUser.id}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiPlay size={20} />
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
