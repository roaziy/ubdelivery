'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiPause, FiPlay, FiUser } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/types';
import { UserService } from '@/lib/services';
import { mockUsers } from '@/lib/mockData';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getAllUsers();
        if (response.success) setUsers(response.data!);
      } catch {
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'active') {
      await UserService.suspendUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'suspended' as const } : u));
    } else {
      await UserService.activateUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'active' as const } : u));
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-mainGreen';
      case 'suspended': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Идэвхтэй';
      case 'suspended': return 'Түдгэлсэн';
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-mainBlack">Хэрэглэгч</h1>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-mainGreen rounded-full text-sm font-medium">
              {users.filter((u) => u.status === 'active').length} Идэвхтэй
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium">
              {users.filter((u) => u.status === 'suspended').length} Түдгэлсэн
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Хэрэглэгч хайх..."
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
                <th className="text-left py-3 px-4 font-medium">Нэр</th>
                <th className="text-left py-3 px-4 font-medium">И-мэйл</th>
                <th className="text-left py-3 px-4 font-medium">Утас</th>
                <th className="text-left py-3 px-4 font-medium">Захиалга</th>
                <th className="text-left py-3 px-4 font-medium">Нийт зарцуулсан</th>
                <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <FiUser className="mx-auto mb-2" size={32} />
                    Хэрэглэгч олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.totalOrders}</td>
                    <td className="py-3 px-4 text-sm font-medium">₮{user.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${getStatusColor(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`p-2 rounded-full ${
                          user.status === 'active'
                            ? 'bg-red-100 text-red-500 hover:bg-red-200'
                            : 'bg-green-100 text-mainGreen hover:bg-green-200'
                        }`}
                      >
                        {user.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
                      </button>
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
