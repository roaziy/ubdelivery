'use client'

import { Order } from "@/types/order";

interface CompletedOrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
}

export default function CompletedOrdersTable({ orders, onViewDetails }: CompletedOrdersTableProps) {
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
                    {orders.map((order, index) => (
                        <tr 
                            key={index} 
                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                            onClick={() => onViewDetails(order)}
                        >
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
                                <span className="text-mainGreen text-sm">Амжилттай</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
