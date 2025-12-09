'use client'

export interface OrderItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    deliveryFee: number;
    date: string;
}

interface OrderItemCardProps {
    item: OrderItem;
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
    return (
        <div className="flex flex-col md:flex-row gap-0 md:gap-3 border border-[#D9D9D9] bg-white rounded-xl">
            <div className="w-full md:w-[180px] h-[100px] md:h-auto bg-gray-400 rounded-t-xl md:rounded-lg flex-shrink-0"></div>
            <div className="flex-1 py-3 pr-3 pl-2">
                <h4 className="text-[15px] font-medium line-clamp-2">{item.name}</h4>
                <p className="text-[13px] text-mainGreen">{item.restaurant}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold">
                        ₮{item.price.toLocaleString()} 
                        <span className="text-xs font-normal text-gray-500"> + Хүргэлт</span>
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                </div>
            </div>
        </div>
    );
}
