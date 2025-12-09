import api, { ApiResponse, PaginatedResponse } from './api';
import { 
    Driver,
    DeliveryOrder,
    DeliveryStatus,
    EarningsSummary,
    DailyEarnings,
    PayoutHistory,
    DriverStats,
    DriverNotification,
    LoginRequest,
    LoginResponse,
    Location
} from '@/types';

// ============ AUTH SERVICES ============
export const authService = {
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return api.post<LoginResponse>('/auth/driver/login', data);
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return api.post<void>('/auth/logout', {});
    },

    getProfile: async (): Promise<ApiResponse<Driver>> => {
        return api.get('/driver/profile');
    },

    verifyToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
        return api.get('/auth/verify');
    },

    register: async (data: {
        name: string;
        phone: string;
        email?: string;
        password: string;
        vehicleType: string;
        vehiclePlate: string;
    }): Promise<ApiResponse<{ message: string }>> => {
        return api.post('/auth/driver/register', data);
    },
};

// ============ DRIVER PROFILE SERVICES ============
export const profileService = {
    updateProfile: async (data: Partial<Driver>): Promise<ApiResponse<Driver>> => {
        return api.put<Driver>('/driver/profile', data);
    },

    uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        return api.post('/driver/profile/avatar', { file: file.name });
    },

    updateBankInfo: async (data: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }): Promise<ApiResponse<void>> => {
        return api.put('/driver/bank', data);
    },

    getBankInfo: async (): Promise<ApiResponse<{
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }>> => {
        return api.get('/driver/bank');
    },

    toggleOnlineStatus: async (isOnline: boolean): Promise<ApiResponse<{ isOnline: boolean }>> => {
        return api.patch('/driver/status', { isOnline });
    },

    updateLocation: async (location: Location): Promise<ApiResponse<void>> => {
        return api.patch('/driver/location', location);
    },
};

// ============ DELIVERY SERVICES ============
export const deliveryService = {
    getAvailableOrders: async (): Promise<ApiResponse<DeliveryOrder[]>> => {
        return api.get<DeliveryOrder[]>('/driver/orders/available');
    },

    getActiveDelivery: async (): Promise<ApiResponse<DeliveryOrder | null>> => {
        return api.get<DeliveryOrder | null>('/driver/orders/active');
    },

    acceptOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.post<DeliveryOrder>(`/driver/orders/${orderId}/accept`, {});
    },

    rejectOrder: async (orderId: string, reason: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/driver/orders/${orderId}/reject`, { reason });
    },

    pickupOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.patch<DeliveryOrder>(`/driver/orders/${orderId}/pickup`, {});
    },

    completeDelivery: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.patch<DeliveryOrder>(`/driver/orders/${orderId}/complete`, {});
    },

    getDeliveryHistory: async (params?: {
        page?: number;
        limit?: number;
        status?: DeliveryStatus;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<PaginatedResponse<DeliveryOrder>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.status) searchParams.append('status', params.status);
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<DeliveryOrder>>(`/driver/orders/history${query}`);
    },

    getOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.get<DeliveryOrder>(`/driver/orders/${orderId}`);
    },
};

// ============ EARNINGS SERVICES ============
export const earningsService = {
    getSummary: async (): Promise<ApiResponse<EarningsSummary>> => {
        return api.get<EarningsSummary>('/driver/earnings/summary');
    },

    getDailyEarnings: async (params?: {
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<DailyEarnings[]>> => {
        const searchParams = new URLSearchParams();
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<DailyEarnings[]>(`/driver/earnings/daily${query}`);
    },

    requestPayout: async (amount: number): Promise<ApiResponse<PayoutHistory>> => {
        return api.post<PayoutHistory>('/driver/earnings/payout', { amount });
    },

    getPayoutHistory: async (params?: {
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<PayoutHistory>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<PayoutHistory>>(`/driver/earnings/payouts${query}`);
    },
};

// ============ STATS SERVICES ============
export const statsService = {
    getStats: async (): Promise<ApiResponse<DriverStats>> => {
        return api.get<DriverStats>('/driver/stats');
    },
};

// ============ NOTIFICATION SERVICES ============
export const notificationService = {
    getNotifications: async (params?: {
        page?: number;
        limit?: number;
        unreadOnly?: boolean;
    }): Promise<ApiResponse<PaginatedResponse<DriverNotification>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<DriverNotification>>(`/driver/notifications${query}`);
    },

    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        return api.patch<void>(`/driver/notifications/${id}/read`, {});
    },

    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        return api.patch<void>('/driver/notifications/read-all', {});
    },

    getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
        return api.get('/driver/notifications/unread-count');
    },
};
