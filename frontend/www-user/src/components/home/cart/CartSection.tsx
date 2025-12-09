'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

import { IoMdRestaurant } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi";


interface CartItem {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
    deliveryFee: number;
}

interface RestaurantCart {
    id: number;
    name: string;
    hours: string;
    items: CartItem[];
}

// Sample cart data
const sampleCartData: RestaurantCart[] = [
    {
        id: 1,
        name: "Modern Nomads",
        hours: "09:00 - 20:00",
        items: [
            { id: 1, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
            { id: 2, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
        ]
    },
    {
        id: 2,
        name: "Pizzahut",
        hours: "09:00 - 20:00",
        items: [
            { id: 3, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
        ]
    }
];

type ViewState = 'cart' | 'checkout' | 'confirm' | 'processing' | 'success';

export default function CartSection() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
    const [cartData, setCartData] = useState<RestaurantCart[]>(sampleCartData);
    const [viewState, setViewState] = useState<ViewState>('cart');
    
    // Checkout form state
    const [address, setAddress] = useState("");
    const [floor, setFloor] = useState("");
    const [doorNumber, setDoorNumber] = useState("");
    const [doorCode, setDoorCode] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [couponCode, setCouponCode] = useState("");

    const isEmpty = cartData.length === 0 || cartData.every(r => r.items.length === 0);

    const calculateRestaurantTotal = (restaurant: RestaurantCart) => {
        return restaurant.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateGrandTotal = () => {
        return cartData.reduce((sum, restaurant) => sum + calculateRestaurantTotal(restaurant), 0);
    };

    const handleQuantityChange = (restaurantId: number, itemId: number, delta: number) => {
        setCartData(prev => prev.map(restaurant => {
            if (restaurant.id === restaurantId) {
                return {
                    ...restaurant,
                    items: restaurant.items.map(item => {
                        if (item.id === itemId) {
                            const newQuantity = Math.max(1, item.quantity + delta);
                            return { ...item, quantity: newQuantity };
                        }
                        return item;
                    })
                };
            }
            return restaurant;
        }));
    };

    const handleOrder = (restaurantId: number) => {
        setViewState('checkout');
    };

    const handlePayment = () => {
        setViewState('confirm');
    };

    const handleConfirmPayment = () => {
        setViewState('processing');
        // Simulate payment processing
        setTimeout(() => {
            setViewState('success');
        }, 3000);
    };

    const handleBack = () => {
        if (viewState === 'checkout') {
            setViewState('cart');
        } else if (viewState === 'confirm') {
            setViewState('checkout');
        } else if (viewState === 'success') {
            router.push('/home');
        } else {
            router.back();
        }
    };

    // Empty Cart State
    const EmptyCartView = () => (
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

    // Cart View with items
    const CartView = () => (
        <>
            {cartData.map((restaurant) => (
                <div key={restaurant.id} className="mb-6">
                    {/* Restaurant Header */}
                        <div className="w-full h-[1px] bg-[#d9d9d9] mt-4"></div>
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
                            <div key={item.id} className="flex flex-col md:flex-row gap-0 md:gap-3 border border-[#D9D9D9] bg-white rounded-xl">
                                <div className="w-full md:w-[250px] h-[120px] md:h-auto bg-gray-400 rounded-t-xl md:rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 py-3 pr-3 pl-2">
                                    <h4 className="text-[16px] font-medium line-clamp-2">{item.name}</h4>
                                    <p className="text-[14px] text-mainGreen">{item.restaurant}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-semibold">₮{item.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">+ Хүргэлт</span></span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleQuantityChange(restaurant.id, item.id, -1)}
                                                className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors"
                                            >
                                                <IoIosRemove className="text-gray-600" />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(restaurant.id, item.id, 1)}
                                                className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors"
                                            >
                                                <IoIosAdd className="text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Button */}
                    <button 
                        onClick={() => handleOrder(restaurant.id)}
                        className="w-full mt-4 bg-mainGreen text-white py-3 rounded-[13px] font-medium hover:bg-green-600 transition-colors"
                    >
                        Захиалах • {calculateRestaurantTotal(restaurant).toLocaleString()}₮
                    </button>
                </div>
            ))}
        </>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:mt-8 mb-20 md:mb-8 min-h-[650px]">
            {/* Header */}
            <div className="relative flex justify-center items-center mb-6">
                <button 
                    onClick={handleBack}
                    className="absolute left-0 flex items-center gap-1 bg-[#8C8C8C] text-white px-3 py-3 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                    <IoChevronBack size={18} />
                </button>
                <h1 className="flex text-center text-xl font-semibold">Захиалга</h1>
            </div>

            {/* Tabs - only show in cart view */}
            {viewState === 'cart' && (
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'cart'
                                ? 'bg-mainGreen text-white'
                                : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                        }`}
                    >
                        Сагс
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'orders'
                                ? 'bg-mainGreen text-white'
                                : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                        }`}
                    >
                        Захиалга
                    </button>
                </div>
            )}

            {/* Content */}
            {viewState === 'cart' && (
                activeTab === 'cart' ? (
                    isEmpty ? <EmptyCartView /> : <CartView />
                ) : (
                    <EmptyCartView /> // Orders tab - show empty for now
                )
            )}
            {viewState === 'checkout' && (
                <div className="space-y-8">
                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">Таны хаяг</label>
                        <div className="relative">
                            <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[13px] text-sm outline-none focus:border-mainGreen"
                                placeholder="Хүргэлт хийх хаяг"
                            />
                        </div>
                    </div>

                    {/* Floor and Door Number */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-center mb-2">Давхар</label>
                            <input 
                                type="text"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                                placeholder="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-center mb-2">Тоот</label>
                            <input 
                                type="text"
                                value={doorNumber}
                                onChange={(e) => setDoorNumber(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    {/* Door Code */}
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">Орцны код</label>
                        <input 
                            type="text"
                            value={doorCode}
                            onChange={(e) => setDoorCode(e.target.value)}
                            placeholder="123456#abc"
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                        />
                    </div>

                    {/* Detailed Address */}
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">Дэлгэрэнгүй хаяг</label>
                        <input 
                            type="text"
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            placeholder="Дэлгэрэнгүй хаяг"
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">Төлбөрийн баримт авах:</label>
                        <select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen appearance-none bg-white"
                        >
                            <option value="">E-Barimt сонгох</option>
                            <option value="main">14001507 </option>
                        </select>
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">Купон код ашиглах</label>
                        <input 
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Купон, бэлгийн картын дугаар"
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                        />
                    </div>

                    {/* Payment Button */}
                    <button 
                        onClick={handlePayment}
                        className="w-full mt-4 bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                    >
                        Төлбөр төлөх
                    </button>
                </div>
            )}
            {viewState === 'confirm' && (
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
                        <span className="text-mainGreen font-semibold">1 цаг 45 минут</span> болно. Та төлбөрөө хийх үү?
                    </p>

                    <button 
                        onClick={handleConfirmPayment}
                        className="w-full max-w-xs bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                    >
                        Төлбөр төлөх
                    </button>
                </div>
            )}
            {viewState === 'processing' && (
                <div className="flex flex-col items-center justify-center py-20 h-[500px]">
                    {/* Loading Spinner */}
                    <div className="w-16 h-16 border-4 border-mainGreen border-t-transparent rounded-full animate-spin mb-8"></div>
                    <p className="text-center text-gray-700">
                        Таны захиалгын төлбөрийг гаргаж<br />
                        байна... Та түр хүлээнэ үү?
                    </p>
                </div>
            )}
            {viewState === 'success' && (
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
            )}
        </div>
    );
}
