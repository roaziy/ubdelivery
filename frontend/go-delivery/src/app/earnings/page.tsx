'use client'

import { useState } from 'react';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoWallet, IoTrendingUp, IoCalendar, IoCheckmarkCircle, IoTime, IoArrowForward } from 'react-icons/io5';
import { mockEarningsSummary, mockDailyEarnings, mockPayoutHistory, formatCurrency } from '@/lib/mockData';

type EarningsTab = 'summary' | 'daily' | 'payouts';

export default function EarningsPage() {
    const [activeTab, setActiveTab] = useState<EarningsTab>('summary');
    const [summary] = useState(mockEarningsSummary);
    const [dailyEarnings] = useState(mockDailyEarnings);
    const [payoutHistory] = useState(mockPayoutHistory);

    const tabs = [
        { id: 'summary', label: 'Нийт', icon: IoWallet },
        { id: 'daily', label: 'Өдөр бүр', icon: IoCalendar },
        { id: 'payouts', label: 'Шилжүүлэг', icon: IoArrowForward },
    ];

    const getPayoutStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Дууссан</span>;
            case 'pending':
                return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Хүлээгдэж байна</span>;
            case 'processing':
                return <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Боловсруулж байна</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
    };

    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'];
        return days[date.getDay()];
    };

    return (
        <DriverLayout>
            <h1 className="text-xl font-bold mb-4">Орлого</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as EarningsTab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-mainGreen text-white'
                                    : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
                <div className="space-y-4">
                    {/* Main Balance */}
                    <div className="bg-gradient-to-r from-mainGreen to-green-400 rounded-2xl p-6 text-white">
                        <p className="text-green-100 text-sm mb-1">Энэ сарын орлого</p>
                        <p className="text-3xl font-bold">{formatCurrency(summary.thisMonth)}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Өнөөдөр</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.today)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Энэ долоо хоног</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.thisWeek)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Нийт хүргэлт</p>
                            <p className="text-xl font-bold">{summary.totalDeliveries}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Дундаж/хүргэлт</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.averagePerDelivery)}</p>
                        </div>
                    </div>

                    {/* Pending Payout */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Татаж авах боломжтой</p>
                                <p className="text-2xl font-bold text-mainGreen">{formatCurrency(summary.pendingPayout)}</p>
                            </div>
                            <button 
                                onClick={() => alert('Шилжүүлэг хүсэлт илгээгдлээ!')}
                                className="px-4 py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600"
                            >
                                Шилжүүлэх
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Daily Tab */}
            {activeTab === 'daily' && (
                <div className="space-y-3">
                    {dailyEarnings.map((day, index) => (
                        <div key={day.date} className="bg-white rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        index === 0 ? 'bg-mainGreen text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <span className="text-xs font-medium">{getDayName(day.date)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{formatDate(day.date)}</p>
                                        <p className="text-xs text-gray-400">{day.deliveries} хүргэлт</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold">{formatCurrency(day.total)}</p>
                            </div>

                            {/* Breakdown */}
                            <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Орлого: {formatCurrency(day.earnings)}</span>
                                {day.tips > 0 && <span className="text-blue-500">Tip: {formatCurrency(day.tips)}</span>}
                                {day.bonuses > 0 && <span className="text-orange-500">Бонус: {formatCurrency(day.bonuses)}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
                <div className="space-y-4">
                    {/* Bank Info */}
                    <div className="bg-white rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-2">Холбогдсон данс</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Хаан банк</p>
                                <p className="text-sm text-gray-400">****5678</p>
                            </div>
                            <button 
                                onClick={() => alert('Дансны мэдээлэл өөрчлөх')}
                                className="text-mainGreen text-sm font-medium hover:underline"
                            >
                                Өөрчлөх
                            </button>
                        </div>
                    </div>

                    {/* Payout History */}
                    <h3 className="font-semibold">Шилжүүлгийн түүх</h3>
                    <div className="space-y-3">
                        {payoutHistory.map(payout => (
                            <div key={payout.id} className="bg-white rounded-xl p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-bold">{formatCurrency(payout.amount)}</p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(payout.requestedAt)}
                                        </p>
                                    </div>
                                    {getPayoutStatusBadge(payout.status)}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {payout.bankName} • {payout.accountNumber}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DriverLayout>
    );
}
