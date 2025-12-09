// Driver Types
export interface BankInfo {
    bankId: string;
    accountNumber: string;
    accountHolder: string;
}

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
    bankInfo?: BankInfo;
}

// Order Types for Driver
export type DeliveryStatus = 'pending_pickup' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    foodName: string;
    quantity: number;
    notes: string | null;
}

export interface DeliveryOrder {
    id: string;
    orderNumber: string;
    status: DeliveryStatus;
    // Restaurant info
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    restaurantPhone: string;
    restaurantLat: number;
    restaurantLng: number;
    // Customer info
    customerId: string;
    customerName: string | null;
    customerPhone: string;
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    deliveryNotes: string | null;
    // Order details
    items: OrderItem[];
    total: number;
    deliveryFee: number;
    // Timing
    estimatedPickupTime: string | null;
    actualPickupTime: string | null;
    estimatedDeliveryTime: string | null;
    actualDeliveryTime: string | null;
    createdAt: string;
}

// Earnings Types
export interface DailyEarnings {
    date: string;
    deliveries: number;
    earnings: number;
    tips: number;
    bonuses: number;
    total: number;
}

export interface EarningsSummary {
    today: number;
    thisWeek: number;
    thisMonth: number;
    totalDeliveries: number;
    averagePerDelivery: number;
    pendingPayout: number;
}

export interface PayoutHistory {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    bankName: string;
    accountNumber: string;
    requestedAt: string;
    completedAt: string | null;
}

// Auth Types
export interface LoginRequest {
    phone: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    driver: Driver;
}

// Notification Types
export interface DriverNotification {
    id: string;
    type: 'new_order' | 'order_cancelled' | 'payment' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    data: Record<string, unknown>;
    createdAt: string;
}

// Location Types
export interface Location {
    lat: number;
    lng: number;
    address?: string;
}

// Stats Types
export interface DriverStats {
    todayDeliveries: number;
    todayEarnings: number;
    weekDeliveries: number;
    weekEarnings: number;
    rating: number;
    completionRate: number;
    averageDeliveryTime: number; // in minutes
}
