'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoCamera, IoCall, IoMail, IoStar, IoLogOut, IoChevronForward } from 'react-icons/io5';
import { mockDriver } from '@/lib/mockData';

export default function ProfilePage() {
    const router = useRouter();
    const [driver, setDriver] = useState(mockDriver);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(driver.name);

    const handleLogout = () => {
        sessionStorage.removeItem('driver_token');
        sessionStorage.removeItem('driver_info');
        router.push('/');
    };

    const handleSaveProfile = () => {
        setDriver({ ...driver, name: editedName });
        setIsEditing(false);
        // TODO: API call to update profile
    };

    const getVehicleLabel = (type: string) => {
        switch (type) {
            case 'motorcycle': return 'Мотоцикл';
            case 'car': return 'Машин';
            case 'bike': return 'Дугуй';
            default: return type;
        }
    };

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
                                {driver.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-mainGreen rounded-full flex items-center justify-center text-white">
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
                    <h2 className="text-xl font-bold mb-1">{driver.name}</h2>
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
                    { label: 'Дансны мэдээлэл', path: '/profile/bank' },
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
