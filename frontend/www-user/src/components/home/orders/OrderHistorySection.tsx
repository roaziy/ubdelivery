'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import OrderItemCard, { OrderItem } from "@/components/home/cart/OrderItemCard";

interface HistoryOrder {
    id: number;
    orderId: string;
    restaurantName: string;
    status: 'delivered' | 'cancelled';
    items: OrderItem[];
}

// Sample history data
const sampleHistoryOrders: HistoryOrder[] = [
    {
        id: 1,
        orderId: "UB25Z11091007",
        restaurantName: "Modern Nomads",
        status: 'delivered',
        items: [
            { id: 1, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
            { id: 2, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    },
    {
        id: 2,
        orderId: "UB25Z11091007",
        restaurantName: "Pizzahut",
        status: 'cancelled',
        items: [
            { id: 3, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    }
];

export default function OrderHistorySection() {
    const router = useRouter();
    const [orders] = useState<HistoryOrder[]>(sampleHistoryOrders);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBack = () => {
        router.push('/home/cart');
    };

    const handleViewDetails = (orderId: number) => {
        // Navigate to order tracking with history context
        router.push(`/home/orders/${orderId}`);
    };

    const getActionButtons = (order: HistoryOrder) => {
        if (order.status === 'cancelled') {
            return (
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 py-3 border border-red-400 text-red-500 rounded-[13px] font-medium">
                        Цуцлагдсан
                    </button>
                    <button className="flex-1 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors">
                        Үнэлгээ
                    </button>
                </div>
            );
        }
        
        return (
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={() => handleViewDetails(order.id)}
                    className="flex-1 py-3 bg-[#D8D9D7] text-gray-700 rounded-[13px] font-medium hover:bg-[#C0C1BF] transition-colors"
                >
                    Дэлгэрэнгүй
                </button>
                <button className="flex-1 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors">
                    Үнэлгээ
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:mt-8 mb-20 md:mb-8 min-h-[650px]">
            {/* Header */}
            <div className="relative flex justify-center items-center mb-6">
                <button 
                    onClick={handleBack}
                    className="absolute left-0 flex items-center gap-1 bg-[#8C8C8C] text-white px-3 py-3 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                    <IoChevronBack size={18} />
                </button>
                <h1 className="text-xl font-semibold">Захиалгын түүх</h1>
            </div>

            {/* Orders List */}
            {paginatedOrders.map((order) => (
                <div key={order.id} className="mb-6">
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
                    {getActionButtons(order)}
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-50"
                    >
                        <IoChevronBack size={16} />
                        Previous
                    </button>
                    
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-full text-sm ${
                                currentPage === page 
                                    ? 'text-mainGreen font-semibold' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    {totalPages > 3 && <span className="text-gray-400">...</span>}
                    
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-50"
                    >
                        Next
                        <IoChevronForward size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
