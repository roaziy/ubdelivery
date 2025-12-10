'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoCamera, IoCall, IoMail, IoStar, IoLogOut, IoChevronForward } from 'react-icons/io5';
import { useNotifications } from '@/components/ui/Notification';
import { authService, profileService } from '@/lib/services';
import { transformDriver } from '@/lib/transformers';
import { Driver } from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const notify = useNotifications();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('driver_token');
        if (!token) {
            router.push('/');
            return;
        }
        fetchProfile();
    }, [router]);

    const getDefaultDriverFromStorage = (): Driver | null => {
        const driverInfo = sessionStorage.getItem('driver_info');
        if (driverInfo) {
            try {
                const userInfo = JSON.parse(driverInfo);
                // Try multiple possible name fields
                const name = userInfo.name || userInfo.full_name || userInfo.fullName || '';
                return {
                    id: userInfo.id || '',
                    name: name,
                    phone: userInfo.phone || '',
                    email: userInfo.email || null,
                    avatar: null,
                    vehicleType: 'motorcycle',
                    vehiclePlate: '',
                    isOnline: false,
                    isApproved: false,
                    currentLat: null,
                    currentLng: null,
                    rating: 0,
                    totalDeliveries: 0,
                    createdAt: new Date().toISOString(),
                };
            } catch (e) {
                console.error('Failed to parse driver info:', e);
            }
        }
        return null;
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await authService.getProfile();
            if (response.success && response.data) {
                const transformed = transformDriver(response.data);
                setDriver(transformed);
                setEditedName(transformed.name);
            } else {
                // If API fails, try to get user info from sessionStorage
                const defaultDriver = getDefaultDriverFromStorage();
                if (defaultDriver) {
                    setDriver(defaultDriver);
                    setEditedName(defaultDriver.name);
                } else {
                    notify.error('Алдаа', response.error || 'Профайл авахад алдаа гарлаа');
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Try to get user info from sessionStorage as fallback
            const defaultDriver = getDefaultDriverFromStorage();
            if (defaultDriver) {
                setDriver(defaultDriver);
                setEditedName(defaultDriver.name);
            } else {
                notify.error('Алдаа', 'Профайл авахад алдаа гарлаа');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        sessionStorage.removeItem('driver_token');
        sessionStorage.removeItem('driver_info');
        sessionStorage.removeItem('driver_data');
        notify.info('Гарлаа', 'Амжилттай гарлаа');
        setTimeout(() => router.push('/'), 500);
    };

    const handleSaveProfile = async () => {
        if (!driver) return;
        
        try {
            const response = await profileService.updateProfile({ fullName: editedName });
            if (response.success && response.data) {
                const transformed = transformDriver(response.data);
                setDriver(transformed);
                setIsEditing(false);
                notify.success('Амжилттай', 'Профайл хадгалагдлаа');
            } else {
                notify.error('Алдаа', response.error || 'Профайл шинэчлэхэд алдаа гарлаа');
            }
        } catch (error) {
            notify.error('Алдаа', 'Профайл шинэчлэхэд алдаа гарлаа');
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !driver) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            notify.error('Алдаа', 'Зөвхөн зураг оруулна уу');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notify.error('Алдаа', 'Файлын хэмжээ 5MB-аас хэтрэхгүй байх ёстой');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await profileService.uploadAvatar(formData);
            if (response.success && response.data) {
                setDriver({ ...driver, avatar: response.data.url });
                notify.success('Амжилттай', 'Зураг шинэчлэгдлээ');
                fetchProfile(); // Refresh profile
            } else {
                notify.error('Алдаа', response.error || 'Зураг хадгалахад алдаа гарлаа');
            }
        } catch (error) {
            notify.error('Алдаа', 'Зураг хадгалахад алдаа гарлаа');
        }
    };

    const getVehicleLabel = (type: string) => {
        switch (type) {
            case 'motorcycle': return 'Мотоцикл';
            case 'car': return 'Машин';
            case 'bike': return 'Дугуй';
            default: return type;
        }
    };

    if (loading) {
        return (
            <DriverLayout>
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-gray-400">Уншиж байна...</p>
                </div>
            </DriverLayout>
        );
    }

    if (!driver) {
        return (
            <DriverLayout>
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-gray-400">Профайл олдсонгүй</p>
                </div>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout>
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 mb-4 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        {driver.avatar ? (
                            <img src={driver.avatar} alt={driver.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-gray-400">
                                {(driver.name || driver.phone || 'Х').charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-mainGreen rounded-full flex items-center justify-center text-white hover:bg-green-600"
                    >
                        <IoCamera size={16} />
                    </button>
                </div>

                {/* Name */}
                {isEditing ? (
                    <div className="mb-2">
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="text-center text-xl font-bold border-b-2 border-mainGreen outline-none py-1"
                        />
                    </div>
                ) : (
                    <h2 className="text-xl font-bold mb-1">{driver.name || 'Хэрэглэгч'}</h2>
                )}
                
                <p className="text-gray-500 text-sm">{driver.phone}</p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-2">
                    <IoStar className="text-yellow-400" size={18} />
                    <span className="font-medium">{driver.rating}</span>
                    <span className="text-gray-400 text-sm">({driver.totalDeliveries} хүргэлт)</span>
                </div>

                {/* Edit/Save Button */}
                {isEditing ? (
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-2 border border-gray-200 rounded-full text-sm font-medium"
                        >
                            Болих
                        </button>
                        <button 
                            onClick={handleSaveProfile}
                            className="flex-1 py-2 bg-mainGreen text-white rounded-full text-sm font-medium"
                        >
                            Хадгалах
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-6 py-2 border border-mainGreen text-mainGreen rounded-full text-sm font-medium hover:bg-green-50"
                    >
                        Засах
                    </button>
                )}
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-2xl p-4 mb-4">
                <h3 className="font-semibold mb-3">Тээврийн хэрэгсэл</h3>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Image src="/logos/logo.svg" alt="Vehicle" width={28} height={28} />
                    </div>
                    <div>
                        <p className="font-medium">{getVehicleLabel(driver.vehicleType)}</p>
                        <p className="text-sm text-gray-500">{driver.vehiclePlate}</p>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl mb-4">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <IoCall className="text-gray-400" size={20} />
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Утас</p>
                        <p className="font-medium">{driver.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4">
                    <IoMail className="text-gray-400" size={20} />
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">И-мэйл</p>
                        <p className="font-medium">{driver.email || 'Оруулаагүй'}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-2xl mb-4">
                {[
                    { label: 'Дансны мэдээлэл', path: '/bank-account' },
                    { label: 'Нууцлалын бодлого', path: '/privacy' },
                    { label: 'Үйлчилгээний нөхцөл', path: '/terms' },
                    { label: 'Тусламж', path: '/help' },
                ].map((item, index, arr) => (
                    <button
                        key={item.label}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${
                            index < arr.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <span>{item.label}</span>
                        <IoChevronForward className="text-gray-400" size={18} />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-2xl font-medium hover:bg-red-100"
            >
                <IoLogOut size={20} />
                Гарах
            </button>

            {/* Version */}
            <p className="text-center text-xs text-gray-400 mt-4">
                Go Delivery v1.0.0
            </p>
        </DriverLayout>
    );
}
