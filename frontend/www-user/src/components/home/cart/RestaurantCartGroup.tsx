'use client'

import { FaRegClock } from "react-icons/fa";
import CartItemCard, { CartItem } from "./CartItemCard";

export interface RestaurantCart {
    id: number;
    name: string;
    hours: string;
    items: CartItem[];
}

interface RestaurantCartGroupProps {
    restaurant: RestaurantCart;
    onQuantityChange: (itemId: number, delta: number) => void;
    onOrder: () => void;
}

export default function RestaurantCartGroup({ restaurant, onQuantityChange, onOrder }: RestaurantCartGroupProps) {
    const calculateTotal = () => {
        return restaurant.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <div className="mb-6">
            {/* Divider */}
            <div className="w-full h-[1px] bg-[#d9d9d9] mt-4"></div>
            
            {/* Restaurant Header */}
            <div className="flex items-center gap-3 mb-4 pt-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div>
                    <h3 className="font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaRegClock size={12} />
                        <span>{restaurant.hours}</span>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-3">
                {restaurant.items.map((item) => (
                    <CartItemCard 
                        key={item.id}
                        item={item}
                        onQuantityChange={(delta) => onQuantityChange(item.id, delta)}
                    />
                ))}
            </div>

            {/* Order Button */}
            <button 
                onClick={onOrder}
                className="w-full mt-4 bg-mainGreen text-white py-3 rounded-[13px] font-medium hover:bg-green-600 transition-colors"
            >
                Захиалах • {calculateTotal().toLocaleString()}₮
            </button>
        </div>
    );
}
