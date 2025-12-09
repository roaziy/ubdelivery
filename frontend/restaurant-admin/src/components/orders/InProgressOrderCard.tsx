'use client'

import { Order } from "@/types/order";
import { IoTime } from "react-icons/io5";

interface InProgressOrderCardProps {
    order: Order;
    onComplete: () => void;
    onClick: () => void;
}

export default function InProgressOrderCard({ order, onComplete, onClick }: InProgressOrderCardProps) {
    const getTimerColor = (timer: string) => {
        const minutes = parseInt(timer.split(':')[0]);
        if (minutes < 5) return 'text-mainGreen';
        if (minutes < 20) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <div 
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow" 
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-3">
                <p className="font-semibold text-sm">{order.id} – {order.customer}</p>
                <div className={`flex items-center gap-1 ${getTimerColor(order.timer || '00:00')}`}>
                    <IoTime size={14} />
                    <span className="text-sm font-medium">{order.timer}</span>
                </div>
            </div>

            <div className="mb-3">
                {order.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-sm">
                        <span className="font-medium">{item.quantity} x</span> {item.name}
                    </p>
                ))}
            </div>

            <p className="text-xs text-gray-500 mb-3">{order.address}</p>

            <button 
                onClick={(e) => { e.stopPropagation(); onComplete(); }}
                className="w-full py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
                Хоол хийж дууссан
            </button>
        </div>
    );
}
