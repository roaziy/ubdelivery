// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// User types
export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    address?: string;
    eBarimtCode?: string;
    createdAt: string;
}

// Restaurant types
export interface Restaurant {
    id: string;
    name: string;
    type: string;
    cuisineType: string;
    description?: string;
    logo?: string;
    banner?: string;
    hours: string;
    rating: number;
    reviewCount: number;
    address?: string;
    phone?: string;
    isOpen: boolean;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
}

// Food/Menu types
export interface FoodItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    discountedPrice?: number;
    image?: string;
    category: string;
    restaurantId: string;
    restaurantName: string;
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
    servings?: string;
    calories?: string;
    preparationTime?: string;
    options?: FoodOption[];
}

export interface FoodOption {
    id: string;
    name: string;
    choices: FoodChoice[];
    required: boolean;
}

export interface FoodChoice {
    id: string;
    name: string;
    price: number;
}

export interface FoodCategory {
    id: string;
    name: string;
    icon?: string;
}

// Cart types
export interface CartItem {
    id: string;
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    options?: { optionId: string; choiceId: string; name: string; price: number }[];
    image?: string;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
}

// Order types
export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    restaurantName: string;
    restaurantLogo?: string;
    items: OrderItem[];
    status: OrderStatus;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
    deliveryAddress: string;
    paymentMethod: string;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    estimatedDelivery?: string;
    driver?: Driver;
    tracking?: OrderTracking[];
    isRated?: boolean;
}

export interface OrderItem {
    id: string;
    foodId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    options?: { name: string; price: number }[];
}

export type OrderStatus = 
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'delivering'
    | 'delivered'
    | 'cancelled';

export interface OrderTracking {
    id: string;
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    isCompleted: boolean;
    isActive: boolean;
}

// Driver types
export interface Driver {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    rating: number;
    vehicleType: string;
    vehiclePlate: string;
}

// Deal types
export interface Deal {
    id: string;
    title: string;
    subtitle: string;
    discount: string;
    discountPercent: number;
    restaurantId: string;
    restaurantName: string;
    originalPrice: number;
    discountedPrice: number;
    description?: string;
    image?: string;
    items: string[];
    validUntil: string;
    isActive: boolean;
}

// Review types
export interface Review {
    id: string;
    userId: string;
    userName: string;
    orderId: string;
    restaurantId: string;
    foodRating: number;
    deliveryRating: number;
    comment?: string;
    createdAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Search/Filter
export interface SearchParams {
    query?: string;
    category?: string;
    sortBy?: 'rating' | 'price' | 'delivery_time' | 'distance';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
