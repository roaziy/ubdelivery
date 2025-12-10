// Admin User Types
export interface AdminUser {
    id: string;
    name: string;
    username: string;
    email: string;
    role: 'super_admin' | 'admin' | 'support';
    createdAt: string;
}

// Restaurant Application Types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface RestaurantApplication {
    id: string;
    restaurantName: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    cuisineType: string;
    businessLicense: string;
    status: ApplicationStatus;
    createdAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason?: string;
}

// Driver Application Types
export interface DriverApplication {
    id: string;
    driverName: string;
    phone: string;
    email: string;
    address: string;
    vehicleType: 'bike' | 'motorcycle' | 'car';
    vehicleModel: string;
    licensePlate: string;
    driverLicense: string;
    status: ApplicationStatus;
    createdAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason?: string;
}

// Restaurant Types (Active)
export type RestaurantStatus = 'active' | 'suspended' | 'pending';

export interface Restaurant {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    cuisineType: string;
    rating: number;
    reviewCount: number;
    totalOrders: number;
    totalRevenue: number;
    avgDeliveryTime: string;
    status: RestaurantStatus;
    createdAt: string;
}

// Driver Types (Active)
export type DriverStatus = 'active' | 'offline' | 'suspended';

export interface Driver {
    id: string;
    name: string;
    phone: string;
    email: string;
    vehicleType: string;
    vehicleModel: string;
    licensePlate: string;
    rating: number;
    totalDeliveries: number;
    totalEarnings: number;
    completionRate: number;
    status: DriverStatus;
    createdAt: string;
}

// User Types
export type UserStatus = 'active' | 'suspended';

export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
    status: UserStatus;
    createdAt: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    restaurantId: string;
    restaurantName: string;
    driverId?: string;
    driverName?: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    totalAmount: number;
    deliveryAddress: string;
    status: OrderStatus;
    createdAt: string;
    deliveredAt?: string;
}

// Refund Types
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface RefundRequest {
    id: string;
    orderId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    adminNotes?: string;
    createdAt: string;
    processedAt?: string;
}

// Payout Types
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
    id: string;
    restaurantId: string;
    restaurantName: string;
    amount: number;
    period: string;
    bankName: string;
    accountNumber: string;
    status: PayoutStatus;
    createdAt: string;
    paidAt?: string;
}

// Analytics Types
export interface DayStats {
    orders: number;
    revenue: number;
    activeUsers: number;
    activeDrivers: number;
}

export interface PlatformStats {
    today: DayStats;
    week: DayStats;
    month: DayStats;
}

export interface RevenueData {
    month: string;
    orderRevenue: number;
    deliveryFees: number;
    serviceFees: number;
    totalRevenue: number;
}

export interface DailyStats {
    date: string;
    orders: number;
    revenue: number;
    platformRevenue: number;
    newUsers: number;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        phone?: string;
        name: string;
        role: string;
    };
}
