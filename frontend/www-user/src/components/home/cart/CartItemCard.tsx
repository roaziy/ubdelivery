'use client'

import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import Image from "next/image";

export interface CartItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
    deliveryFee: number;
    image?: string;
}

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (delta: number) => void;
    onRemove?: () => void;
}

export default function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
    return (
        <div className="flex flex-col md:flex-row gap-0 md:gap-3 border border-[#D9D9D9] bg-white rounded-xl overflow-hidden">
            <div className="w-full md:w-[250px] h-[120px] md:h-auto bg-gray-200 rounded-t-xl md:rounded-lg flex-shrink-0 relative">
                {item.image ? (
                    <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${item.image ? 'hidden' : ''}`}>
                    Зураг байхгүй
                </div>
            </div>
            <div className="flex-1 py-3 pr-3 pl-2">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h4 className="text-[16px] font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-[14px] text-mainGreen">{item.restaurant}</p>
                    </div>
                    {onRemove && (
                        <button 
                            onClick={onRemove}
                            className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            title="Устгах"
                        >
                            <IoTrashOutline size={18} />
                        </button>
                    )}
                </div>
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
