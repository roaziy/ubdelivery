'use client'

import OrderItemCard, { OrderItem } from "./OrderItemCard";

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
    id: number;
    orderId: string;
    restaurantName: string;
    status: OrderStatus;
    items: OrderItem[];
}

interface OrderGroupProps {
    order: Order;
    onViewDetails: () => void;
    onRate?: () => void;
    onCancel?: () => void;
    onRefund?: () => void;
}

export default function OrderGroup({ order, onViewDetails, onRate, onCancel, onRefund }: OrderGroupProps) {
    const getActionButtons = () => {
        switch (order.status) {
            case 'pending':
            case 'preparing':
            case 'ready':
                return (
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={onViewDetails}
                            className="flex-1 py-3 bg-[#D8D9D7] text-gray-700 rounded-[13px] font-medium hover:bg-[#C0C1BF] transition-colors"
                        >
                            Дэлгэрэнгүй
                        </button>
                        <button 
                            onClick={onRate}
                            className="flex-1 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors"
                        >
                            Үнэлгээ
                        </button>
                    </div>
                );
            case 'delivering':
                return (
                    <div className="flex gap-3 mt-4">
                        <button 
                            className="flex-1 py-3 bg-[#D8D9D7] text-gray-700 rounded-[13px] font-medium"
                        >
                            Хүргэгдсэн
                        </button>
                        <button 
                            onClick={onRate}
                            className="flex-1 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors"
                        >
                            Үнэлгээ
                        </button>
                    </div>
                );
            case 'delivered':
                return (
                    <button 
                        onClick={onViewDetails}
                        className="w-full mt-4 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors"
                    >
                        Захиалга хянах
                    </button>
                );
            case 'cancelled':
                return (
                    <div className="flex gap-3 mt-4">
                        <button 
                            className="flex-1 py-3 border border-red-400 text-red-500 rounded-[13px] font-medium"
                        >
                            Цуцлагдсан
                        </button>
                        <button 
                            onClick={onRefund}
                            className="flex-1 py-3 bg-[#8C8C8C] text-white rounded-[13px] font-medium hover:bg-gray-600 transition-colors"
                        >
                            Мөнгөө авах
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mb-6">
            {/* Restaurant Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div>
                    <h3 className="font-semibold">{order.restaurantName}</h3>
                    <p className="text-xs text-gray-500">Order ID: {order.orderId}</p>
                </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
                {order.items.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                ))}
            </div>

            {/* Action Buttons */}
            {getActionButtons()}
        </div>
    );
}
