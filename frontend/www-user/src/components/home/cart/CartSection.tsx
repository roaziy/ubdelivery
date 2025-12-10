'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoClose, IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { useNotifications } from "@/components/ui/Notification";
import { CartService, AuthService } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

// Import sub-components
import EmptyCart from "./EmptyCart";
import CartTabs from "./CartTabs";
import RestaurantCartGroup, { RestaurantCart } from "./RestaurantCartGroup";
import CheckoutForm from "./CheckoutForm";
import DeliveryConfirm from "./DeliveryConfirm";
import PaymentProcessing from "./PaymentProcessing";
import PaymentSuccess from "./PaymentSuccess";
import OrdersSection from "./OrdersSection";
import OrderTracking, { TrackingStatus } from "./OrderTracking";
import { FaRegClock } from "react-icons/fa6";

// Sample cart data
const sampleCartData: RestaurantCart[] = [
    {
        id: 1,
        name: "Modern Nomads",
        hours: "09:00 - 20:00",
        items: [
            { id: 1, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
            { id: 2, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
        ]
    },
    {
        id: 2,
        name: "Pizzahut",
        hours: "09:00 - 20:00",
        items: [
            { id: 3, name: "Хүн аймар гоё Пицца, Хүн аймар гоё Пицца", restaurant: "Pizzahut mongolia", price: 35000, quantity: 1, deliveryFee: 0 },
        ]
    }
];

// Sample tracking data
const sampleTrackingSteps = [
    { id: '1', status: 'confirmed' as TrackingStatus, title: 'Таны захиалга баталгаажлаа', description: 'Таны захиалга баталгаажсан', date: '2025/10/31 - 13:03', isCompleted: true, isActive: false },
    { id: '2', status: 'preparing' as TrackingStatus, title: 'Захиалга хийгдэж байна', description: 'Pizzahut таны захиалгыг хүлээн авсан, хийж байна...', date: '2025/10/31 - 13:08', isCompleted: true, isActive: false },
    { id: '3', status: 'ready' as TrackingStatus, title: 'Таны захиалга бэлэн боллоо', description: 'Pizzahut таны захиалгыг хүргэлтийн ажилтанд өгөхөд бэлэн болсон', date: '2025/10/31 - 13:13', isCompleted: true, isActive: false },
    { id: '4', status: 'picked_up' as TrackingStatus, title: 'Хүргэлтэнд гарсан', description: 'Хүргэлтийн ажилтан таны захиалгыг хүлээн авсан', date: '2025/10/31 - 13:08', isCompleted: false, isActive: true },
    { id: '5', status: 'delivered' as TrackingStatus, title: 'Захиалга хүргэгдлээ!', description: 'Хүргэлтийн ажилтан таны захиалгыг амжилттай хүргэлээ', date: '2025/10/31', isCompleted: false, isActive: false },
];

type ViewState = 'cart' | 'checkout' | 'confirm' | 'processing' | 'success' | 'tracking';

// Driver contact info
const driverInfo = {
    name: "Одхүү Батцэцэг",
    role: "Хүргэлтийн ажилтан",
    phone: "9911-2233",
    email: "driver@ubdelivery.xyz"
};

export default function CartSection() {
    const router = useRouter();
    const notify = useNotifications();
    const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
    const [isDriverContactOpen, setIsDriverContactOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const goToHistory = () => {
        router.push('/home/orders');
    };
    const [cartData, setCartData] = useState<RestaurantCart[]>([]);
    const [viewState, setViewState] = useState<ViewState>('cart');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    
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

    // Fetch cart data
    useEffect(() => {
        const fetchCart = async () => {
            // Don't fetch if not logged in
            if (!AuthService.isLoggedIn()) {
                setLoading(false);
                setCartData([]);
                return;
            }
            
            setLoading(true);
            try {
                const response = await CartService.get();
                if (response.success && response.data) {
                    // Transform API cart data to RestaurantCart format
                    const transformedData = transformCartData(response.data);
                    setCartData(transformedData);
                } else {
                    setCartData([]);
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                setCartData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Transform Cart API data to RestaurantCart format
    const transformCartData = (cart: Cart): RestaurantCart[] => {
        // Group items by restaurant
        const restaurantMap = new Map<string, RestaurantCart>();
        
        cart.items.forEach(item => {
            const restaurantId = item.restaurantId || 'default';
            if (!restaurantMap.has(restaurantId)) {
                restaurantMap.set(restaurantId, {
                    id: parseInt(restaurantId) || 1,
                    name: item.restaurantName || 'Рестоуран',
                    hours: '09:00 - 20:00',
                    items: []
                });
            }
            
            const restaurant = restaurantMap.get(restaurantId)!;
            restaurant.items.push({
                id: parseInt(item.id) || parseInt(item.foodId.toString()) || 1,
                name: item.name,
                restaurant: item.restaurantName || '',
                price: item.price,
                quantity: item.quantity,
                deliveryFee: 0,
                image: item.image
            });
        });
        
        return Array.from(restaurantMap.values());
    };

    const isEmpty = cartData.length === 0 || cartData.every(r => r.items.length === 0);

    const handleQuantityChange = async (restaurantId: number, itemId: number, delta: number) => {
        // Optimistic update
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

        // API call
        try {
            const item = cartData
                .find(r => r.id === restaurantId)
                ?.items.find(i => i.id === itemId);
            
            if (item) {
                const newQuantity = Math.max(1, item.quantity + delta);
                await CartService.updateQuantity(itemId.toString(), newQuantity);
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            notify.error('Алдаа', 'Тоо хэмжээг өөрчлөхөд алдаа гарлаа');
        }
    };

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOrder = () => {
        setViewState('checkout');
        notify.info('Захиалга', 'Хүргэлтийн мэдээллээ бөглөнө үү');
    };

    const handlePayment = () => {
        setViewState('confirm');
    };

    const handleConfirmPayment = async () => {
        setViewState('processing');
        notify.info('Төлбөр', 'Төлбөр боловсруулагдаж байна...');
        
        try {
            const response = await OrderService.create({
                deliveryAddress: formData.address,
                floor: formData.floor,
                doorNumber: formData.doorNumber,
                doorCode: formData.doorCode,
                notes: formData.detailedAddress,
                paymentMethod: formData.paymentMethod
            });
            
            if (response.success) {
                setViewState('success');
                notify.success('Амжилттай', 'Таны захиалга амжилттай баталгаажлаа!');
                // Clear cart after successful order
                setCartData([]);
            } else {
                notify.error('Алдаа', response.error || 'Захиалга үүсгэхэд алдаа гарлаа');
                setViewState('confirm');
            }
        } catch (error) {
            console.error('Failed to create order:', error);
            // Fallback to simulated success for demo
            setTimeout(() => {
                setViewState('success');
                notify.success('Амжилттай', 'Таны захиалга амжилттай баталгаажлаа!');
            }, 2000);
        }
    };

    const handleViewTracking = (orderId: number) => {
        setSelectedOrderId(orderId);
        setViewState('tracking');
    };

    const handleBack = () => {
        if (viewState === 'checkout') {
            setViewState('cart');
        } else if (viewState === 'confirm') {
            setViewState('checkout');
        } else if (viewState === 'success') {
            setActiveTab('orders');
            setViewState('cart');
        } else if (viewState === 'tracking') {
            setViewState('cart');
            setActiveTab('orders');
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

    // Render tracking view
    if (viewState === 'tracking') {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:mt-8 mb-20 md:mb-8 min-h-[650px]">
                <OrderTracking
                    orderId="UB25Z11091007"
                    restaurantName="Modern Nomads"
                    deliveryAddress="ХУД, 3-р хороо, Хос даль аппартмент"
                    driverName={driverInfo.name}
                    driverRole={driverInfo.role}
                    progress={54}
                    estimatedTime="1 цаг 45 минутын дараа"
                    steps={sampleTrackingSteps}
                    onBack={handleBack}
                    onContactDriver={() => setIsDriverContactOpen(true)}
                />

                {/* Driver Contact Modal */}
                {isDriverContactOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
                        onClick={() => setIsDriverContactOpen(false)}
                    >
                        <div 
                            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsDriverContactOpen(false)}
                            >
                                <IoClose size={24} />
                            </button>
                            
                            <h2 className="text-xl font-bold mb-2 text-center">Холбоо барих</h2>
                            <p className="text-sm text-gray-500 text-center mb-6">Хүргэлтийн ажилтан</p>
                            
                            {/* Driver Avatar and Name */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                                <p className="font-semibold">{driverInfo.name}</p>
                                <p className="text-xs text-mainGreen">{driverInfo.role}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                        <FaPhone className="text-mainGreen" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Утасны дугаар</p>
                                        <a 
                                            href={`tel:${driverInfo.phone}`} 
                                            className="font-medium text-sm md:text-lg hover:text-mainGreen transition-colors"
                                        >
                                            {driverInfo.phone}
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                        <IoMail className="text-mainGreen" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Имэйл хаяг</p>
                                        <a 
                                            href={`mailto:${driverInfo.email}`} 
                                            className="font-medium text-sm md:text-lg hover:text-mainGreen transition-colors"
                                        >
                                            {driverInfo.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

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
                <button 
                    onClick={goToHistory}
                    className="absolute right-0 flex items-center gap-1 px-4 py-[10px] border border-gray-300 rounded-full text-sm hover:border-mainGreen transition-colors"
                >
                    <FaRegClock size={14} />
                    Түүх
                </button>

            </div>

            {/* Tabs - only show in cart view */}
            {viewState === 'cart' && (
                <CartTabs activeTab={activeTab} onTabChange={setActiveTab} />
            )}

            {/* Content based on view state */}
            {viewState === 'cart' && (
                loading ? (
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[...Array(2)].map((_, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <Skeleton className="w-16 h-16 rounded-lg" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-3/4 mb-2" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'cart' 
                    ? (isEmpty ? <EmptyCart /> : renderCartItems())
                    : <OrdersSection onViewTracking={handleViewTracking} />
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
