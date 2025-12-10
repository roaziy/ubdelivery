'use client'

import { useEffect, useState, useCallback } from "react";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { dashboardService } from "@/lib/services";
import { DashboardStats, BestSellingFood, Order } from "@/types";
import { 
    StatCardSkeleton, 
    TableSkeleton, 
    BestSellingCardSkeleton 
} from "@/components/ui/Skeleton";

interface StatCardProps {
    title: string;
    value: number;
    change: number;
    isCurrency?: boolean;
    loading?: boolean;
}

function StatCard({ title, value, change, isCurrency = true, loading }: StatCardProps) {
    if (loading) return <StatCardSkeleton />;
    
    const isPositive = change >= 0;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{title}</p>
            <p className="text-3xl font-bold text-mainBlack">
                {isCurrency ? `${value.toLocaleString()}₮` : value.toLocaleString()}
            </p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-mainGreen' : 'text-red-500'}`}>
                {isPositive ? <IoTrendingUp size={16} /> : <IoTrendingDown size={16} />}
                <span>{isPositive ? '+' : ''}{change}%</span>
            </div>
        </div>
    );
}

interface RecentOrdersTableProps {
    orders: Order[];
    loading: boolean;
}

function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
    if (loading) return <TableSkeleton rows={8} columns={5} />;

    // Ensure orders is always an array
    const ordersArray = Array.isArray(orders) ? orders : [];

    if (ordersArray.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-500">Захиалга олдсонгүй</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#8c8c8c] text-white text-sm">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Үйлчлүүлэгч</th>
                        <th className="text-left py-3 px-4 font-medium">Хугацаа</th>
                        <th className="text-left py-3 px-4 font-medium">Нийт дүн</th>
                        <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersArray.map((order, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-3 px-4 text-sm">#{order.orderNumber}</td>
                            <td className="py-3 px-4 text-sm">
                                {order.userName 
                                    ? `${order.userPhone} - ${order.userName}` 
                                    : order.userPhone
                                }
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString('mn-MN')}
                            </td>
                            <td className="py-3 px-4 text-sm">{order.total.toLocaleString()}₮</td>
                            <td className="py-3 px-4">
                                <OrderStatusBadge status={order.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function OrderStatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        delivered: 'text-mainGreen',
        pending: 'text-orange-500',
        preparing: 'text-blue-500',
        cancelled: 'text-red-500',
    };
    const labels: Record<string, string> = {
        delivered: 'Амжилттай',
        pending: 'Хүлээгдэж байна',
        preparing: 'Бэлтгэж байна',
        cancelled: 'Цуцлагдсан',
    };
    return (
        <span className={`text-sm ${colors[status] || 'text-gray-500'}`}>
            {labels[status] || status}
        </span>
    );
}

interface BestSellingGridProps {
    foods: BestSellingFood[];
    loading: boolean;
}

function BestSellingGrid({ foods, loading }: BestSellingGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <BestSellingCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {foods.map((food) => (
                <div key={food.foodId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gray-300 relative">
                        {food.foodImage && (
                            <Image 
                                src={food.foodImage} 
                                alt={food.foodName}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="p-4">
                        <p className="text-sm font-medium text-mainBlack line-clamp-2 mb-2">
                            {food.foodName}
                        </p>
                        <p className="text-sm text-gray-500">
                            ₮{food.revenue.toLocaleString()} • {food.totalOrders} захиалга
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DashboardContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [bestSelling, setBestSelling] = useState<BestSellingFood[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, bestSellingRes, ordersRes] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getBestSelling(6),
                dashboardService.getRecentOrders(8)
            ]);

            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }
            if (bestSellingRes.success && bestSellingRes.data) {
                setBestSelling(bestSellingRes.data);
            }
            if (ordersRes.success && ordersRes.data) {
                // Ensure data is an array
                const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                setRecentOrders(ordersData);
            } else {
                setRecentOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="max-w-[1100px]">
            <h1 className="text-2xl font-bold text-mainBlack mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Өнөөдрийн орлого" 
                    value={stats?.todayRevenue || 0} 
                    change={stats?.revenueTrend || 0}
                    loading={loading}
                />
                <StatCard 
                    title="Нийт захиалга" 
                    value={stats?.totalOrders || 0} 
                    change={stats?.ordersTrend || 0}
                    isCurrency={false}
                    loading={loading}
                />
                <StatCard 
                    title="Өнөөдрийн захиалга" 
                    value={stats?.todayOrders || 0} 
                    change={stats?.ordersTrend || 0}
                    isCurrency={false}
                    loading={loading}
                />
            </div>

            {/* Recent Orders Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-mainBlack">Сүүлийн захиалгууд</h2>
                    <Link 
                        href="/orders" 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                        Бүх захиалгыг харах
                    </Link>
                </div>
                <RecentOrdersTable orders={recentOrders} loading={loading} />
            </div>

            {/* Best Selling Foods Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-mainBlack">Хамгийн сайн зарагдсан хоол</h2>
                    <Link 
                        href="/menu" 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                        Меню засах
                    </Link>
                </div>
                <BestSellingGrid foods={bestSelling} loading={loading} />
            </div>
        </div>
    );
}
