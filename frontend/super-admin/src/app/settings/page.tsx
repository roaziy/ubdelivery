'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiSave,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiBell,
  FiGlobe,
  FiDollarSign,
  FiPercent,
} from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { AdminUser } from '@/types';
import { mockAdminUser } from '@/lib/mockData';

interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  deliveryFee: number;
  serviceFeePercent: number;
  minOrderAmount: number;
  maxDeliveryRadius: number;
  driverCommissionPercent: number;
  restaurantCommissionPercent: number;
}

export default function SettingsPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'platform' | 'notifications'>('profile');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    platformName: 'UB Delivery',
    supportEmail: 'support@ubdelivery.com',
    deliveryFee: 2.99,
    serviceFeePercent: 5,
    minOrderAmount: 10,
    maxDeliveryRadius: 15,
    driverCommissionPercent: 80,
    restaurantCommissionPercent: 85,
  });

  const [notifications, setNotifications] = useState({
    emailNewOrders: true,
    emailNewApplications: true,
    emailRefundRequests: true,
    emailDailyReport: false,
    emailWeeklyReport: true,
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load admin data
    setAdmin(mockAdminUser);
    setProfileData({
      name: mockAdminUser.name,
      email: mockAdminUser.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && formRef.current) {
      gsap.from(formRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [loading, activeSection]);

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Profile updated successfully!');
  };

  const handleSavePlatformSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Platform settings updated successfully!');
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Notification settings updated successfully!');
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
          <h1 className="text-2xl font-bold text-mainBlack">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account and platform settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'profile'
                      ? 'bg-mainGreen text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiUser size={20} />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveSection('platform')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'platform'
                      ? 'bg-mainGreen text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiGlobe size={20} />
                  <span className="font-medium">Platform</span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'notifications'
                      ? 'bg-mainGreen text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiBell size={20} />
                  <span className="font-medium">Notifications</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 bg-mainGreen rounded-2xl flex items-center justify-center">
                      <FiShield className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-mainBlack">
                        {admin?.name}
                      </h2>
                      <p className="text-gray-500 capitalize">
                        {admin?.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-mainBlack mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            value={profileData.currentPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                    >
                      <FiSave size={20} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Platform Section */}
              {activeSection === 'platform' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-mainBlack">
                      Platform Settings
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Configure platform-wide settings and fees
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={platformSettings.platformName}
                        onChange={(e) =>
                          setPlatformSettings({
                            ...platformSettings,
                            platformName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={platformSettings.supportEmail}
                        onChange={(e) =>
                          setPlatformSettings({
                            ...platformSettings,
                            supportEmail: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-mainBlack mb-4">
                      Fee Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Delivery Fee
                        </label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={platformSettings.deliveryFee}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                deliveryFee: parseFloat(e.target.value),
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Fee
                        </label>
                        <div className="relative">
                          <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={platformSettings.serviceFeePercent}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                serviceFeePercent: parseInt(e.target.value),
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Order Amount
                        </label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={platformSettings.minOrderAmount}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                minOrderAmount: parseFloat(e.target.value),
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Delivery Radius (km)
                        </label>
                        <input
                          type="number"
                          value={platformSettings.maxDeliveryRadius}
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              maxDeliveryRadius: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-mainBlack mb-4">
                      Commission Rates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Commission (% of delivery fee)
                        </label>
                        <div className="relative">
                          <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={platformSettings.driverCommissionPercent}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                driverCommissionPercent: parseInt(e.target.value),
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Drivers receive 80% of delivery fees by default
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant Payout (% of order value)
                        </label>
                        <div className="relative">
                          <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={platformSettings.restaurantCommissionPercent}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                restaurantCommissionPercent: parseInt(e.target.value),
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                          />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Restaurants receive 85% of order value by default
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleSavePlatformSettings}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                    >
                      <FiSave size={20} />
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-mainBlack">
                      Notification Preferences
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Choose what notifications you want to receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'emailNewOrders',
                        label: 'New Order Notifications',
                        description: 'Get notified when new orders are placed',
                      },
                      {
                        key: 'emailNewApplications',
                        label: 'New Application Alerts',
                        description:
                          'Get notified when restaurants or drivers apply',
                      },
                      {
                        key: 'emailRefundRequests',
                        label: 'Refund Request Alerts',
                        description: 'Get notified when customers request refunds',
                      },
                      {
                        key: 'emailDailyReport',
                        label: 'Daily Report',
                        description: 'Receive a daily summary of platform activity',
                      },
                      {
                        key: 'emailWeeklyReport',
                        label: 'Weekly Report',
                        description: 'Receive a weekly summary with analytics',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-mainBlack">{item.label}</p>
                          <p className="text-gray-500 text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mainGreen"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                    >
                      <FiSave size={20} />
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
