'use client'

import { IoChevronBack } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { IoMdRestaurant } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export type TrackingStatus = 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

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

interface OrderTrackingProps {
    orderId: string;
    restaurantName: string;
    deliveryAddress: string;
    driverName?: string;
    driverRole?: string;
    progress: number;
    estimatedTime?: string;
    steps: TrackingStep[];
    canRefund?: boolean;
    onBack: () => void;
    onContactDriver?: () => void;
    onRefund?: () => void;
}

export default function OrderTracking({
    orderId,
    restaurantName,
    deliveryAddress,
    driverName,
    driverRole,
    progress,
    estimatedTime,
    steps,
    canRefund,
    onBack,
    onContactDriver,
    onRefund
}: OrderTrackingProps) {
    const getStepIcon = (step: TrackingStep) => {
        if (step.isCancelled) {
            return (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-lg">✕</span>
                </div>
            );
        }
        
        if (step.isCompleted) {
            return (
                <div className="w-10 h-10 bg-mainGreen rounded-full flex items-center justify-center">
                    <FaCheck className="text-white" size={16} />
                </div>
            );
        }
        
        if (step.isActive) {
            const iconMap: Record<string, React.ReactNode> = {
                'confirmed': <FaCheck className="text-mainGreen" size={18} />,
                'preparing': <IoMdRestaurant className="text-mainGreen" size={20} />,
                'ready': <IoMdRestaurant className="text-mainGreen" size={20} />,
                'picked_up': <TbTruckDelivery className="text-mainGreen" size={20} />,
                'delivered': <MdDeliveryDining className="text-mainGreen" size={20} />,
            };
            
            return (
                <div className="w-10 h-10 bg-mainGreen/10 rounded-full flex items-center justify-center border-2 border-mainGreen">
                    {iconMap[step.status] || <FaRegClock className="text-mainGreen" size={18} />}
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
        <div>
            {/* Header */}
            <div className="relative flex justify-center items-center mb-6">
                <button 
                    onClick={onBack}
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
                        <h3 className="font-semibold">{restaurantName}</h3>
                        <p className="text-xs text-gray-500">Order ID: {orderId}</p>
                    </div>
                </div>
                {canRefund && (
                    <button 
                        onClick={onRefund}
                        className="px-4 py-2 bg-[#8C8C8C] text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                    >
                        Мөнгөө авах
                    </button>
                )}
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">Захиалгыг хүргэх хаяг:</p>
                <p className="font-medium">{deliveryAddress}</p>
            </div>

            {/* Driver Info */}
            {driverName && (
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Хүргэлт хийх ажилтан:</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <p className="font-medium">{driverName}</p>
                                <p className="text-xs text-mainGreen">{driverRole}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onContactDriver}
                            className="px-4 py-2 bg-mainGreen text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                        >
                            Холбоо барих
                        </button>
                    </div>
                </div>
            )}

            {/* Progress */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">Захиалгын үйл явц:</span>
                    <span className="text-mainGreen font-semibold">{progress}%</span>
                </div>
                {estimatedTime && (
                    <p className="text-sm text-gray-500">
                        Таны захиалга ойролцоогоор: {estimatedTime} ирнэ
                    </p>
                )}
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div 
                        key={step.id}
                        className={`flex gap-4 ${step.isActive ? 'bg-mainGreen/5 -mx-4 px-4 py-3 rounded-xl' : 'py-3'} ${step.isCancelled ? 'bg-red-50 -mx-4 px-4 py-3 rounded-xl' : ''}`}
                    >
                        <div className="flex flex-col items-center">
                            {getStepIcon(step)}
                            {index < steps.length - 1 && (
                                <div className={`w-0.5 h-8 mt-2 ${step.isCompleted ? 'bg-mainGreen' : 'bg-gray-200'}`}></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className={`font-medium ${step.isCancelled ? 'text-red-500' : step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.title}
                                    </h4>
                                    <p className={`text-xs ${step.isCancelled ? 'text-red-400' : step.isCompleted || step.isActive ? 'text-mainGreen' : 'text-gray-400'}`}>
                                        {step.description}
                                    </p>
                                </div>
                                <span className={`text-xs ${step.isCompleted || step.isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {step.date}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
