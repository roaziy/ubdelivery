'use client'

import { FiShoppingCart } from "react-icons/fi";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 h-[550px]">
            <div className="text-gray-300 mb-6">
                <FiShoppingCart size={80} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Сагс хоосон байна.</h3>
            <p className="text-sm text-gray-500 text-center mb-24">
                Та хүргэлтийн цэснээс хоолоо сонгоод сагсандаа нэмээрэй.
            </p>
        </div>
    );
}
