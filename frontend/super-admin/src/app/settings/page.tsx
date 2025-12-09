'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'platform'>('profile');
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@ubdelivery.com',
    currentPassword: '',
    newPassword: '',
  });

  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'UB Delivery',
    supportEmail: 'support@ubdelivery.com',
    deliveryFee: 2.99,
    serviceFeePercent: 5,
    minOrderAmount: 10,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === 'profile'
                ? 'bg-mainGreen text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection('platform')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === 'platform'
                ? 'bg-mainGreen text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Platform
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {activeSection === 'profile' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                  placeholder="Enter to change password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          )}

          {activeSection === 'platform' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Platform Name</label>
                <input
                  type="text"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Support Email</label>
                <input
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Fee ($)</label>
                <input
                  type="number"
                  value={platformSettings.deliveryFee}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, deliveryFee: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Service Fee (%)</label>
                <input
                  type="number"
                  value={platformSettings.serviceFeePercent}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, serviceFeePercent: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Order ($)</label>
                <input
                  type="number"
                  value={platformSettings.minOrderAmount}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, minOrderAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600 disabled:opacity-50"
          >
            <FiSave size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
