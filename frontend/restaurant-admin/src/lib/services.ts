import api, { ApiResponse, PaginatedResponse, uploadFile } from './api';
import { 
    Order, 
    OrderStatus, 
    DashboardStats, 
    BestSellingFood,
    Food,
    FoodCategory,
    Review,
    Restaurant,
    RestaurantHours,
    BankInfo,
    Driver,
    AppNotification,
    LoginRequest,
    LoginResponse
} from '@/types';

// ============ AUTH SERVICES ============
export const authService = {
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return api.post<LoginResponse>('/auth/restaurant/login', data);
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return api.post<void>('/auth/logout', {});
    },

    getProfile: async (): Promise<ApiResponse<{ user: { id: string; phone: string; name: string }; restaurant: Restaurant }>> => {
        return api.get('/auth/profile');
    },

    verifyToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
        return api.get('/auth/verify');
    },
};

// ============ RESTAURANT SERVICES ============
export const restaurantService = {
    getMyRestaurant: async (): Promise<ApiResponse<Restaurant>> => {
        return api.get<Restaurant>('/restaurants/me');
    },

    updateRestaurant: async (
        data: Partial<Restaurant>
    ): Promise<ApiResponse<Restaurant>> => {
        return api.put<Restaurant>('/restaurants/me', data);
    },

    // Alias for updateRestaurant with settings-specific fields
    updateSettings: async (data: {
        restaurantName?: string;
        cuisineType?: string;
        coordinates?: string;
        phone?: string;
        email?: string;
        isActive?: boolean;
        openTime?: string;
        closeTime?: string;
    }): Promise<ApiResponse<Restaurant>> => {
        return api.put<Restaurant>('/restaurants/me', data);
    },

    getSettings: async (): Promise<ApiResponse<{
        restaurantName: string;
        cuisineType: string;
        coordinates: string;
        phone: string;
        email: string;
        isActive: boolean;
        openTime: string;
        closeTime: string;
        logoUrl: string;
        bannerUrl: string;
    }>> => {
        return api.get('/restaurants/me/settings');
    },

    uploadLogo: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadFile('/restaurants/me/logo', formData);
    },

    uploadBanner: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadFile('/restaurants/me/banner', formData);
    },

    uploadCover: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadFile('/restaurants/me/banner', formData);
    },

    getSetupStatus: async (): Promise<ApiResponse<{ 
        completed: boolean;
        step?: number;
    }>> => {
        return api.get('/restaurants/me/setup-status');
    },

    completeSetup: async (data: {
        is24Hours?: boolean | null;
        openTime?: string;
        closeTime?: string;
        bankAccount?: string;
    }): Promise<ApiResponse<Restaurant>> => {
        return api.post<Restaurant>('/restaurants/me/complete-setup', data);
    },

    getHours: async (): Promise<ApiResponse<RestaurantHours[]>> => {
        return api.get<RestaurantHours[]>('/restaurants/me/hours');
    },

    updateHours: async (
        hours: Partial<RestaurantHours>[]
    ): Promise<ApiResponse<RestaurantHours[]>> => {
        return api.put<RestaurantHours[]>('/restaurants/me/hours', { hours });
    },

    getBankInfo: async (): Promise<ApiResponse<BankInfo>> => {
        return api.get<BankInfo>('/restaurants/me/bank');
    },

    updateBankInfo: async (
        data: Partial<BankInfo>
    ): Promise<ApiResponse<BankInfo>> => {
        return api.put<BankInfo>('/restaurants/me/bank', data);
    },

    toggleOpen: async (
        isOpen: boolean
    ): Promise<ApiResponse<{ isOpen: boolean }>> => {
        return api.patch('/restaurants/me/status', { isOpen });
    },
};

// ============ DASHBOARD SERVICES ============
export const dashboardService = {
    getStats: async (period?: string): Promise<ApiResponse<DashboardStats>> => {
        const query = period ? `?period=${period}` : '';
        return api.get<DashboardStats>(`/dashboard/restaurant${query}`);
    },

    getBestSelling: async (limit?: number): Promise<ApiResponse<BestSellingFood[]>> => {
        const query = limit ? `?limit=${limit}` : '';
        return api.get<BestSellingFood[]>(`/dashboard/restaurant${query}`);
    },

    getRecentOrders: async (limit?: number): Promise<ApiResponse<Order[]>> => {
        const query = limit ? `?limit=${limit}` : '';
        return api.get<Order[]>(`/dashboard/restaurant${query}`);
    },
};

// ============ MENU SERVICES ============
export const menuService = {
    getCategories: async (): Promise<ApiResponse<FoodCategory[]>> => {
        return api.get<FoodCategory[]>('/menu/categories');
    },

    createCategory: async (name: string): Promise<ApiResponse<FoodCategory>> => {
        return api.post<FoodCategory>('/menu/categories', { name });
    },

    updateCategory: async (id: string, name: string): Promise<ApiResponse<FoodCategory>> => {
        return api.put<FoodCategory>(`/menu/categories/${id}`, { name });
    },

    deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/menu/categories/${id}`);
    },

    getFoods: async (params?: { 
        categoryId?: string; 
        search?: string; 
        page?: number; 
        limit?: number;
        isAvailable?: boolean;
    }): Promise<ApiResponse<PaginatedResponse<Food>>> => {
        const searchParams = new URLSearchParams();
        if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Food>>(`/menu/foods${query}`);
    },

    getFood: async (id: string): Promise<ApiResponse<Food>> => {
        return api.get<Food>(`/menu/foods/${id}`);
    },

    createFood: async (data: Partial<Food>): Promise<ApiResponse<Food>> => {
        return api.post<Food>('/menu/foods', data);
    },

    updateFood: async (id: string, data: Partial<Food>): Promise<ApiResponse<Food>> => {
        return api.put<Food>(`/menu/foods/${id}`, data);
    },

    deleteFood: async (id: string): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/menu/foods/${id}`);
    },

    toggleFoodAvailability: async (id: string, isAvailable: boolean): Promise<ApiResponse<Food>> => {
        return api.patch<Food>(`/menu/foods/${id}/availability`, { isAvailable });
    },

    uploadFoodImage: async (id: string, file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadFile(`/menu/foods/${id}/image`, formData);
    },
};

// ============ ORDER SERVICES ============
export const orderService = {
    getOrders: async (params?: {
        status?: OrderStatus | OrderStatus[];
        page?: number;
        limit?: number;
        search?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
        const searchParams = new URLSearchParams();
        if (params?.status) {
            const statuses = Array.isArray(params.status) ? params.status : [params.status];
            statuses.forEach(s => searchParams.append('status', s));
        }
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Order>>(`/orders${query}`);
    },

    getOrder: async (id: string): Promise<ApiResponse<Order>> => {
        return api.get<Order>(`/orders/${id}`);
    },

    acceptOrder: async (id: string, estimatedTime?: number): Promise<ApiResponse<Order>> => {
        return api.post<Order>(`/orders/${id}/accept`, { estimatedTime });
    },

    rejectOrder: async (id: string, reason: string): Promise<ApiResponse<Order>> => {
        return api.post<Order>(`/orders/${id}/reject`, { reason });
    },

    markReady: async (id: string): Promise<ApiResponse<Order>> => {
        return api.post<Order>(`/orders/${id}/ready`, {});
    },

    assignDriver: async (orderId: string, driverId: string): Promise<ApiResponse<Order>> => {
        return api.post<Order>(`/orders/${orderId}/assign-driver`, { driverId });
    },

    getOrderStats: async (): Promise<ApiResponse<{
        pending: number;
        preparing: number;
        ready: number;
        delivering: number;
        completed: number;
        cancelled: number;
    }>> => {
        return api.get('/orders/stats/summary');
    },
};

// ============ DRIVER SERVICES ============
export const driverService = {
    getAvailableDrivers: async (params?: {
        lat?: number;
        lng?: number;
        radius?: number; // in km
    }): Promise<ApiResponse<Driver[]>> => {
        const searchParams = new URLSearchParams();
        if (params?.lat) searchParams.append('lat', params.lat.toString());
        if (params?.lng) searchParams.append('lng', params.lng.toString());
        if (params?.radius) searchParams.append('radius', params.radius.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<Driver[]>(`/drivers/available${query}`);
    },

    getDriver: async (id: string): Promise<ApiResponse<Driver>> => {
        return api.get<Driver>(`/drivers/${id}`);
    },
};

// ============ REVIEW SERVICES ============
export const reviewService = {
    getReviews: async (params?: {
        page?: number;
        limit?: number;
        rating?: number;
        hasReply?: boolean;
    }): Promise<ApiResponse<PaginatedResponse<Review>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.rating) searchParams.append('rating', params.rating.toString());
        if (params?.hasReply !== undefined) searchParams.append('hasReply', params.hasReply.toString());
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<Review>>(`/reviews${query}`);
    },

    replyToReview: async (id: string, reply: string): Promise<ApiResponse<Review>> => {
        return api.post<Review>(`/reviews/${id}/reply`, { reply });
    },

    getReviewStats: async (): Promise<ApiResponse<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { rating: number; count: number }[];
    }>> => {
        return api.get('/reviews/stats/summary');
    },
};

// ============ NOTIFICATION SERVICES ============
export const notificationService = {
    getNotifications: async (params?: {
        page?: number;
        limit?: number;
        unreadOnly?: boolean;
    }): Promise<ApiResponse<PaginatedResponse<AppNotification>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
        
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return api.get<PaginatedResponse<AppNotification>>(`/notifications${query}`);
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
