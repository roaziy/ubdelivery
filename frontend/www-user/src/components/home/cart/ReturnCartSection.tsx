'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

// Import sub-components
import EmptyCart from "./EmptyCart";
import CartTabs from "./CartTabs";
import RestaurantCartGroup, { RestaurantCart } from "./RestaurantCartGroup";
import CheckoutForm from "./CheckoutForm";
import DeliveryConfirm from "./DeliveryConfirm";
import PaymentProcessing from "./PaymentProcessing";
import PaymentSuccess from "./PaymentSuccess";

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
    const [formData, setFormData] = useState({
        address: "",
        floor: "",
        doorNumber: "",
        doorCode: "",
        detailedAddress: "",
        paymentMethod: "",
        couponCode: "",
    });

    const isEmpty = cartData.length === 0 || cartData.every(r => r.items.length === 0);

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

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOrder = () => {
        setViewState('checkout');
    };

    const handlePayment = () => {
        setViewState('confirm');
    };

    const handleConfirmPayment = () => {
        setViewState('processing');
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

    // Render cart items grouped by restaurant
    const renderCartItems = () => (
        <>
            {cartData.map((restaurant) => (
                <RestaurantCartGroup
                    key={restaurant.id}
                    restaurant={restaurant}
                    onQuantityChange={(itemId, delta) => handleQuantityChange(restaurant.id, itemId, delta)}
                    onOrder={handleOrder}
                />
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
                <CartTabs activeTab={activeTab} onTabChange={setActiveTab} />
            )}

            {/* Content based on view state */}
            {viewState === 'cart' && (
                activeTab === 'cart' 
                    ? (isEmpty ? <EmptyCart /> : renderCartItems())
                    : <EmptyCart />
            )}
            
            {viewState === 'checkout' && (
                <CheckoutForm 
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSubmit={handlePayment}
                />
            )}
            
            {viewState === 'confirm' && (
                <DeliveryConfirm 
                    estimatedTime="1 цаг 45 минут"
                    onConfirm={handleConfirmPayment}
                />
            )}
            
            {viewState === 'processing' && <PaymentProcessing />}
            
            {viewState === 'success' && <PaymentSuccess />}
        </div>
    );
}
