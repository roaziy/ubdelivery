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
    PayoutStatus,
    RevenueData
} from '@/types';

// ============ AUTH SERVICES ============
export const authService = {
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return api.post<LoginResponse>('/auth/admin/login', data);
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return api.post<void>('/auth/logout', {});
    },

    getProfile: async (): Promise<ApiResponse<AdminUser>> => {
        return api.get('/auth/me');
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<{ message: string }>> => {
        return api.post('/auth/change-password', data);
    },

    updateProfile: async (data: { name?: string; email?: string }): Promise<ApiResponse<AdminUser>> => {
        return api.put('/auth/me', data);
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
        searchParams.append('type', 'restaurant');
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = `?${searchParams.toString()}`;
        return api.get<PaginatedResponse<RestaurantApplication>>(`/applications${query}`);
    },

    getApplication: async (id: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.get<RestaurantApplication>(`/applications/${id}`);
    },

    approveApplication: async (id: string, password?: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.post<RestaurantApplication>(`/applications/${id}/approve`, { password });
    },

    rejectApplication: async (id: string, reason: string): Promise<ApiResponse<RestaurantApplication>> => {
        return api.post<RestaurantApplication>(`/applications/${id}/reject`, { reason });
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
        searchParams.append('type', 'driver');
        if (params?.status) searchParams.append('status', params.status);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = `?${searchParams.toString()}`;
        return api.get<PaginatedResponse<DriverApplication>>(`/applications${query}`);
    },

    getApplication: async (id: string): Promise<ApiResponse<DriverApplication>> => {
        return api.get<DriverApplication>(`/applications/${id}`);
    },

    approveApplication: async (id: string, password?: string): Promise<ApiResponse<DriverApplication>> => {
        return api.post<DriverApplication>(`/applications/${id}/approve`, { password });
    },

    rejectApplication: async (id: string, reason: string): Promise<ApiResponse<DriverApplication>> => {
        return api.post<DriverApplication>(`/applications/${id}/reject`, { reason });
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
        return api.get<Restaurant>(`/restaurants/${id}`);
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
        if (params?.isActive !== undefined) searchParams.append('status', params.isActive ? 'active' : 'inactive');
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Driver>>(`/drivers${query}`);
    },

    getDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        return api.get<Driver>(`/drivers/${id}`);
    },

    toggleActive: async (id: string, isActive: boolean): Promise<ApiResponse<Driver>> => {
        return api.patch<Driver>(`/drivers/${id}/status`, { isActive });
    },
};

// ============ USER SERVICES ============
export const userService = {
    getUsers: async (params?: {
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<User>>> => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.role) searchParams.append('role', params.role);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<User>>(`/admin/users${query}`);
    },

    getUser: async (id: string): Promise<ApiResponse<User>> => {
        return api.get<User>(`/admin/users/${id}`);
    },

    createUser: async (data: {
        email: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<ApiResponse<User>> => {
        return api.post<User>('/admin/users', data);
    },

    updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
        return api.put<User>(`/admin/users/${id}`, data);
    },

    resetPassword: async (id: string, password?: string): Promise<ApiResponse<{ password: string }>> => {
        return api.post<{ password: string }>(`/admin/users/${id}/reset-password`, { password });
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
        if (params?.dateFrom) searchParams.append('startDate', params.dateFrom);
        if (params?.dateTo) searchParams.append('endDate', params.dateTo);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Order>>(`/orders${query}`);
    },

    getOrder: async (id: string): Promise<ApiResponse<Order>> => {
        return api.get<Order>(`/orders/${id}`);
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
        return api.get<PlatformStats>('/dashboard/admin');
    },

    getDailyStats: async (params?: {
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<DailyStats[]>> => {
        const searchParams = new URLSearchParams();
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<DailyStats[]>(`/dashboard/charts/orders${query}`);
    },

    getFinanceSummary: async (params?: {
        period?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<{
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
        totalDeliveryFees: number;
        averageOrderValue: number;
        platformCommission: number;
    }>> => {
        const searchParams = new URLSearchParams();
        if (params?.period) searchParams.append('period', params.period);
        if (params?.startDate) searchParams.append('startDate', params.startDate);
        if (params?.endDate) searchParams.append('endDate', params.endDate);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get(`/admin/finance/summary${query}`);
    },
};

// ============ REAL API SERVICES (Aliases) ============
// These match the naming convention used in the components

export const AuthService = {
    login: async (data: LoginRequest): Promise<ApiResponse<AdminUser>> => {
        const response = await authService.login(data);
        if (response.success && response.data) {
            // Store token
            sessionStorage.setItem('admin_token', response.data.token);
            sessionStorage.setItem('admin_user', JSON.stringify(response.data.user));
            return { success: true, data: response.data.user as unknown as AdminUser };
        }
        return { success: false, error: response.error };
    },
};

export const StatsService = {
    getPlatformStats: async (): Promise<ApiResponse<PlatformStats>> => {
        return analyticsService.getPlatformStats();
    },
};

export const ApplicationService = {
    getRestaurantApplications: async (): Promise<ApiResponse<RestaurantApplication[]>> => {
        const response = await restaurantApplicationService.getApplications({ status: 'pending' });
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    getDriverApplications: async (): Promise<ApiResponse<DriverApplication[]>> => {
        const response = await driverApplicationService.getApplications({ status: 'pending' });
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    approveRestaurant: async (id: string): Promise<ApiResponse<RestaurantApplication>> => {
        return restaurantApplicationService.approveApplication(id);
    },

    rejectRestaurant: async (id: string, reason: string): Promise<ApiResponse<RestaurantApplication>> => {
        return restaurantApplicationService.rejectApplication(id, reason);
    },

    approveDriver: async (id: string): Promise<ApiResponse<DriverApplication>> => {
        return driverApplicationService.approveApplication(id);
    },

    rejectDriver: async (id: string, reason: string): Promise<ApiResponse<DriverApplication>> => {
        return driverApplicationService.rejectApplication(id, reason);
    },
};

export const RestaurantService = {
    getAllRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
        const response = await restaurantService.getRestaurants();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    suspendRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
        return restaurantService.toggleActive(id, false);
    },

    activateRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
        return restaurantService.toggleActive(id, true);
    },
};

export const DriverService = {
    getAllDrivers: async (): Promise<ApiResponse<Driver[]>> => {
        const response = await driverService.getDrivers();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    suspendDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        return driverService.toggleActive(id, false);
    },

    activateDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        return driverService.toggleActive(id, true);
    },
};

export const UserService = {
    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await userService.getUsers();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    suspendUser: async (id: string): Promise<ApiResponse<User>> => {
        return userService.updateUser(id, { isActive: false } as Partial<User>);
    },

    activateUser: async (id: string): Promise<ApiResponse<User>> => {
        return userService.updateUser(id, { isActive: true } as Partial<User>);
    },
};

export const OrderService = {
    getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
        const response = await orderService.getOrders();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },
};

export const FinanceService = {
    getRefundRequests: async (): Promise<ApiResponse<RefundRequest[]>> => {
        const response = await refundService.getRefunds();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    getPayouts: async (): Promise<ApiResponse<Payout[]>> => {
        const response = await payoutService.getPayouts();
        if (response.success && response.data) {
            return { success: true, data: response.data.items };
        }
        return { success: false, error: response.error };
    },

    getRevenueData: async (): Promise<ApiResponse<RevenueData[]>> => {
        const response = await analyticsService.getDailyStats();
        if (response.success && response.data) {
            // Transform to RevenueData format
            const revenueData: RevenueData[] = response.data.map((item: any) => ({
                month: item.date || item.month || '',
                orderRevenue: item.revenue || item.orderRevenue || 0,
                deliveryFees: item.deliveryFees || 0,
                serviceFees: item.serviceFees || 0,
                totalRevenue: item.revenue || item.totalRevenue || 0,
            }));
            return { success: true, data: revenueData };
        }
        return { success: false, error: response.error };
    },

    approveRefund: async (id: string): Promise<ApiResponse<RefundRequest>> => {
        return refundService.approveRefund(id);
    },

    rejectRefund: async (id: string, reason: string): Promise<ApiResponse<RefundRequest>> => {
        return refundService.rejectRefund(id, reason);
    },

    processPayout: async (id: string): Promise<ApiResponse<Payout>> => {
        return payoutService.processPayout(id);
    },
};
