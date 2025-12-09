'use client'

import { useState } from 'react';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoCheckmarkCircle, IoCloseCircle, IoTime } from 'react-icons/io5';
import { mockDeliveryHistory, formatCurrency, formatTimeAgo } from '@/lib/mockData';

export default function HistoryPage() {
    const [history] = useState(mockDeliveryHistory);
    const [filter, setFilter] = useState<'all' | 'delivered' | 'cancelled'>('all');

    const filteredHistory = history.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return (
                    <span className="flex items-center gap-1 text-mainGreen text-xs">
                        <IoCheckmarkCircle size={14} />
                        Дууссан
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="flex items-center gap-1 text-red-500 text-xs">
                        <IoCloseCircle size={14} />
                        Цуцлагдсан
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <DriverLayout>
            <h1 className="text-xl font-bold mb-4">Хүргэлтийн түүх</h1>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'Бүгд' },
                    { id: 'delivered', label: 'Дууссан' },
                    { id: 'cancelled', label: 'Цуцлагдсан' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id as typeof filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            filter === item.id
                                ? 'bg-mainGreen text-white'
                                : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* History List */}
            <div className="space-y-3">
                {filteredHistory.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="font-semibold">{order.orderNumber}</p>
                                <p className="text-sm text-gray-500">{order.restaurantName}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-mainGreen">+{formatCurrency(order.deliveryFee)}</p>
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <IoTime size={12} />
                                {formatTimeAgo(order.createdAt)}
                            </span>
                            <span>→ {order.deliveryAddress}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHistory.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-gray-400">Түүх байхгүй</p>
                </div>
            )}

            {/* Summary */}
            <div className="mt-6 bg-gray-800 text-white rounded-2xl p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm">Нийт хүргэлт</p>
                        <p className="text-2xl font-bold">{history.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm">Нийт орлого</p>
                        <p className="text-2xl font-bold text-mainGreen">
                            {formatCurrency(history.reduce((sum, o) => sum + o.deliveryFee, 0))}
                        </p>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
