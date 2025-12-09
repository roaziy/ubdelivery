import { Restaurant, FoodItem, FoodCategory, Deal, Order, Cart, User } from './types';

// ============ MOCK DATA FOR DEVELOPMENT ============

export const mockCategories: FoodCategory[] = [
    { id: '1', name: 'Бүх хоол' },
    { id: '2', name: 'Пицца' },
    { id: '3', name: 'Монгол хоол' },
    { id: '4', name: 'Солонгос хоол' },
    { id: '5', name: 'Япон хоол' },
    { id: '6', name: 'Түргэн хоол' },
    { id: '7', name: 'Бургер' },
    { id: '8', name: 'Шарсан тахиа' },
];

export const mockRestaurants: Restaurant[] = [
    { 
        id: '1', 
        name: 'Modern Nomads', 
        type: 'Монгол уламжлалт хоол',
        cuisineType: 'Монгол хоол',
        hours: '09:00 - 20:00', 
        rating: 4.8,
        reviewCount: 245,
        isOpen: true,
        deliveryTime: '30-45 мин',
        deliveryFee: 3000,
        minOrder: 15000,
        coordinates: { lat: 47.9187, lng: 106.9177 },
    },
    { 
        id: '2', 
        name: 'Pizza Hut Mongolia', 
        type: 'Пицца, Итали хоол',
        cuisineType: 'Пицца',
        hours: '10:00 - 22:00', 
        rating: 4.5,
        reviewCount: 512,
        isOpen: true,
        deliveryTime: '25-40 мин',
        deliveryFee: 2500,
        minOrder: 20000,
        coordinates: { lat: 47.9215, lng: 106.9225 },
    },
    { 
        id: '3', 
        name: 'Seoul Garden', 
        type: 'Солонгос хоол',
        cuisineType: 'Солонгос хоол',
        hours: '11:00 - 21:00', 
        rating: 4.7,
        reviewCount: 189,
        isOpen: true,
        deliveryTime: '35-50 мин',
        deliveryFee: 3500,
        minOrder: 25000,
        coordinates: { lat: 47.9165, lng: 106.9135 },
    },
    { 
        id: '4', 
        name: 'Burger King', 
        type: 'Түргэн хоол, Бургер',
        cuisineType: 'Бургер',
        hours: '08:00 - 23:00', 
        rating: 4.3,
        reviewCount: 876,
        isOpen: true,
        deliveryTime: '20-30 мин',
        deliveryFee: 2000,
        minOrder: 10000,
        coordinates: { lat: 47.9195, lng: 106.9155 },
    },
];

export const mockFoods: FoodItem[] = [
    {
        id: '1',
        name: 'Пепперони Пицца',
        description: 'Шарсан пепперони, моцарелла бяслаг, улаан лоолийн соус',
        price: 35000,
        category: 'Пицца',
        restaurantId: '2',
        restaurantName: 'Pizza Hut Mongolia',
        rating: 4.7,
        reviewCount: 128,
        isAvailable: true,
    },
    {
        id: '2',
        name: 'Хуушуур',
        description: 'Уламжлалт монгол хуушуур, үхрийн махтай',
        price: 2500,
        category: 'Монгол хоол',
        restaurantId: '1',
        restaurantName: 'Modern Nomads',
        rating: 4.9,
        reviewCount: 256,
        isAvailable: true,
    },
    {
        id: '3',
        name: 'Бибимбаб',
        description: 'Солонгос уламжлалт будаатай хоол, хайруулсан өндөг, ногоо',
        price: 18000,
        category: 'Солонгос хоол',
        restaurantId: '3',
        restaurantName: 'Seoul Garden',
        rating: 4.6,
        reviewCount: 89,
        isAvailable: true,
    },
    {
        id: '4',
        name: 'Whopper Burger',
        description: 'Том үхрийн бургер, салат, улаан лооль, сонгино',
        price: 15000,
        category: 'Бургер',
        restaurantId: '4',
        restaurantName: 'Burger King',
        rating: 4.4,
        reviewCount: 342,
        isAvailable: true,
    },
    {
        id: '5',
        name: 'Маргарита Пицца',
        description: 'Сонгодог итали пицца, шинэ гишүүнцэр, моцарелла',
        price: 28000,
        category: 'Пицца',
        restaurantId: '2',
        restaurantName: 'Pizza Hut Mongolia',
        rating: 4.5,
        reviewCount: 95,
        isAvailable: true,
    },
    {
        id: '6',
        name: 'Бууз',
        description: 'Монгол уламжлалт бууз, үхрийн махтай',
        price: 1500,
        category: 'Монгол хоол',
        restaurantId: '1',
        restaurantName: 'Modern Nomads',
        rating: 4.8,
        reviewCount: 412,
        isAvailable: true,
    },
    {
        id: '7',
        name: 'Кимчи Fried Rice',
        description: 'Кимчитэй хайруулсан будаа, өндөг',
        price: 14000,
        category: 'Солонгос хоол',
        restaurantId: '3',
        restaurantName: 'Seoul Garden',
        rating: 4.5,
        reviewCount: 67,
        isAvailable: true,
    },
    {
        id: '8',
        name: 'Chicken Nuggets',
        description: '10 ширхэг тахианы наггет, соустай',
        price: 12000,
        category: 'Түргэн хоол',
        restaurantId: '4',
        restaurantName: 'Burger King',
        rating: 4.2,
        reviewCount: 156,
        isAvailable: true,
    },
];

export const mockDeals: Deal[] = [
    { 
        id: '1', 
        title: 'Нэгийн үнээр хоёрыг', 
        subtitle: 'Пицца + Ундаа багц', 
        discount: '20% off',
        discountPercent: 20,
        restaurantId: '2',
        restaurantName: 'Pizza Hut Mongolia',
        originalPrice: 35000,
        discountedPrice: 28000,
        items: ['Том пепперони пицца x1', 'Дунд маргарита пицца x1', '1.5л Coca Cola x1'],
        validUntil: 'Өнөөдөр дуусна',
        isActive: true,
    },
    { 
        id: '2', 
        title: 'Гэр бүлийн багц', 
        subtitle: '4 хүний хоол', 
        discount: '30% off',
        discountPercent: 30,
        restaurantId: '1',
        restaurantName: 'Modern Nomads',
        originalPrice: 68000,
        discountedPrice: 47600,
        items: ['Хуушуур x8', 'Бууз x12', 'Цуйван x2', 'Сүүтэй цай x4'],
        validUntil: '2 өдөр үлдсэн',
        isActive: true,
    },
    { 
        id: '3', 
        title: 'Бургер комбо', 
        subtitle: 'Бургер + Фри + Ундаа', 
        discount: '25% off',
        discountPercent: 25,
        restaurantId: '4',
        restaurantName: 'Burger King',
        originalPrice: 24000,
        discountedPrice: 18000,
        items: ['Чизбургер x1', 'Том фри x1', 'Pepsi 0.5л x1'],
        validUntil: 'Энэ долоо хоногт',
        isActive: true,
    },
];

export const mockCart: Cart = {
    items: [],
    subtotal: 0,
    deliveryFee: 3000,
    serviceFee: 500,
    total: 3500,
};

export const mockOrders: Order[] = [
    {
        id: 'UB25Z11091007',
        orderNumber: 'UB25Z11091007',
        userId: '1',
        restaurantId: '1',
        restaurantName: 'Modern Nomads',
        items: [
            { id: '1', foodId: 1, name: 'Хуушуур x5', price: 12500, quantity: 5 },
            { id: '2', foodId: 2, name: 'Бууз x10', price: 15000, quantity: 10 },
        ],
        status: 'delivered',
        subtotal: 27500,
        deliveryFee: 3000,
        serviceFee: 500,
        total: 31000,
        deliveryAddress: 'ХУД, 3-р хороо, 45-р байр',
        paymentMethod: 'card',
        isPaid: true,
        createdAt: '2025-10-31T13:23:00Z',
        updatedAt: '2025-10-31T14:00:00Z',
        isRated: false,
    },
    {
        id: 'UB25Z11091008',
        orderNumber: 'UB25Z11091008',
        userId: '1',
        restaurantId: '2',
        restaurantName: 'Pizza Hut Mongolia',
        items: [
            { id: '3', foodId: 1, name: 'Пепперони Пицца', price: 35000, quantity: 1 },
        ],
        status: 'cancelled',
        subtotal: 35000,
        deliveryFee: 2500,
        serviceFee: 500,
        total: 38000,
        deliveryAddress: 'ХУД, 3-р хороо, 45-р байр',
        paymentMethod: 'cash',
        isPaid: false,
        createdAt: '2025-10-30T18:45:00Z',
        updatedAt: '2025-10-30T18:50:00Z',
        isRated: false,
    },
    {
        id: 'UB25Z11091009',
        orderNumber: 'UB25Z11091009',
        userId: '1',
        restaurantId: '4',
        restaurantName: 'Burger King',
        items: [
            { id: '4', foodId: 4, name: 'Whopper Burger Combo', price: 28000, quantity: 1 },
        ],
        status: 'delivered',
        subtotal: 28000,
        deliveryFee: 2000,
        serviceFee: 500,
        total: 30500,
        deliveryAddress: 'СХД, 1-р хороо, 12-р байр',
        paymentMethod: 'card',
        isPaid: true,
        createdAt: '2025-10-29T12:00:00Z',
        updatedAt: '2025-10-29T12:45:00Z',
        isRated: true,
    },
];

export const mockUser: User = {
    id: '1',
    phone: '99001122',
    name: 'Батбаяр',
    email: 'batbayar@example.com',
    address: 'ХУД, 3-р хороо, 45-р байр',
    createdAt: '2024-01-15T10:00:00Z',
};

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 1000) => 
    new Promise(resolve => setTimeout(resolve, ms));

// Format currency
export const formatCurrency = (amount: number): string => {
    return `₮${amount.toLocaleString()}`;
};

// Format time ago
export const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Дөнгөж сая';
    if (diffInMinutes < 60) return `${diffInMinutes} минутын өмнө`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} цагийн өмнө`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} өдрийн өмнө`;
    
    return past.toLocaleDateString('mn-MN');
};
