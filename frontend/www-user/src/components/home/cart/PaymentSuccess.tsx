'use client'

import { FaCheck } from "react-icons/fa6";

export default function PaymentSuccess() {
    return (
        <div className="flex flex-col items-center justify-center py-20 h-[500px]">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-mainGreen rounded-full flex items-center justify-center mb-8">
                <FaCheck className="text-white" size={32} />
            </div>
            <p className="text-center text-gray-700 font-medium mb-2">
                Таны захиалга баталгаажлаа!
            </p>
            <p className="text-center text-gray-500 text-sm">
                Та захиалгаа сагс хэсгийн захиалга<br />
                хэсгээс шалгана уу {"<3"}
            </p>
        </div>
    );
}
