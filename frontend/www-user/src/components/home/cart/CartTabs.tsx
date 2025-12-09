'use client'

interface CartTabsProps {
    activeTab: 'cart' | 'orders';
    onTabChange: (tab: 'cart' | 'orders') => void;
}

export default function CartTabs({ activeTab, onTabChange }: CartTabsProps) {
    return (
        <div className="flex justify-center gap-2 mb-6">
            <button
                onClick={() => onTabChange('cart')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'cart'
                        ? 'bg-mainGreen text-white'
                        : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                }`}
            >
                Сагс
            </button>
            <button
                onClick={() => onTabChange('orders')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                        ? 'bg-mainGreen text-white'
                        : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                }`}
            >
                Захиалга
            </button>
        </div>
    );
}
