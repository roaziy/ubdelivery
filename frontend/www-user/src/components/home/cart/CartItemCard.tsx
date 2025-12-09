'use client'

import { IoIosRemove, IoIosAdd } from "react-icons/io";

export interface CartItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
    deliveryFee: number;
}

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (delta: number) => void;
}

export default function CartItemCard({ item, onQuantityChange }: CartItemCardProps) {
    return (
        <div className="flex flex-col md:flex-row gap-0 md:gap-3 border border-[#D9D9D9] bg-white rounded-xl">
            <div className="w-full md:w-[250px] h-[120px] md:h-auto bg-gray-400 rounded-t-xl md:rounded-lg flex-shrink-0"></div>
            <div className="flex-1 py-3 pr-3 pl-2">
                <h4 className="text-[16px] font-medium line-clamp-2">{item.name}</h4>
                <p className="text-[14px] text-mainGreen">{item.restaurant}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold">
                        ₮{item.price.toLocaleString()} 
                        <span className="text-xs font-normal text-gray-500"> + Хүргэлт</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onQuantityChange(-1)}
                            className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors"
                        >
                            <IoIosRemove className="text-gray-600" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => onQuantityChange(1)}
                            className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors"
                        >
                            <IoIosAdd className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
