'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import OrderGroup, { Order } from "./OrderGroup";
import EmptyOrders from "./EmptyOrders";
import { OrderService } from "@/lib/api";
import { mockOrders, simulateDelay } from "@/lib/mockData";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/components/ui/Notification";

// Sample orders data as fallback
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
    const notify = useNotifications();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await OrderService.getActive();
                if (response.success && response.data) {
                    // Transform API orders to local Order format
                    const transformedOrders: Order[] = response.data.map(order => ({
                        id: parseInt(order.id),
                        orderId: order.id,
                        restaurantName: order.restaurantName || 'Рестоуран',
                        status: order.status as Order['status'],
                        items: order.items.map(item => ({
                            id: parseInt(item.id) || item.foodId,
                            name: item.name,
                            restaurant: order.restaurantName || '',
                            price: item.price * item.quantity,
                            deliveryFee: 0,
                            date: order.createdAt
                        }))
                    }));
                    setOrders(transformedOrders);
                } else {
                    await simulateDelay(800);
                    setOrders(sampleOrders);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                await simulateDelay(800);
                setOrders(sampleOrders);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const isEmpty = orders.length === 0;

    const handleViewDetails = (orderId: number) => {
        onViewTracking(orderId);
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            const response = await OrderService.cancel(orderId.toString());
            if (response.success) {
                notify.success('Амжилттай', 'Захиалга цуцлагдлаа');
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                notify.error('Алдаа', response.error || 'Захиалга цуцлахад алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <div>
                                    <Skeleton className="h-4 w-28 mb-1" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            {[...Array(2)].map((_, j) => (
                                <div key={j} className="flex justify-between">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

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
                    onRate={() => notify.info('Үнэлгээ', 'Үнэлгээ өгөх боломжтой болно')}
                    onCancel={() => handleCancelOrder(order.id)}
                    onRefund={() => notify.info('Буцаалт', 'Буцаалтын хүсэлт илгээгдлээ')}
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
