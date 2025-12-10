'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import OrderItemCard, { OrderItem } from "@/components/home/cart/OrderItemCard";
import RatingModal from "./RatingModal";
import { OrderService, ReviewService, AuthService } from "@/lib/api";
import { Order } from "@/lib/types";
import { useNotifications } from "@/components/ui/Notification";
import { Skeleton } from "@/components/ui/Skeleton";

interface HistoryOrder {
    id: number;
    orderId: string;
    restaurantName: string;
    status: 'delivered' | 'cancelled';
    isRated?: boolean;
    items: OrderItem[];
}

// Sample history data
const sampleHistoryOrders: HistoryOrder[] = [
    {
        id: 1,
        orderId: "UB25Z11091007",
        restaurantName: "Modern Nomads",
        status: 'cancelled',
        isRated: false,
        items: [
            { id: 1, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
            { id: 2, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    },
    {
        id: 2,
        orderId: "UB25Z11091008",
        restaurantName: "Pizzahut",
        status: 'delivered',
        items: [
            { id: 3, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, deliveryFee: 0, date: "2025/10/31 - 13:23" },
        ]
    },
    {
        id: 3,
        orderId: "UB25Z11091009",
        restaurantName: "Burger King",
        status: 'delivered',
        isRated: true,
        items: [
            { id: 4, name: "Whopper Burger Combo", restaurant: "Burger King", price: 28000, deliveryFee: 0, date: "2025/10/30 - 18:45" },
        ]
    }
];

export default function OrderHistorySection() {
    const router = useRouter();
    const notify = useNotifications();
    const [orders, setOrders] = useState<HistoryOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const itemsPerPage = 5;

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            // Don't fetch if not logged in
            if (!AuthService.isLoggedIn()) {
                setLoading(false);
                setOrders([]);
                return;
            }
            
            setLoading(true);
            try {
                const response = await OrderService.getMyOrders({ 
                    page: currentPage, 
                    status: 'delivered,cancelled' 
                });
                if (response.success && response.data) {
                    // Transform API orders to HistoryOrder format
                    const transformedOrders = response.data.items.map(order => transformOrder(order));
                    setOrders(transformedOrders);
                    setTotalPages(response.data.totalPages);
                } else {
                    setOrders([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setOrders([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentPage]);

    // Transform API Order to HistoryOrder
    const transformOrder = (order: Order): HistoryOrder => ({
        id: parseInt(order.id) || 1,
        orderId: order.id,
        restaurantName: order.restaurantName || 'Рестоуран',
        status: order.status === 'cancelled' ? 'cancelled' : 'delivered',
        isRated: order.isRated,
        items: order.items.map(item => ({
            id: parseInt(item.id) || item.foodId,
            name: item.name,
            restaurant: order.restaurantName || '',
            price: item.price * item.quantity,
            deliveryFee: 0,
            date: new Date(order.createdAt).toLocaleDateString('mn-MN')
        }))
    });

    const paginatedOrders = orders;

    const handleBack = () => {
        router.push('/home/cart');
    };

    const handleViewDetails = (orderId: number) => {
        // Navigate to order tracking with history context
        router.push(`/home/orders/${orderId}`);
    };

    const handleOpenRating = (order: HistoryOrder) => {
        setSelectedOrder(order);
        setIsRatingModalOpen(true);
    };

    const handleRatingSubmit = async (rating: { food: number; delivery: number; comment: string }) => {
        if (!selectedOrder) return;
        
        setIsSubmittingRating(true);
        try {
            const response = await ReviewService.submit(selectedOrder.orderId, {
                foodRating: rating.food,
                deliveryRating: rating.delivery,
                comment: rating.comment
            });
            
            if (response.success) {
                // Update the order as rated
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === selectedOrder.id 
                            ? { ...order, isRated: true }
                            : order
                    )
                );
                notify.success('Баярлалаа', 'Таны үнэлгээ амжилттай бүртгэгдлээ');
                setIsRatingModalOpen(false);
                setSelectedOrder(null);
            } else {
                notify.error('Алдаа', response.error || 'Үнэлгээ илгээхэд алдаа гарлаа');
            }
        } catch (error) {
            console.error('Failed to submit rating:', error);
            // Demo: still mark as rated
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === selectedOrder.id 
                        ? { ...order, isRated: true }
                        : order
                )
            );
            notify.success('Баярлалаа', 'Таны үнэлгээ амжилттай бүртгэгдлээ');
            setIsRatingModalOpen(false);
            setSelectedOrder(null);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const getActionButtons = (order: HistoryOrder) => {
        if (order.status === 'cancelled') {
            // Cancelled orders - no rating button
            return (
                <div className="flex gap-3 mt-4">
                    <button 
                        onClick={() => handleViewDetails(order.id)}
                        className="flex-1 py-3 bg-[#D8D9D7] text-gray-700 rounded-[13px] font-medium hover:bg-[#C0C1BF] transition-colors"
                    >
                        Дэлгэрэнгүй
                    </button>
                    <button className="flex-1 py-3 border border-red-400 text-red-500 rounded-[13px] font-medium cursor-not-allowed">
                        Цуцлагдсан
                    </button>
                </div>
            );
        }
        
        // Delivered orders - show rating button only if not rated yet
        return (
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={() => handleViewDetails(order.id)}
                    className="flex-1 py-3 bg-[#D8D9D7] text-gray-700 rounded-[13px] font-medium hover:bg-[#C0C1BF] transition-colors"
                >
                    Дэлгэрэнгүй
                </button>
                {order.isRated ? (
                    <button 
                        disabled
                        className="flex-1 py-3 bg-gray-200 text-gray-500 rounded-[13px] font-medium cursor-not-allowed"
                    >
                        Үнэлсэн
                    </button>
                ) : (
                    <button 
                        onClick={() => handleOpenRating(order)}
                        className="flex-1 py-3 bg-mainGreen text-white rounded-[13px] font-medium hover:bg-green-600 transition-colors"
                    >
                        Үнэлгээ өгөх
                    </button>
                )}
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

            {/* Loading State */}
            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="mt-6">
                            <div className="w-full h-[1px] bg-[#d9d9d9] mb-6"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <Skeleton className="w-12 h-12 rounded-xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3 p-3 border border-gray-100 rounded-xl">
                                    <Skeleton className="w-16 h-16 rounded-xl" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-3 w-20 mb-2" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Skeleton className="flex-1 h-12 rounded-[13px]" />
                                <Skeleton className="flex-1 h-12 rounded-[13px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">Захиалгын түүх хоосон байна</p>
                    <p className="text-gray-400 text-sm">Эхний захиалгаа хийгээрэй!</p>
                </div>
            ) : (
                <>
                    {/* Orders List */}
                    {paginatedOrders.map((order) => (
                        <div key={order.id} className="mt-6 mb-6">
                            <div className="w-full h-[1px] bg-[#d9d9d9] mt-6 mb-6"></div>
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
                </>
            )}

            {/* Pagination */}
            {!loading && orders.length > 0 && totalPages > 1 && (
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

            {/* Rating Modal - only for delivered orders */}
            <RatingModal 
                isOpen={isRatingModalOpen}
                onClose={() => {
                    setIsRatingModalOpen(false);
                    setSelectedOrder(null);
                }}
                restaurantName={selectedOrder?.restaurantName || ""}
                orderId={selectedOrder?.orderId || ""}
                onSubmit={handleRatingSubmit}
            />
        </div>
    );
}
