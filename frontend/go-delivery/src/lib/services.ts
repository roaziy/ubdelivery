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
        return api.get('/drivers/me/profile');
    },

    verifyToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
        return api.get('/auth/me');
    },

    register: async (data: {
        name: string;
        phone: string;
        email?: string;
        password: string;
        vehicleType: string;
        vehiclePlate: string;
    }): Promise<ApiResponse<{ message: string }>> => {
        return api.post('/applications/driver', data);
    },
};

// ============ DRIVER PROFILE SERVICES ============
export const profileService = {
    updateProfile: async (data: Partial<Driver>): Promise<ApiResponse<Driver>> => {
        return api.put<Driver>('/drivers/me/profile', data);
    },

    uploadAvatar: async (formData: FormData): Promise<ApiResponse<{ url: string }>> => {
        const token = typeof window !== 'undefined' 
            ? sessionStorage.getItem('driver_token') 
            : null;
        
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/drivers/me/avatar`, 
                {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                }
            );
            const data = await response.json();
            
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Зураг хадгалахад алдаа гарлаа'
                };
            }
            
            return {
                success: true,
                data: data.data || { url: data.url }
            };
        } catch (error) {
            console.error('Avatar upload error:', error);
            return {
                success: false,
                error: 'Сүлжээний алдаа. Дахин оролдоно уу.'
            };
        }
    },

    updateBankInfo: async (data: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }): Promise<ApiResponse<void>> => {
        return api.put('/drivers/me/bank', data);
    },

    getBankInfo: async (): Promise<ApiResponse<{
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }>> => {
        return api.get('/drivers/me/bank');
    },

    toggleOnlineStatus: async (isAvailable: boolean): Promise<ApiResponse<{ isAvailable: boolean }>> => {
        return api.patch('/drivers/me/availability', { isAvailable });
    },

    updateLocation: async (location: Location): Promise<ApiResponse<void>> => {
        return api.patch('/drivers/me/location', location);
    },
};

// ============ DELIVERY SERVICES ============
export const deliveryService = {
    getAvailableOrders: async (): Promise<ApiResponse<DeliveryOrder[]>> => {
        return api.get<DeliveryOrder[]>('/drivers/me/available-orders');
    },

    getActiveDelivery: async (): Promise<ApiResponse<DeliveryOrder | null>> => {
        return api.get<DeliveryOrder | null>('/orders?status=ready,picked_up');
    },

    acceptOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.post<DeliveryOrder>(`/drivers/me/accept-order/${orderId}`, {});
    },

    rejectOrder: async (orderId: string, reason: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/orders/${orderId}/reject`, { reason });
    },

    pickupOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.post<DeliveryOrder>(`/orders/${orderId}/pickup`, {});
    },

    completeDelivery: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.post<DeliveryOrder>(`/orders/${orderId}/deliver`, {});
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
        if (params?.dateFrom) searchParams.append('startDate', params.dateFrom);
        if (params?.dateTo) searchParams.append('endDate', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<DeliveryOrder>>(`/orders${query}`);
    },

    getOrder: async (orderId: string): Promise<ApiResponse<DeliveryOrder>> => {
        return api.get<DeliveryOrder>(`/orders/${orderId}`);
    },
};

// ============ EARNINGS SERVICES ============
export const earningsService = {
    getSummary: async (): Promise<ApiResponse<EarningsSummary>> => {
        return api.get<EarningsSummary>('/drivers/me/earnings');
    },

    getDailyEarnings: async (params?: {
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<DailyEarnings[]>> => {
        const searchParams = new URLSearchParams();
        if (params?.dateFrom) searchParams.append('startDate', params.dateFrom);
        if (params?.dateTo) searchParams.append('endDate', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<DailyEarnings[]>(`/drivers/me/earnings${query}`);
    },

    requestPayout: async (amount: number): Promise<ApiResponse<PayoutHistory>> => {
        return api.post<PayoutHistory>('/drivers/me/payout', { amount });
    },

    getPayoutHistory: async (params?: {
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<PayoutHistory>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<PayoutHistory>>(`/drivers/me/payouts${query}`);
    },
};

// ============ STATS SERVICES ============
export const statsService = {
    getStats: async (): Promise<ApiResponse<DriverStats>> => {
        return api.get<DriverStats>('/drivers/me/stats');
    },

    getDashboard: async (): Promise<ApiResponse<DriverStats>> => {
        return api.get<DriverStats>('/dashboard/driver');
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
        return api.get<PaginatedResponse<DriverNotification>>(`/notifications${query}`);
    },

    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        return api.patch<void>(`/notifications/${id}/read`, {});
    },

    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        return api.patch<void>('/notifications/read-all', {});
    },

    getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
        return api.get('/notifications/unread-count');
    },
};
