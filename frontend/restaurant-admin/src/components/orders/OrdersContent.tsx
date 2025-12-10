'use client'

import { useEffect, useState, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { MdFilterList, MdCalendarToday } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { useNotifications } from "@/components/ui/Notification";
import { orderService, driverService } from "@/lib/services";
import { Order as ApiOrder, Driver as ApiDriver, OrderStatus } from "@/types";
import { Order, Driver } from "@/types/order";
import { 
    OrderCardSkeleton, 
    InProgressCardSkeleton, 
    TableSkeleton 
} from "@/components/ui/Skeleton";

import NewOrderCard from "@/components/orders/NewOrderCard";
import InProgressOrderCard from "@/components/orders/InProgressOrderCard";
import CancelledOrderCard from "@/components/orders/CancelledOrderCard";
import CompletedOrdersTable from "@/components/orders/CompletedOrdersTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import DriverSelectionModal from "@/components/orders/DriverSelectionModal";
import Pagination from "@/components/ui/Pagination";

type TabStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

interface TabCount {
    new: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
}

// Convert API order to local order format
function convertOrder(apiOrder: ApiOrder): Order {
    return {
        id: `#${apiOrder.orderNumber}`,
        customer: apiOrder.userPhone,
        customerName: apiOrder.userName,
        phone: apiOrder.userPhone,
        date: new Date(apiOrder.createdAt).toLocaleString('mn-MN'),
        total: apiOrder.total,
        status: mapStatus(apiOrder.status),
        items: apiOrder.items.map(item => ({
            name: item.foodName,
            quantity: item.quantity
        })),
        address: apiOrder.deliveryAddress,
        timeAgo: getTimeAgo(apiOrder.createdAt),
        timer: getTimer(apiOrder.createdAt)
    };
}

function mapStatus(status: OrderStatus): TabStatus {
    switch (status) {
        case 'pending': return 'new';
        case 'confirmed':
        case 'preparing':
        case 'ready':
        case 'picked_up':
        case 'delivering': return 'in-progress';
        case 'delivered': return 'completed';
        case 'cancelled': return 'cancelled';
        default: return 'new';
    }
}

function getTimeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Дөнгөж сая';
    if (minutes < 60) return `${minutes} минутын өмнө`;
    const hours = Math.floor(minutes / 60);
    return `${hours} цагийн өмнө`;
}

function getTimer(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function convertDriver(apiDriver: ApiDriver): Driver {
    return {
        id: parseInt(apiDriver.id),
        name: apiDriver.name,
        distance: "Ойролцоо",
        location: apiDriver.isOnline ? "Идэвхтэй" : "Идэвхгүй"
    };
}

export default function OrdersContent() {
    const notify = useNotifications();
    const [activeTab, setActiveTab] = useState<TabStatus>('new');
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [stats, setStats] = useState<TabCount>({
        new: 0, 'in-progress': 0, completed: 0, cancelled: 0
    });
    const [orderStats, setOrderStats] = useState({
        dailyIncome: 0,
        totalIncome: 0,
        dailyOrders: 0,
        totalOrders: 0,
    });

    const tabs = [
        { id: 'new' as TabStatus, label: 'Шинэ захиалга', count: stats.new },
        { id: 'in-progress' as TabStatus, label: 'In-Progress', count: stats['in-progress'] },
        { id: 'completed' as TabStatus, label: 'Completed', count: stats.completed },
        { id: 'cancelled' as TabStatus, label: 'Cancelled', count: stats.cancelled },
    ];

    const getApiStatus = (tab: TabStatus): OrderStatus[] => {
        switch (tab) {
            case 'new': return ['pending'];
            case 'in-progress': return ['confirmed', 'preparing', 'ready', 'picked_up', 'delivering'];
            case 'completed': return ['delivered'];
            case 'cancelled': return ['cancelled'];
        }
    };

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await orderService.getOrders({
                status: getApiStatus(activeTab),
                page: currentPage,
                limit: 12,
                search: searchQuery || undefined
            });
            
            if (response.success && response.data) {
                setOrders(response.data.items.map(convertOrder));
                setPagination({
                    total: response.data.total,
                    totalPages: response.data.totalPages
                });
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, currentPage, searchQuery]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await orderService.getOrderStats();
            if (response.success && response.data) {
                setStats({
                    new: response.data.pending,
                    'in-progress': response.data.preparing + response.data.ready + response.data.delivering,
                    completed: response.data.completed,
                    cancelled: response.data.cancelled
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    const fetchDrivers = useCallback(async () => {
        try {
            const response = await driverService.getAvailableDrivers();
            if (response.success && response.data) {
                setDrivers(response.data.map(convertDriver));
            }
        } catch (error) {
            console.error('Failed to fetch drivers:', error);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [fetchOrders, fetchStats]);

    const handleAcceptOrder = async (orderId: string) => {
        const id = orderId.replace('#', '');
        const response = await orderService.acceptOrder(id);
        if (response.success) {
            notify.success('Захиалга хүлээн авлаа', `${orderId} захиалга бэлтгэж эхэллээ`);
            fetchOrders();
            fetchStats();
        } else {
            notify.error('Алдаа гарлаа', response.error || 'Захиалга хүлээн авахад алдаа гарлаа');
        }
    };

    const handleRejectOrder = async (orderId: string) => {
        const id = orderId.replace('#', '');
        const response = await orderService.rejectOrder(id, 'Ресторан цуцалсан');
        if (response.success) {
            notify.error('Захиалга цуцлагдлаа', `${orderId} захиалга цуцлагдлаа`);
            fetchOrders();
            fetchStats();
        } else {
            notify.error('Алдаа гарлаа', response.error || 'Захиалга цуцлахад алдаа гарлаа');
        }
    };

    const handleCompleteOrder = async () => {
        await fetchDrivers();
        setIsDriverModalOpen(true);
    };

    const handleSelectDriver = async (driverId: number) => {
        if (!selectedOrder) return;
        
        const orderId = selectedOrder.id.replace('#', '');
        const response = await orderService.assignDriver(orderId, driverId.toString());
        if (response.success) {
            notify.success('Жолооч сонгогдлоо', 'Хүргэлт эхэллээ');
            setIsDriverModalOpen(false);
            fetchOrders();
            fetchStats();
        } else {
            notify.error('Алдаа гарлаа', response.error || 'Жолооч сонгоход алдаа гарлаа');
        }
    };

    const renderContent = () => {
        if (loading) {
            switch (activeTab) {
                case 'new':
                case 'cancelled':
                    return (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <OrderCardSkeleton key={i} />
                            ))}
                        </div>
                    );
                case 'in-progress':
                    return (
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <InProgressCardSkeleton key={i} />
                            ))}
                        </div>
                    );
                case 'completed':
                    return <TableSkeleton rows={8} columns={5} />;
            }
        }

        if (orders.length === 0) {
            return (
                <div className="text-center py-12 text-gray-500">
                    Захиалга олдсонгүй
                </div>
            );
        }

        switch (activeTab) {
            case 'new':
                return (
                    <div className="space-y-4">
                        {orders.map((order, i) => (
                            <NewOrderCard
                                key={i}
                                order={order}
                                onAccept={() => handleAcceptOrder(order.id)}
                                onReject={() => handleRejectOrder(order.id)}
                            />
                        ))}
                    </div>
                );
            case 'in-progress':
                return (
                    <div className="grid grid-cols-3 gap-4">
                        {orders.map((order, i) => (
                            <InProgressOrderCard
                                key={i}
                                order={order}
                                onComplete={() => {
                                    setSelectedOrder(order);
                                    handleCompleteOrder();
                                }}
                                onClick={() => setSelectedOrder(order)}
                            />
                        ))}
                    </div>
                );
            case 'completed':
                return (
                    <CompletedOrdersTable 
                        orders={orders} 
                        onViewDetails={setSelectedOrder} 
                    />
                );
            case 'cancelled':
                return (
                    <div className="space-y-4">
                        {orders.map((order, i) => (
                            <CancelledOrderCard key={i} order={order} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="max-w-[1100px]">
            <h1 className="text-2xl font-bold text-center mb-6">Захиалга удирдлагын хэсэг</h1>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-3 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-mainGreen text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Stats for Completed tab */}
            {activeTab === 'completed' && (
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Өнөөдрийн орлого</p>
                        <p className="text-2xl font-bold">{orderStats.dailyIncome.toLocaleString()}₮</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Нийт орлого</p>
                        <p className="text-2xl font-bold">{orderStats.totalIncome.toLocaleString()}₮</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Өнөөдрийн захиалгын тоо</p>
                        <p className="text-2xl font-bold text-mainGreen">{orderStats.dailyOrders}</p>
                        <p className="text-xs text-gray-500">Нийт {orderStats.totalOrders}</p>
                    </div>
                </div>
            )}

            {/* Search and filters */}
            {(activeTab === 'completed' || activeTab === 'in-progress') && (
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-[300px]">
                        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Order ID - аар хайх"
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                        />
                    </div>
                    
                    {activeTab === 'completed' && (
                        <div className="flex items-center gap-3">
                            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <MdFilterList size={18} />
                            </button>
                            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <MdCalendarToday size={18} />
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-mainGreen text-white rounded-xl text-sm font-medium hover:bg-green-600">
                                <FaDownload size={14} />
                                Export as CSV
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {renderContent()}

            {/* Pagination */}
            {!loading && orders.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={setCurrentPage}
                        showingResults={orders.length}
                        totalResults={pagination.total}
                    />
                </div>
            )}

            {/* Modals */}
            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
            <DriverSelectionModal 
                isOpen={isDriverModalOpen} 
                onClose={() => setIsDriverModalOpen(false)} 
                onSelect={handleSelectDriver}
                drivers={drivers}
            />
        </div>
    );
}
