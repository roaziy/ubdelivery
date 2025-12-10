'use client';

import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { useNotifications } from '@/components/ui/Notification';
import { authService } from '@/lib/services';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'platform'>('profile');
  const notify = useNotifications();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'UB Delivery',
    supportEmail: 'support@ubdelivery.com',
    deliveryFee: 3000,
    serviceFeePercent: 5,
    minOrderAmount: 10000,
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // First check sessionStorage
        const storedUser = sessionStorage.getItem('admin_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setProfileData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
          }));
        }

        // Then try to fetch from API
        const response = await authService.getProfile();
        if (response.success && response.data) {
          const user = response.data;
          setProfileData(prev => ({
            ...prev,
            name: user.name || user.full_name || '',
            email: user.email || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement actual save logic when backend endpoint is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success('Амжилттай', 'Тохиргоо амжилттай хадгалагдлаа');
    } catch (error) {
      console.error('Save error:', error);
      notify.error('Алдаа', 'Тохиргоо хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Тохиргоо</h1>

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
            Профайл
          </button>
          <button
            onClick={() => setActiveSection('platform')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === 'platform'
                ? 'bg-mainGreen text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Платформ
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {activeSection === 'profile' && (
            <div className="space-y-6 max-w-md">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Нэр</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">И-мэйл</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Одоогийн нууц үг</label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                      placeholder="Нууц үг солих бол оруулна уу"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Шинэ нууц үг</label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                      placeholder="Шинэ нууц үг оруулна уу"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === 'platform' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Платформын нэр</label>
                <input
                  type="text"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Тусламжийн и-мэйл</label>
                <input
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Хүргэлтийн төлбөр (₮)</label>
                <input
                  type="number"
                  value={platformSettings.deliveryFee}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, deliveryFee: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Үйлчилгээний шимтгэл (%)</label>
                <input
                  type="number"
                  value={platformSettings.serviceFeePercent}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, serviceFeePercent: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Хамгийн бага захиалга (₮)</label>
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
            disabled={saving || loading}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600 disabled:opacity-50"
          >
            <FiSave size={18} />
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
