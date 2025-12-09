'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import OrderGroup, { Order } from "./OrderGroup";
import EmptyOrders from "./EmptyOrders";

// Sample orders data
const sampleOrders: Order[] = [
    {
        id: 1,
        orderId: "UB25Z11091007",
        restaurantName: "Modern Nomads",
        status: 'delivering',
        items: [
            { id: 1, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
            { id: 2, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    },
    {
        id: 2,
        orderId: "UB25Z11091007",
        restaurantName: "Pizzahut",
        status: 'pending',
        items: [
            { id: 3, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    }
];

interface OrdersSectionProps {
    onViewTracking: (orderId: number) => void;
}

export default function OrdersSection({ onViewTracking }: OrdersSectionProps) {
    const router = useRouter();
    const [orders] = useState<Order[]>(sampleOrders);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const isEmpty = orders.length === 0;

    const handleViewDetails = (orderId: number) => {
        onViewTracking(orderId);
    };

    // const goToHistory = () => {
    //     router.push('/home/orders');
    // };

    if (isEmpty) {
        return <EmptyOrders />;
    }

    return (
        <div>
            {/* History Button */}
            {/* <div className="relative justify-end mb-4">
                <button 
                    onClick={goToHistory}
                    className="absolute top-0 right-0 flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-mainGreen transition-colors"
                >
                    <FaRegClock size={14} />
                    Түүх
                </button>
            </div> */}

            {/* Orders List */}
            {paginatedOrders.map((order) => (
                <OrderGroup
                    key={order.id}
                    order={order}
                    onViewDetails={() => handleViewDetails(order.id)}
                    onRate={() => console.log('Rate order', order.id)}
                    onCancel={() => console.log('Cancel order', order.id)}
                    onRefund={() => console.log('Refund order', order.id)}
                />
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
