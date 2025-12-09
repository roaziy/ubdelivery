import api, { ApiResponse, PaginatedResponse } from './api';
import { 
    AdminUser,
    RestaurantApplication,
    DriverApplication,
    Restaurant,
    Driver,
    User,
    Order,
    RefundRequest,
    Payout,
    PlatformStats,
    DailyStats,
    LoginRequest,
    LoginResponse,
    ApplicationStatus,
    RefundStatus,
    PayoutStatus
} from '@/types';

// ============ AUTH SERVICES ============
export const authService = {
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return api.post<LoginResponse>('/admin/auth/login', data);
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return api.post<void>('/admin/auth/logout', {});
    },

    getProfile: async (): Promise<ApiResponse<AdminUser>> => {
        return api.get('/admin/profile');
    },
};

// ============ RESTAURANT APPLICATION SERVICES ============
export const restaurantApplicationService = {
    getApplications: async (params?: {
        status?: ApplicationStatus;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<RestaurantApplication>>> => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<RestaurantApplication>>(`/admin/restaurants/applications${query}`);
    },

    getApplication: async (id: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.get<RestaurantApplication>(`/admin/restaurants/applications/${id}`);
    },

    approveApplication: async (id: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.patch<RestaurantApplication>(`/admin/restaurants/applications/${id}/approve`, {});
    },

    rejectApplication: async (id: string, reason: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.patch<RestaurantApplication>(`/admin/restaurants/applications/${id}/reject`, { reason });
    },
};

// ============ DRIVER APPLICATION SERVICES ============
export const driverApplicationService = {
    getApplications: async (params?: {
        status?: ApplicationStatus;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<DriverApplication>>> => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<DriverApplication>>(`/admin/drivers/applications${query}`);
    },

    getApplication: async (id: string): Promise<ApiResponse<DriverApplication>> => {
        return api.get<DriverApplication>(`/admin/drivers/applications/${id}`);
    },

    approveApplication: async (id: string): Promise<ApiResponse<DriverApplication>> => {
        return api.patch<DriverApplication>(`/admin/drivers/applications/${id}/approve`, {});
    },

    rejectApplication: async (id: string, reason: string): Promise<ApiResponse<DriverApplication>> => {
        return api.patch<DriverApplication>(`/admin/drivers/applications/${id}/reject`, { reason });
    },
};

// ============ RESTAURANT MANAGEMENT SERVICES ============
export const restaurantService = {
    getRestaurants: async (params?: {
        search?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Restaurant>>(`/admin/restaurants${query}`);
    },

    getRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
        return api.get<Restaurant>(`/admin/restaurants/${id}`);
    },

    toggleActive: async (id: string, isActive: boolean): Promise<ApiResponse<Restaurant>> => {
        return api.patch<Restaurant>(`/admin/restaurants/${id}/status`, { isActive });
    },
};

// ============ DRIVER MANAGEMENT SERVICES ============
export const driverService = {
    getDrivers: async (params?: {
        search?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Driver>>> => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Driver>>(`/admin/drivers${query}`);
    },

    getDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        return api.get<Driver>(`/admin/drivers/${id}`);
    },

    toggleActive: async (id: string, isActive: boolean): Promise<ApiResponse<Driver>> => {
        return api.patch<Driver>(`/admin/drivers/${id}/status`, { isActive });
    },
};

// ============ USER SERVICES ============
export const userService = {
    getUsers: async (params?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<User>>> => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<User>>(`/admin/users${query}`);
    },

    getUser: async (id: string): Promise<ApiResponse<User>> => {
        return api.get<User>(`/admin/users/${id}`);
    },
};

// ============ ORDER SERVICES ============
export const orderService = {
    getOrders: async (params?: {
        search?: string;
        status?: string;
        restaurantId?: string;
        driverId?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.restaurantId) searchParams.append('restaurantId', params.restaurantId);
        if (params?.driverId) searchParams.append('driverId', params.driverId);
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Order>>(`/admin/orders${query}`);
    },

    getOrder: async (id: string): Promise<ApiResponse<Order>> => {
        return api.get<Order>(`/admin/orders/${id}`);
    },
};

// ============ REFUND SERVICES ============
export const refundService = {
    getRefunds: async (params?: {
        status?: RefundStatus;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<RefundRequest>>> => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<RefundRequest>>(`/admin/refunds${query}`);
    },

    getRefund: async (id: string): Promise<ApiResponse<RefundRequest>> => {
        return api.get<RefundRequest>(`/admin/refunds/${id}`);
    },

    approveRefund: async (id: string, notes?: string): Promise<ApiResponse<RefundRequest>> => {
        return api.patch<RefundRequest>(`/admin/refunds/${id}/approve`, { notes });
    },

    rejectRefund: async (id: string, notes: string): Promise<ApiResponse<RefundRequest>> => {
        return api.patch<RefundRequest>(`/admin/refunds/${id}/reject`, { notes });
    },
};

// ============ PAYOUT SERVICES ============
export const payoutService = {
    getPayouts: async (params?: {
        recipientType?: 'restaurant' | 'driver';
        status?: PayoutStatus;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Payout>>> => {
        const searchParams = new URLSearchParams();
        if (params?.recipientType) searchParams.append('recipientType', params.recipientType);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Payout>>(`/admin/payouts${query}`);
    },

    processPayout: async (id: string): Promise<ApiResponse<Payout>> => {
        return api.patch<Payout>(`/admin/payouts/${id}/process`, {});
    },

    completePayout: async (id: string): Promise<ApiResponse<Payout>> => {
        return api.patch<Payout>(`/admin/payouts/${id}/complete`, {});
    },

    failPayout: async (id: string, notes: string): Promise<ApiResponse<Payout>> => {
        return api.patch<Payout>(`/admin/payouts/${id}/fail`, { notes });
    },

    createManualPayout: async (data: {
        recipientType: 'restaurant' | 'driver';
        recipientId: string;
        amount: number;
    }): Promise<ApiResponse<Payout>> => {
        return api.post<Payout>('/admin/payouts', data);
    },
};

// ============ ANALYTICS SERVICES ============
export const analyticsService = {
    getPlatformStats: async (): Promise<ApiResponse<PlatformStats>> => {
        return api.get<PlatformStats>('/admin/analytics/stats');
    },

    getDailyStats: async (params?: {
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<DailyStats[]>> => {
        const searchParams = new URLSearchParams();
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<DailyStats[]>(`/admin/analytics/daily${query}`);
    },
};

// ============ MOCK-COMPATIBLE WRAPPER SERVICES ============
// These provide a simple interface with mock data fallback for development

import {
    mockAdminUser,
    mockRestaurantApplications,
    mockDriverApplications,
    mockRestaurants,
    mockDrivers,
    mockUsers,
    mockOrders,
    mockRefundRequests,
    mockPayouts,
    mockPlatformStats,
    mockRevenueData,
} from './mockData';
import { RevenueData } from '@/types';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
    login: async (data: LoginRequest): Promise<ApiResponse<AdminUser>> => {
        await delay(500);
        // Mock login - accept any username containing 'admin'
        if (data.username.includes('admin')) {
            return { success: true, data: mockAdminUser };
        }
        return { success: false, error: 'Invalid credentials' };
    },
};

export const StatsService = {
    getPlatformStats: async (): Promise<ApiResponse<PlatformStats>> => {
        await delay(300);
        return { success: true, data: mockPlatformStats };
    },
};

export const ApplicationService = {
    getRestaurantApplications: async (): Promise<ApiResponse<RestaurantApplication[]>> => {
        await delay(300);
        return { success: true, data: mockRestaurantApplications };
    },

    getDriverApplications: async (): Promise<ApiResponse<DriverApplication[]>> => {
        await delay(300);
        return { success: true, data: mockDriverApplications };
    },

    approveRestaurant: async (id: string): Promise<ApiResponse<RestaurantApplication>> => {
        await delay(500);
        const app = mockRestaurantApplications.find(a => a.id === id);
        if (app) {
            return { success: true, data: { ...app, status: 'approved' } };
        }
        return { success: false, error: 'Application not found' };
    },

    rejectRestaurant: async (id: string, reason: string): Promise<ApiResponse<RestaurantApplication>> => {
        await delay(500);
        const app = mockRestaurantApplications.find(a => a.id === id);
        if (app) {
            return { success: true, data: { ...app, status: 'rejected', rejectionReason: reason } };
        }
        return { success: false, error: 'Application not found' };
    },

    approveDriver: async (id: string): Promise<ApiResponse<DriverApplication>> => {
        await delay(500);
        const app = mockDriverApplications.find(a => a.id === id);
        if (app) {
            return { success: true, data: { ...app, status: 'approved' } };
        }
        return { success: false, error: 'Application not found' };
    },

    rejectDriver: async (id: string, reason: string): Promise<ApiResponse<DriverApplication>> => {
        await delay(500);
        const app = mockDriverApplications.find(a => a.id === id);
        if (app) {
            return { success: true, data: { ...app, status: 'rejected', rejectionReason: reason } };
        }
        return { success: false, error: 'Application not found' };
    },
};

export const RestaurantService = {
    getAllRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
        await delay(300);
        return { success: true, data: mockRestaurants };
    },

    suspendRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
        await delay(500);
        const restaurant = mockRestaurants.find(r => r.id === id);
        if (restaurant) {
            return { success: true, data: { ...restaurant, status: 'suspended' } };
        }
        return { success: false, error: 'Restaurant not found' };
    },

    activateRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
        await delay(500);
        const restaurant = mockRestaurants.find(r => r.id === id);
        if (restaurant) {
            return { success: true, data: { ...restaurant, status: 'active' } };
        }
        return { success: false, error: 'Restaurant not found' };
    },
};

export const DriverService = {
    getAllDrivers: async (): Promise<ApiResponse<Driver[]>> => {
        await delay(300);
        return { success: true, data: mockDrivers };
    },

    suspendDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        await delay(500);
        const driver = mockDrivers.find(d => d.id === id);
        if (driver) {
            return { success: true, data: { ...driver, status: 'suspended' } };
        }
        return { success: false, error: 'Driver not found' };
    },

    activateDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        await delay(500);
        const driver = mockDrivers.find(d => d.id === id);
        if (driver) {
            return { success: true, data: { ...driver, status: 'active' } };
        }
        return { success: false, error: 'Driver not found' };
    },
};

export const UserService = {
    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
        await delay(300);
        return { success: true, data: mockUsers };
    },

    suspendUser: async (id: string): Promise<ApiResponse<User>> => {
        await delay(500);
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            return { success: true, data: { ...user, status: 'suspended' } };
        }
        return { success: false, error: 'User not found' };
    },

    activateUser: async (id: string): Promise<ApiResponse<User>> => {
        await delay(500);
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            return { success: true, data: { ...user, status: 'active' } };
        }
        return { success: false, error: 'User not found' };
    },
};

export const OrderService = {
    getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
        await delay(300);
        return { success: true, data: mockOrders };
    },
};

export const FinanceService = {
    getRefundRequests: async (): Promise<ApiResponse<RefundRequest[]>> => {
        await delay(300);
        return { success: true, data: mockRefundRequests };
    },

    getPayouts: async (): Promise<ApiResponse<Payout[]>> => {
        await delay(300);
        return { success: true, data: mockPayouts };
    },

    getRevenueData: async (): Promise<ApiResponse<RevenueData[]>> => {
        await delay(300);
        return { success: true, data: mockRevenueData };
    },

    approveRefund: async (id: string): Promise<ApiResponse<RefundRequest>> => {
        await delay(500);
        const refund = mockRefundRequests.find(r => r.id === id);
        if (refund) {
            return { success: true, data: { ...refund, status: 'approved' } };
        }
        return { success: false, error: 'Refund not found' };
    },

    rejectRefund: async (id: string, reason: string): Promise<ApiResponse<RefundRequest>> => {
        await delay(500);
        const refund = mockRefundRequests.find(r => r.id === id);
        if (refund) {
            return { success: true, data: { ...refund, status: 'rejected', adminNotes: reason } };
        }
        return { success: false, error: 'Refund not found' };
    },

    processPayout: async (id: string): Promise<ApiResponse<Payout>> => {
        await delay(500);
        const payout = mockPayouts.find(p => p.id === id);
        if (payout) {
            return { success: true, data: { ...payout, status: 'processing' } };
        }
        return { success: false, error: 'Payout not found' };
    },
};