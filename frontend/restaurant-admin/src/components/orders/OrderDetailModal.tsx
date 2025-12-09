'use client'

import { Order } from "@/types/order";
import { IoChevronBack } from "react-icons/io5";
import { MdCheckCircle } from "react-icons/md";

interface OrderDetailModalProps {
    order: Order | null;
    onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
    if (!order) return null;

    const progressSteps = [
        { label: "Захиалга баталгаажлаа", desc: "Үйлчлэгчийн захиалга баталгаажсан", time: "2025/10/31 - 13:03", completed: true },
        { label: "Таны захиалга бэлэн боллоо", desc: "Pizzahut захиалгыг хийж дууссан, хүргэлтэнд бэлэн...", time: "2025/10/31 - 13:13", completed: true },
        { label: "Хүргэлтэнд гарсан", desc: "Хүргэлтийн ажилтан захиалгыг хүлээн авсан, хүргэлтэнд гарсан", time: "2025/10/31 - 13:23", completed: true },
        { label: "Захиалга хүргэгдлээ!", desc: "Хүргэлтийн ажилтан захиалгыг амжилттай хүргэлээ", time: "2025/10/31 - 13:33", completed: order.status === 'completed' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Back button */}
                    <button 
                        onClick={onClose} 
                        className="flex items-center gap-2 text-sm bg-[#8c8c8c] text-white px-3 py-1 rounded-full mb-4 hover:bg-gray-700 transition-colors"
                    >
                        <IoChevronBack size={14} />
                        Буцах
                    </button>

                    <h2 className="text-xl font-bold mb-4">Захиалгын мэдээлэл</h2>

                    {/* Customer info */}
                    <div className="mb-4">
                        <p className="font-semibold">Хэрэглэгчийн нэр: {order.phone}</p>
                        <p className="text-sm text-gray-500">Order ID: U3252T031007 - {order.date}</p>
                    </div>

                    {/* Order total */}
                    <div className="mb-4">
                        <p className="font-semibold">Захиалгын нийт дүн: {order.total.toLocaleString()}₮</p>
                        {order.items.map((item, i) => (
                            <p key={i} className="text-sm text-gray-600">{item.quantity} x {item.name}</p>
                        ))}
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <p className="font-semibold">Захиалгыг хүргэсэн хаяг:</p>
                        <p className="text-sm text-gray-600">{order.address}</p>
                    </div>

                    {/* Driver */}
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Хүргэлт хийсэн ажилтан:</p>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-sm">Одхүү Батцэцэг</p>
                                    <p className="text-xs text-mainGreen">Хүргэлтийн ажилтан</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-mainGreen text-white text-sm rounded-full hover:bg-green-600 transition-colors">
                                Холбоо барих
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <p className="font-semibold mb-2">Захиалгын үйл явц: <span className="text-mainGreen">100%</span></p>
                        <div className="space-y-0">
                            {progressSteps.map((step, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-mainGreen' : 'bg-gray-200'}`}>
                                            <MdCheckCircle className="text-white" size={20} />
                                        </div>
                                        {i < progressSteps.length - 1 && (
                                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-mainGreen' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-sm">{step.label}</p>
                                                <p className="text-xs text-gray-500">{step.desc}</p>
                                            </div>
                                            <p className="text-xs text-gray-400">{step.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
