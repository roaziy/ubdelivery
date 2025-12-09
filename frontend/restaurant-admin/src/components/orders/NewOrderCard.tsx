'use client'

import { Order } from "@/types/order";

interface NewOrderCardProps {
    order: Order;
    onAccept: () => void;
    onReject: () => void;
}

export default function NewOrderCard({ order, onAccept, onReject }: NewOrderCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between mb-2">
                <div>
                    <p className="font-semibold">Order ID: {order.id} – {order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.timeAgo}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">Хаяг:</p>
                    <p className="text-sm text-gray-500">{order.address}</p>
                </div>
            </div>

            <div className="my-3">
                {order.items.map((item, i) => (
                    <p key={i} className="text-sm">
                        <span className="text-mainGreen font-medium">{item.quantity} x</span> {item.name}
                    </p>
                ))}
            </div>

            <p className="font-semibold mb-4">Нийт: {order.total.toLocaleString()}₮</p>

            <div className="flex gap-3">
                <button 
                    onClick={onReject}
                    className="flex-1 py-2 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
                >
                    Цуцлах
                </button>
                <button 
                    onClick={onAccept}
                    className="flex-1 py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                    Хүлээн авах
                </button>
            </div>
        </div>
    );
}
