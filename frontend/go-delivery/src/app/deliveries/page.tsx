'use client'

import { useState } from 'react';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoLocationSharp, IoCall, IoNavigate, IoCheckmarkCircle } from 'react-icons/io5';
import { MdRestaurant } from 'react-icons/md';
import { mockAvailableOrders, formatCurrency, formatTimeAgo } from '@/lib/mockData';
import { DeliveryOrder } from '@/types';
import { useNotifications } from '@/components/ui/Notification';

type DeliveryTab = 'available' | 'active';

export default function DeliveriesPage() {
    const notify = useNotifications();
    const [activeTab, setActiveTab] = useState<DeliveryTab>('available');
    const [availableOrders] = useState(mockAvailableOrders);
    const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(null);
    const [deliveryStep, setDeliveryStep] = useState<'pickup' | 'delivering'>('pickup');

    const handleAcceptOrder = (order: DeliveryOrder) => {
        setActiveDelivery(order);
        setActiveTab('active');
        setDeliveryStep('pickup');
        notify.success('Захиалга хүлээн авлаа', `${order.restaurantName} руу очно уу`);
    };

    const handleDeclineOrder = (orderId: string) => {
        notify.info('Татгалзлаа', 'Захиалга татгалзлаа');
        // TODO: API call
    };

    const handlePickedUp = () => {
        setDeliveryStep('delivering');
        notify.success('Хоол авлаа', 'Хэрэглэгч рүү хүргэнэ үү');
        // TODO: API call
    };

    const handleDelivered = () => {
        notify.success('Хүргэлт дууслаа', 'Орлого: ₮' + formatCurrency(activeDelivery?.deliveryFee || 0));
        setActiveDelivery(null);
        setActiveTab('available');
        // TODO: API call
    };

    return (
        <DriverLayout>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('available')}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'available'
                            ? 'bg-mainGreen text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Боломжит ({availableOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'active'
                            ? 'bg-mainGreen text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Идэвхтэй {activeDelivery ? '(1)' : '(0)'}
                </button>
            </div>

            {/* Available Orders */}
            {activeTab === 'available' && (
                <div className="space-y-4">
                    {availableOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-semibold">{order.orderNumber}</p>
                                    <p className="text-xs text-gray-400">{formatTimeAgo(order.createdAt)}</p>
                                </div>
                                <span className="text-lg font-bold text-mainGreen">
                                    +{formatCurrency(order.deliveryFee)}
                                </span>
                            </div>

                            {/* Pickup */}
                            <div className="flex items-start gap-2 mb-2">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                    <MdRestaurant className="text-orange-500" size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Авах газар</p>
                                    <p className="text-sm font-medium">{order.restaurantName}</p>
                                    <p className="text-xs text-gray-500">{order.restaurantAddress}</p>
                                </div>
                            </div>

                            {/* Vertical Line */}
                            <div className="ml-3 w-0.5 h-4 bg-gray-200"></div>

                            {/* Delivery */}
                            <div className="flex items-start gap-2 mb-4">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <IoLocationSharp className="text-mainGreen" size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Хүргэх газар</p>
                                    <p className="text-sm font-medium">{order.customerName || order.customerPhone}</p>
                                    <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Захиалгын дүн</span>
                                    <span className="font-medium">{formatCurrency(order.total)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => console.log('Decline order:', order.id)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50"
                                >
                                    Татгалзах
                                </button>
                                <button 
                                    onClick={() => handleAcceptOrder(order)}
                                    className="flex-1 py-2.5 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600"
                                >
                                    Хүлээн авах
                                </button>
                            </div>
                        </div>
                    ))}

                    {availableOrders.length === 0 && (
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <p className="text-gray-400">Одоогоор хүргэлт байхгүй</p>
                        </div>
                    )}
                </div>
            )}

            {/* Active Delivery */}
            {activeTab === 'active' && activeDelivery && (
                <div className="space-y-4">
                    {/* Progress Steps */}
                    <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    deliveryStep === 'pickup' ? 'bg-mainGreen' : 'bg-mainGreen'
                                }`}>
                                    <IoCheckmarkCircle className="text-white" size={20} />
                                </div>
                                <div className={`h-1 w-16 rounded ${
                                    deliveryStep === 'delivering' ? 'bg-mainGreen' : 'bg-gray-200'
                                }`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    deliveryStep === 'delivering' ? 'bg-mainGreen' : 'bg-gray-200'
                                }`}>
                                    {deliveryStep === 'delivering' ? (
                                        <IoCheckmarkCircle className="text-white" size={20} />
                                    ) : (
                                        <span className="text-gray-400 text-sm">2</span>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm font-medium text-mainGreen">
                                {deliveryStep === 'pickup' ? 'Авах' : 'Хүргэж байна'}
                            </span>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-lg">{activeDelivery.orderNumber}</p>
                                <p className="text-sm text-gray-500">{activeDelivery.restaurantName}</p>
                            </div>
                            <span className="text-lg font-bold text-mainGreen">
                                +{formatCurrency(activeDelivery.deliveryFee)}
                            </span>
                        </div>

                        {/* Current Destination */}
                        <div className={`border-2 rounded-xl p-4 mb-4 ${
                            deliveryStep === 'pickup' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'
                        }`}>
                            <div className="flex items-start gap-3">
                                {deliveryStep === 'pickup' ? (
                                    <MdRestaurant className="text-orange-500 mt-1" size={20} />
                                ) : (
                                    <IoLocationSharp className="text-mainGreen mt-1" size={20} />
                                )}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">
                                        {deliveryStep === 'pickup' ? 'Хоол авах газар' : 'Хүргэх хаяг'}
                                    </p>
                                    <p className="font-medium">
                                        {deliveryStep === 'pickup' 
                                            ? activeDelivery.restaurantName 
                                            : activeDelivery.customerName || activeDelivery.customerPhone
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {deliveryStep === 'pickup' 
                                            ? activeDelivery.restaurantAddress 
                                            : activeDelivery.deliveryAddress
                                        }
                                    </p>
                                    {deliveryStep === 'delivering' && activeDelivery.deliveryNotes && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Тэмдэглэл: {activeDelivery.deliveryNotes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact & Navigate */}
                        <div className="flex gap-2 mb-4">
                            <a 
                                href={`tel:${deliveryStep === 'pickup' ? activeDelivery.restaurantPhone : activeDelivery.customerPhone}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50"
                            >
                                <IoCall size={16} />
                                Залгах
                            </a>
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${deliveryStep === 'pickup' ? activeDelivery.restaurantLat : activeDelivery.deliveryLat},${deliveryStep === 'pickup' ? activeDelivery.restaurantLng : activeDelivery.deliveryLng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-mainGreen text-mainGreen rounded-full text-sm font-medium hover:bg-green-50"
                            >
                                <IoNavigate size={16} />
                                Замчлах
                            </a>
                        </div>

                        {/* Items */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                            <p className="text-xs text-gray-500 mb-2">Захиалга</p>
                            {activeDelivery.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.foodName}</span>
                                    {item.notes && <span className="text-gray-400 text-xs">{item.notes}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        {deliveryStep === 'pickup' ? (
                            <button 
                                onClick={handlePickedUp}
                                className="w-full py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600"
                            >
                                Хоол авсан
                            </button>
                        ) : (
                            <button 
                                onClick={handleDelivered}
                                className="w-full py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600"
                            >
                                Хүргэлт дууссан
                            </button>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'active' && !activeDelivery && (
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-gray-400">Идэвхтэй хүргэлт байхгүй</p>
                </div>
            )}
        </DriverLayout>
    );
}
