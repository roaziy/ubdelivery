'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import Link from "next/link";

// Mock data - in real app, this would come from API
const mockStats = {
    dailyIncome: 1569000,
    dailyIncomeChange: 5.2,
    totalOrders: 152,
    totalOrdersChange: 8.1,
    monthlyIncome: 128569000,
    monthlyIncomeChange: -1.3,
};

const mockRecentOrders = [
    { id: "#1024", customer: "95049990", customerName: null, date: "2025-10-31, 10:25:32", total: 35000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: "А.Гэрэл", date: "2025-10-31, 10:25:32", total: 70000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: null, date: "2025-10-31, 10:25:32", total: 35000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: "А.Гэрэл", date: "2025-10-31, 10:25:32", total: 70000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: null, date: "2025-10-31, 10:25:32", total: 35000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: "А.Гэрэл", date: "2025-10-31, 10:25:32", total: 70000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: null, date: "2025-10-31, 10:25:32", total: 35000, status: "Амжилттай" },
    { id: "#1024", customer: "95049990", customerName: "А.Гэрэл", date: "2025-10-31, 10:25:32", total: 70000, status: "Амжилттай" },
];

const mockBestSellingFoods = [
    { id: 1, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
    { id: 2, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
    { id: 3, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
    { id: 4, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
    { id: 5, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
    { id: 6, name: "Хүн аймар гоё пизза, Хүн аймар гоё пизза", price: 35000, orders: 54, image: null },
];

function StatCard({ title, value, change, isCurrency = true }: { 
    title: string; 
    value: number; 
    change: number;
    isCurrency?: boolean;
}) {
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

export default function DashboardPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if admin is logged in
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
            return;
        }
        
        // Check if setup is completed
        const setupCompleted = sessionStorage.getItem('setupCompleted');
        if (!setupCompleted) {
            router.push('/setup');
            return;
        }
        
        setIsLoggedIn(true);
    }, [router]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <DashboardLayout>
            <div className="max-w-[1100px]">
                <h1 className="text-2xl font-bold text-mainBlack mb-6">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Өнөөдрийн орлого" 
                        value={mockStats.dailyIncome} 
                        change={mockStats.dailyIncomeChange} 
                    />
                    <StatCard 
                        title="Нийт захиалга" 
                        value={mockStats.totalOrders} 
                        change={mockStats.totalOrdersChange}
                        isCurrency={false}
                    />
                    <StatCard 
                        title="Сарын орлого" 
                        value={mockStats.monthlyIncome} 
                        change={mockStats.monthlyIncomeChange} 
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
                                {mockRecentOrders.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                                        <td className="py-3 px-4 text-sm">{order.id}</td>
                                        <td className="py-3 px-4 text-sm">
                                            {order.customerName 
                                                ? `${order.customer} - ${order.customerName}` 
                                                : order.customer
                                            }
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="py-3 px-4 text-sm">{order.total.toLocaleString()}₮</td>
                                        <td className="py-3 px-4">
                                            <span className="text-mainGreen text-sm">{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Best Selling Foods Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-mainBlack">Хамгийн сайн зарагдсан хоол</h2>
                        <Link 
                            href="/menu" 
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            Меnu засах
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {mockBestSellingFoods.map((food) => (
                            <div key={food.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Food Image */}
                                <div className="h-32 bg-gray-300"></div>
                                
                                {/* Food Info */}
                                <div className="p-4">
                                    <p className="text-sm font-medium text-mainBlack line-clamp-2 mb-2">
                                        {food.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ₮{food.price.toLocaleString()} • {food.orders} захиалга
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
