'use client'

import { IoSearchOutline } from "react-icons/io5";

export default function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-20 h-[450px]">
            <div className="text-gray-300 mb-6 relative">
                {/* Dashed box with magnifying glass */}
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <IoSearchOutline size={40} className="text-gray-300" />
                </div>
                {/* Arrow pointing down */}
                <div className="absolute -top-4 -left-4 text-gray-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 7l10 10M17 7v10H7" />
                    </svg>
                </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
                Та хүргэлтийн цэснээс хоолоо сонгоод сагсандаа нэмээрэй.
            </p>
        </div>
    );
}
