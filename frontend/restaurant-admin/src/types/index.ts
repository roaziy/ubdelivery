// User Types
export interface User {
    id: string;
    phone: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    createdAt: string;
}

// Restaurant Types
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    logo: string | null;
    coverImage: string | null;
    address: string;
    phone: string;
    email: string;
    rating: number;
    totalReviews: number;
    isOpen: boolean;
    isApproved: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface RestaurantHours {
    id: string;
    restaurantId: string;
    dayOfWeek: number; // 0-6, Sunday-Saturday
    openTime: string;  // HH:mm format
    closeTime: string; // HH:mm format
    isClosed: boolean;
}

export interface BankInfo {
    id: string;
    restaurantId: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

// Food/Menu Types
export interface FoodCategory {
    id: string;
    name: string;
    restaurantId: string;
    order: number;
}

export interface Food {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    image: string | null;
    categoryId: string;
    restaurantId: string;
    isAvailable: boolean;
    preparationTime: number; // in minutes
    createdAt: string;
    updatedAt: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    orderId: string;
    foodId: string;
    foodName: string;
    quantity: number;
    price: number;
    notes: string | null;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    userName: string | null;
    userPhone: string;
    restaurantId: string;
    driverId: string | null;
    driverName: string | null;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    discount: number;
    total: number;
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    notes: string | null;
    estimatedDeliveryTime: string | null;
    actualDeliveryTime: string | null;
    createdAt: string;
    updatedAt: string;
}

// Driver Types
export interface Driver {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    avatar: string | null;
    vehicleType: 'bike' | 'motorcycle' | 'car';
    vehiclePlate: string;
    isOnline: boolean;
    isApproved: boolean;
    currentLat: number | null;
    currentLng: number | null;
    rating: number;
    totalDeliveries: number;
    createdAt: string;
}

// Review Types
export interface Review {
    id: string;
    orderId: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    restaurantId: string;
    driverId: string | null;
    foodRating: number;
    deliveryRating: number | null;
    comment: string | null;
    reply: string | null;
    repliedAt: string | null;
    createdAt: string;
}

// Stats Types
export interface DashboardStats {
    todayOrders: number;
    todayRevenue: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    pendingOrders: number;
    ordersTrend: number; // percentage
    revenueTrend: number; // percentage
}

export interface BestSellingFood {
    foodId: string;
    foodName: string;
    foodImage: string | null;
    totalOrders: number;
    revenue: number;
}

// Notification Types
export interface AppNotification {
    id: string;
    type: 'order' | 'review' | 'system' | 'payment';
    title: string;
    message: string;
    isRead: boolean;
    data: Record<string, unknown>;
    createdAt: string;
}

// Auth Types
export interface LoginRequest {
    phone: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    restaurant: Restaurant | null;
}

export interface RegisterRestaurantRequest {
    ownerName: string;
    phone: string;
    email: string;
    password: string;
    restaurantName: string;
    restaurantAddress: string;
    restaurantPhone: string;
}
