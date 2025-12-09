'use client'

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { IoSearch } from "react-icons/io5";
import { MdFilterList, MdCalendarToday } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

// Types
import { Order, OrderStatus, Driver } from "@/types/order";

// Components
import NewOrderCard from "@/components/orders/NewOrderCard";
import InProgressOrderCard from "@/components/orders/InProgressOrderCard";
import CancelledOrderCard from "@/components/orders/CancelledOrderCard";
import CompletedOrdersTable from "@/components/orders/CompletedOrdersTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import DriverSelectionModal from "@/components/orders/DriverSelectionModal";
import Pagination from "@/components/ui/Pagination";

const tabs = [
    { id: 'new', label: 'Шинэ захиалга', count: 2 },
    { id: 'in-progress', label: 'In-Progress', count: 4 },
    { id: 'completed', label: 'Completed', count: 8 },
    { id: 'cancelled', label: 'Cancelled', count: 0 },
];

// Mock data
const mockOrders: Order[] = [
    {
        id: "#1024",
        customer: "95049990",
        customerName: "Алтангэрэл Гэрэл",
        phone: "95049990",
        date: "2025-10-31, 10:25:32",
        total: 145000,
        status: "new",
        items: [{ name: "Махан дурлагсад", quantity: 1 }, { name: "BBQ пизза", quantity: 2 }],
        address: "БЗД, 67р хороо, МХТС, Здавхар 302 тоот",
        timeAgo: "2 минутын өмнө"
    },
    {
        id: "#3078",
        customer: "95049990",
        customerName: "Батаа Батцэцэг",
        phone: "95049990",
        date: "2025-10-31, 10:25:32",
        total: 432184000,
        status: "new",
        items: [{ name: "Махан дурлагсад", quantity: 100 }, { name: "BBQ пизза", quantity: 2000 }, { name: "Coca Cola", quantity: 90000 }],
        address: "БЗД, 67р хороо, МХТС, Здавхар 302 тоот",
        timeAgo: "5 минутын өмнө"
    },
    // In-progress orders
    ...Array(9).fill(null).map((_, i) => ({
        id: "#1024",
        customer: "95049990",
        customerName: null,
        phone: "95049990",
        date: "2025-10-31, 10:25:32",
        total: 145000,
        status: "in-progress" as OrderStatus,
        items: [{ name: "Махан дурлагсад", quantity: 1 }, { name: "BBQ пизза", quantity: 2 }],
        address: "БЗД, 67р хороо, МХТС, Здавхар 302 тоот",
        timer: ["02:31", "10:22", "39:08"][i % 3]
    })),
    // Completed orders
    ...Array(8).fill(null).map((_, i) => ({
        id: "#1024",
        customer: "95049990",
        customerName: i % 2 === 0 ? "А.Гэрэл" : null,
        phone: "95049990",
        date: "2025-10-31, 10:25:32",
        total: i % 2 === 0 ? 70000 : 35000,
        status: "completed" as OrderStatus,
        items: [{ name: "Махан дурлагсад", quantity: 1 }, { name: "BBQ пизза", quantity: 2 }],
        address: "БЗД, 67р хороо, МХТС, Здавхар 302 тоот"
    })),
    // Cancelled orders
    ...Array(4).fill(null).map((_, i) => ({
        id: "#1024",
        customer: "95049990",
        customerName: "Алтангэрэл Гэрэл",
        phone: "95049990",
        date: "2025-10-31, 10:25:32",
        total: 145000,
        status: "cancelled" as OrderStatus,
        items: [{ name: "Махан дурлагсад", quantity: 1 }, { name: "BBQ пизза", quantity: 2 }],
        address: "БЗД, 67р хороо, МХТС, Здавхар 302 тоот",
        timeAgo: "2 минутын өмнө"
    })),
];

const mockDrivers: Driver[] = [
    { id: 1, name: "Одхүү Батцэцэг", distance: "2.5 км зайтай байна", location: "СБД-ийн Central tower" },
    { id: 2, name: "Одхүү Батцэцэг", distance: "1.22 км зайтай байна", location: "СБД-ийн Их дэлгүүр" },
    { id: 3, name: "Одхүү Батцэцэг", distance: "0.249 км зайтай байна", location: "СБД-ийн Blue sky tower" },
];

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<OrderStatus>('new');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredOrders = mockOrders.filter(order => order.status === activeTab);

    const stats = {
        dailyIncome: 1569000,
        totalIncome: 185569000,
        dailyOrders: 280,
        totalOrders: 1054,
    };

    const handleAcceptOrder = (orderId: string) => {
        console.log("Accept order:", orderId);
        // TODO: API call to accept order
    };

    const handleRejectOrder = (orderId: string) => {
        console.log("Reject order:", orderId);
        // TODO: API call to reject order
    };

    const handleCompleteOrder = (orderId: string) => {
        console.log("Complete order:", orderId);
        setIsDriverModalOpen(true);
    };

    const handleSelectDriver = (driverId: number) => {
        console.log("Selected driver:", driverId);
        setIsDriverModalOpen(false);
        // TODO: API call to assign driver
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1100px]">
                <h1 className="text-2xl font-bold text-center mb-6">Захиалга удирдлагын хэсэг</h1>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as OrderStatus)}
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
                            <p className="text-2xl font-bold">{stats.dailyIncome.toLocaleString()}₮</p>
                            <p className="text-xs text-mainGreen">+5.2%</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Нийт орлого</p>
                            <p className="text-2xl font-bold">{stats.totalIncome.toLocaleString()}₮</p>
                            <p className="text-xs text-mainGreen">+5.2%</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Өнөөдрийн захиалгын тоо</p>
                            <p className="text-2xl font-bold text-mainGreen">{stats.dailyOrders}</p>
                            <p className="text-xs text-gray-500">Нийт {stats.totalOrders}</p>
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

                {/* Content based on active tab */}
                {activeTab === 'new' && (
                    <div className="space-y-4">
                        {filteredOrders.map((order, i) => (
                            <NewOrderCard
                                key={i}
                                order={order}
                                onAccept={() => handleAcceptOrder(order.id)}
                                onReject={() => handleRejectOrder(order.id)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'in-progress' && (
                    <div className="grid grid-cols-3 gap-4">
                        {filteredOrders.map((order, i) => (
                            <InProgressOrderCard
                                key={i}
                                order={order}
                                onComplete={() => handleCompleteOrder(order.id)}
                                onClick={() => setSelectedOrder(order)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'completed' && (
                    <>
                        <CompletedOrdersTable 
                            orders={filteredOrders} 
                            onViewDetails={setSelectedOrder} 
                        />
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={189}
                                onPageChange={setCurrentPage}
                                showingResults={8}
                                totalResults={1508}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'cancelled' && (
                    <div className="space-y-4">
                        {filteredOrders.map((order, i) => (
                            <CancelledOrderCard key={i} order={order} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
            <DriverSelectionModal 
                isOpen={isDriverModalOpen} 
                onClose={() => setIsDriverModalOpen(false)} 
                onSelect={handleSelectDriver}
                drivers={mockDrivers}
            />
        </DashboardLayout>
    );
}
