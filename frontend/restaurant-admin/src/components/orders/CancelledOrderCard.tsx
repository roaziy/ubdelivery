'use client'

import { Order } from "@/types/order";

interface CancelledOrderCardProps {
    order: Order;
}

export default function CancelledOrderCard({ order }: CancelledOrderCardProps) {
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
                        <span className="font-medium">{item.quantity} x</span> {item.name}
                    </p>
                ))}
            </div>

            <p className="font-semibold">Нийт: {order.total.toLocaleString()}₮</p>
        </div>
    );
}
