'use client'

import { IoMdRestaurant } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi";

interface DeliveryConfirmProps {
    estimatedTime: string;
    onConfirm: () => void;
}

export default function DeliveryConfirm({ estimatedTime, onConfirm }: DeliveryConfirmProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 mb-18 h-[500px]">
            {/* Delivery Icons */}
            <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-mainGreen/10 rounded-full flex items-center justify-center">
                    <IoMdRestaurant className="text-mainGreen" size={24} />
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300 border rounded-full border-gray-400"></div>
                </div>
                <div className="w-12 h-12 bg-mainGreen/10 rounded-full flex items-center justify-center">
                    <MdDeliveryDining className="text-mainGreen" size={24} />
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300 border rounded-full border-gray-400"></div>
                </div>
                <div className="w-12 h-12 bg-mainGreen/10 rounded-full flex items-center justify-center">
                    <HiOutlineHome className="text-mainGreen" size={24} />
                </div>
            </div>

            <p className="text-center text-gray-700">
                Таны захиалгыг хүргэхэд ойролцоогоор
            </p>
            <p className="text-center mb-8">
                <span className="text-mainGreen font-semibold">{estimatedTime}</span> болно. Та төлбөрөө хийх үү?
            </p>

            <button 
                onClick={(e) => {
                    e.preventDefault();
                    onConfirm();
                    window.scrollTo({ top: 0, behavior: 'instant'});
                }}
                className="w-full max-w-xs bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
                Төлбөр төлөх
            </button>
        </div>
    );
}
