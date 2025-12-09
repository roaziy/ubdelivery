'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoLocationSharp, IoCall, IoNavigate } from 'react-icons/io5';
import { MdDeliveryDining, MdRestaurant } from 'react-icons/md';
import { mockDriver, mockDriverStats, mockAvailableOrders, formatCurrency } from '@/lib/mockData';

export default function DriverDashboard() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(mockDriver.isOnline);
    const [stats] = useState(mockDriverStats);
    const [availableOrders] = useState(mockAvailableOrders);

    useEffect(() => {
        const token = sessionStorage.getItem('driver_token');
        if (!token) {
            router.push('/');
        }
    }, [router]);

    const handleToggleOnline = () => {
        setIsOnline(!isOnline);
        // TODO: API call to update online status
    };

    return (
        <DriverLayout>
            {/* Status Toggle */}
            <div className="bg-white rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Таны статус</p>
                        <p className={`text-lg font-bold ${isOnline ? 'text-mainGreen' : 'text-gray-400'}`}>
                            {isOnline ? 'Идэвхтэй' : 'Идэвхгүй'}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleOnline}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                            isOnline ? 'bg-mainGreen' : 'bg-gray-300'
                        }`}
                    >
                        <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${
                            isOnline ? 'left-7' : 'left-1'
                        }`}></span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MdDeliveryDining className="text-mainGreen" size={20} />
                        <span className="text-sm text-gray-500">Өнөөдөр</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.todayDeliveries}</p>
                    <p className="text-xs text-gray-400">хүргэлт</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-mainGreen text-lg">₮</span>
                        <span className="text-sm text-gray-500">Өнөөдөр</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
                    <p className="text-xs text-gray-400">орлого</p>
                </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-2xl p-5 mb-6">
                <h3 className="font-semibold mb-4">Гүйцэтгэл</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-mainGreen">{stats.rating}</p>
                        <p className="text-xs text-gray-500">Үнэлгээ</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-500">{stats.completionRate}%</p>
                        <p className="text-xs text-gray-500">Биелэлт</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-orange-500">{stats.averageDeliveryTime}</p>
                        <p className="text-xs text-gray-500">Дунд.мин</p>
                    </div>
                </div>
            </div>

            {/* Available Orders */}
            {isOnline && availableOrders.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-3">Боломжит хүргэлтүүд</h3>
                    <div className="space-y-3">
                        {availableOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{order.restaurantName}</p>
                                    </div>
                                    <span className="text-lg font-bold text-mainGreen">
                                        {formatCurrency(order.deliveryFee)}
                                    </span>
                                </div>

                                {/* Pickup */}
                                <div className="flex items-start gap-2 mb-2">
                                    <MdRestaurant className="text-orange-500 mt-0.5" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-400">Авах</p>
                                        <p className="text-sm">{order.restaurantAddress}</p>
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="flex items-start gap-2 mb-4">
                                    <IoLocationSharp className="text-mainGreen mt-0.5" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-400">Хүргэх</p>
                                        <p className="text-sm">{order.deliveryAddress}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Захиалга:</p>
                                    {order.items.map(item => (
                                        <p key={item.id} className="text-sm">
                                            {item.quantity}x {item.foodName}
                                        </p>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
                                        Татгалзах
                                    </button>
                                    <button 
                                        onClick={() => router.push(`/deliveries/${order.id}`)}
                                        className="flex-1 py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600"
                                    >
                                        Хүлээн авах
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Offline Message */}
            {!isOnline && (
                <div className="bg-gray-100 rounded-2xl p-8 text-center">
                    <MdDeliveryDining className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500">Идэвхжүүлснээр хүргэлт хүлээн авах боломжтой</p>
                </div>
            )}
        </DriverLayout>
    );
}
