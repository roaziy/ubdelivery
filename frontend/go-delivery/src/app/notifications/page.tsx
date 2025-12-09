'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoChevronBack, IoCheckmark } from 'react-icons/io5';
import { useNotifications } from '@/components/ui/Notification';
import { mockNotifications, formatTimeAgo } from '@/lib/mockData';

export default function NotificationsPage() {
    const router = useRouter();
    const notify = useNotifications();
    const [notifications, setNotifications] = useState(mockNotifications);

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        notify.success('Уншсан', 'Бүх мэдэгдэл уншсан болгогдлоо');
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'new_order':
                return '🛵';
            case 'payment':
                return '💰';
            case 'system':
                return '📢';
            default:
                return '📬';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-backgroundGreen">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-[600px] mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <IoChevronBack size={22} />
                        </button>
                        <div className="flex items-center gap-2">
                            <Image src="/logos/logo.svg" alt="UB Delivery" width={28} height={28} />
                            <h1 className="font-bold text-lg">Мэдэгдэл</h1>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <IoCheckmark size={22} className="text-mainGreen" />
                        </button>
                    )}
                </div>
            </header>

            {/* Notifications List */}
            <div className="max-w-[600px] mx-auto px-4 py-4">
                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div 
                                key={notification.id}
                                className={`bg-white rounded-xl p-4 ${
                                    !notification.isRead ? 'border-l-4 border-mainGreen' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-medium">{notification.title}</p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-gray-400">Мэдэгдэл байхгүй</p>
                    </div>
                )}
            </div>
        </div>
    );
}
