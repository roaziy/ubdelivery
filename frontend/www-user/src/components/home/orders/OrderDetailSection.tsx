'use client'

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoChevronBack, IoClose, IoMail } from "react-icons/io5";
import { FaCheck, FaPhone } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { IoMdRestaurant } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import RatingModal from "./RatingModal";

type TrackingStatus = 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

interface TrackingStep {
    id: string;
    status: TrackingStatus;
    title: string;
    description: string;
    date: string;
    isCompleted: boolean;
    isActive: boolean;
    isCancelled?: boolean;
}

// Sample tracking data - in real app would fetch based on orderId
const getOrderData = (orderId: string) => {
    // Cancelled order example
    if (orderId === '1') {
        return {
            orderId: "UB25Z11091007",
            restaurantName: "Modern Nomads",
            deliveryAddress: "ХУД, 3-р хороо, Хос даль аппартмент",
            progress: 0,
            canRefund: true,
            steps: [
                { id: '1', status: 'cancelled' as TrackingStatus, title: 'Таны захиалга цуцлагдлаа!', description: 'Pizzahut яг одоогоор таны захиалгыг хийх боломжгүй тул захиалга цуцлагдлаа.', date: '2025/10/31 - 13:03', isCompleted: false, isActive: false, isCancelled: true },
                { id: '2', status: 'preparing' as TrackingStatus, title: 'Захиалга хийгдэж байна', description: '', date: '2025/10/31', isCompleted: false, isActive: false, isCancelled: false },
                { id: '3', status: 'ready' as TrackingStatus, title: 'Таны захиалга бэлэн боллоо', description: '', date: '2025/10/31', isCompleted: false, isActive: false, isCancelled: false },
                { id: '4', status: 'picked_up' as TrackingStatus, title: 'Хүргэлтэнд гарсан', description: '', date: '2025/10/31', isCompleted: false, isActive: false, isCancelled: false },
                { id: '5', status: 'delivered' as TrackingStatus, title: 'Захиалга хүргэгдлээ!', description: '', date: '2025/10/31', isCompleted: false, isActive: false, isCancelled: false },
            ]
        };
    }
    
    // Delivered order example
    return {
        orderId: "UB25Z11091007",
        restaurantName: "Modern Nomads",
        deliveryAddress: "ХУД, 3-р хороо, Хос даль аппартмент",
        driverName: "Одхүү Батцэцэг",
        driverRole: "Хүргэлтийн ажилтан",
        driverPhone: "9911-2233",
        driverEmail: "driver@ubdelivery.xyz",
        progress: 100,
        steps: [
            { id: '1', status: 'confirmed' as TrackingStatus, title: 'Таны захиалга баталгаажлаа', description: 'Таны захиалга баталгаажсан', date: '2025/10/31 - 13:03', isCompleted: true, isActive: false, isCancelled: false },
            { id: '2', status: 'preparing' as TrackingStatus, title: 'Захиалга хийгдэж байна', description: 'Pizzahut таны захиалгыг хүлээн авсан, хийж байна...', date: '2025/10/31 - 13:08', isCompleted: true, isActive: false, isCancelled: false },
            { id: '3', status: 'ready' as TrackingStatus, title: 'Таны захиалга бэлэн боллоо', description: 'Pizzahut таны захиалгыг хүргэлтийн ажилтанд өгөхөд бэлэн болсон', date: '2025/10/31 - 13:13', isCompleted: true, isActive: false, isCancelled: false },
            { id: '4', status: 'picked_up' as TrackingStatus, title: 'Хүргэлтэнд гарсан', description: 'Хүргэлтийн ажилтан таны захиалгыг хүлээн авсан', date: '2025/10/31 - 13:08', isCompleted: true, isActive: false, isCancelled: false },
            { id: '5', status: 'delivered' as TrackingStatus, title: 'Захиалга хүргэгдлээ!', description: 'Хүргэлтийн ажилтан таны захиалгыг амжилттай хүргэлээ', date: '2025/10/31 - 13:23', isCompleted: true, isActive: true, isCancelled: false },
        ]
    };
};

export default function OrderDetailSection() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    
    const orderData = getOrderData(orderId);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isRated, setIsRated] = useState(false);

    // Check if order is delivered (progress 100% and not cancelled)
    const isDelivered = orderData.progress === 100 && !orderData.canRefund;

    const handleBack = () => {
        router.push('/home/orders');
    };

    const handleRatingSubmit = (rating: { food: number; delivery: number; comment: string }) => {
        console.log('Rating submitted:', rating);
        setIsRated(true);
    };

    const getStepIcon = (step: TrackingStep) => {
        if (step.isCancelled) {
            return (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-lg font-bold">✕</span>
                </div>
            );
        }
        
        if (step.isCompleted || step.isActive) {
            return (
                <div className="w-10 h-10 bg-mainGreen rounded-full flex items-center justify-center">
                    <FaCheck className="text-white" size={16} />
                </div>
            );
        }
        
        return (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FaRegClock className="text-gray-400" size={18} />
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
                <h1 className="text-xl font-semibold">Таны захиалга</h1>
            </div>

            {/* Restaurant Info */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
                    <div>
                        <h3 className="font-semibold">{orderData.restaurantName}</h3>
                        <p className="text-xs text-gray-500">Order ID: {orderData.orderId}</p>
                    </div>
                </div>
                {orderData.canRefund && (
                    <button className="px-4 py-2 bg-[#8C8C8C] text-white text-sm rounded-full hover:bg-gray-600 transition-colors">
                        Мөнгөө авах
                    </button>
                )}
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">Захиалгыг хүргэх хаяг:</p>
                <p className="font-medium">{orderData.deliveryAddress}</p>
            </div>

            {/* Driver Info */}
            {orderData.driverName && (
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Хүргэлт хийсэн ажилтан:</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <p className="font-medium">{orderData.driverName}</p>
                                <p className="text-xs text-mainGreen">{orderData.driverRole}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsContactModalOpen(true)}
                            className="px-4 py-2 bg-mainGreen text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                        >
                            Холбоо барих
                        </button>
                    </div>
                </div>
            )}

            {/* Driver Contact Modal */}
            {isContactModalOpen && orderData.driverName && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
                    onClick={() => setIsContactModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsContactModalOpen(false)}
                        >
                            <IoClose size={24} />
                        </button>
                        
                        <h2 className="text-xl font-bold mb-2 text-center">Холбоо барих</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">Хүргэлтийн ажилтан</p>
                        
                        {/* Driver Avatar and Name */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                            <p className="font-semibold">{orderData.driverName}</p>
                            <p className="text-xs text-mainGreen">{orderData.driverRole}</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                    <FaPhone className="text-mainGreen" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Утасны дугаар</p>
                                    <a 
                                        href={`tel:${orderData.driverPhone}`} 
                                        className="font-medium text-sm md:text-lg hover:text-mainGreen transition-colors"
                                    >
                                        {orderData.driverPhone || "9911-2233"}
                                    </a>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                    <IoMail className="text-mainGreen" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Имэйл хаяг</p>
                                    <a 
                                        href={`mailto:${orderData.driverEmail || 'driver@ubdelivery.xyz'}`} 
                                        className="font-medium text-sm md:text-lg hover:text-mainGreen transition-colors"
                                    >
                                        {orderData.driverEmail || 'driver@ubdelivery.xyz'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress - only show if not cancelled */}
            {!orderData.canRefund && (
                <div className="mb-6">
                    <span className="text-sm text-gray-600">Захиалгын үйл явц:</span>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-0">
                {orderData.steps.map((step, index) => (
                    <div 
                        key={step.id}
                        className={`flex gap-4 ${step.isActive ? 'bg-mainGreen/5 -mx-4 px-4 py-3 rounded-xl' : 'py-3'} ${step.isCancelled ? 'bg-red-50 -mx-4 px-4 py-3 rounded-xl' : ''}`}
                    >
                        <div className="flex flex-col items-center">
                            {getStepIcon(step)}
                            {index < orderData.steps.length - 1 && (
                                <div className={`w-0.5 h-8 mt-2 ${step.isCompleted ? 'bg-mainGreen' : 'bg-gray-200'}`}></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className={`font-medium ${step.isCancelled ? 'text-red-500' : step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.title}
                                    </h4>
                                    {step.description && (
                                        <p className={`text-xs ${step.isCancelled ? 'text-red-400' : step.isCompleted || step.isActive ? 'text-mainGreen' : 'text-gray-400'}`}>
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs ${step.isCompleted || step.isActive || step.isCancelled ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {step.date}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rating Button - only show for delivered orders */}
            {isDelivered && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    {isRated ? (
                        <div className="text-center">
                            <p className="text-gray-500 text-sm mb-2">Та энэ захиалгыг үнэлсэн байна</p>
                            <button 
                                disabled
                                className="w-full py-3 bg-gray-200 text-gray-500 rounded-full font-medium cursor-not-allowed"
                            >
                                Үнэлсэн ✓
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">Захиалга амжилттай хүргэгдлээ!</p>
                            <button 
                                onClick={() => setIsRatingModalOpen(true)}
                                className="w-full py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600 transition-colors"
                            >
                                Үнэлгээ өгөх
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Rating Modal */}
            <RatingModal 
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                restaurantName={orderData.restaurantName}
                orderId={orderData.orderId}
                onSubmit={handleRatingSubmit}
            />
        </div>
    );
}
