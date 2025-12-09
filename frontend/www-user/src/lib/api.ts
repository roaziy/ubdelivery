import { 
    ApiResponse, 
    Restaurant, 
    FoodItem, 
    FoodCategory, 
    Deal, 
    Cart, 
    CartItem, 
    Order, 
    User,
    Review,
    PaginatedResponse,
    SearchParams
} from './types';

// Base API URL - will be replaced with actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function fetchApi<T>(
    endpoint: string, 
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add auth token if exists
                ...(typeof window !== 'undefined' && sessionStorage.getItem('authToken') 
                    ? { 'Authorization': `Bearer ${sessionStorage.getItem('authToken')}` }
                    : {}
                ),
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Алдаа гарлаа' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: 'Сервертэй холбогдоход алдаа гарлаа' };
    }
}

// ============ AUTH SERVICES ============
export const AuthService = {
    // Send OTP to phone
    sendOtp: async (phone: string): Promise<ApiResponse<{ message: string }>> => {
        return fetchApi('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });
    },

    // Verify OTP and login
    verifyOtp: async (phone: string, code: string): Promise<ApiResponse<{ token: string; user: User }>> => {
        return fetchApi('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phone, code }),
        });
    },

    // Get current user
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        return fetchApi('/auth/me');
    },

    // Update user profile
    updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
        return fetchApi('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Logout
    logout: async (): Promise<ApiResponse<void>> => {
        return fetchApi('/auth/logout', { method: 'POST' });
    },

    // Delete account
    deleteAccount: async (): Promise<ApiResponse<void>> => {
        return fetchApi('/auth/delete', { method: 'DELETE' });
    },
};

// ============ RESTAURANT SERVICES ============
export const RestaurantService = {
    // Get all restaurants with pagination
    getAll: async (params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set('q', params.query);
        if (params?.category) queryParams.set('category', params.category);
        if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
        
        return fetchApi(`/restaurants?${queryParams.toString()}`);
    },

    // Get featured restaurants
    getFeatured: async (): Promise<ApiResponse<Restaurant[]>> => {
        return fetchApi('/restaurants/featured');
    },

    // Get single restaurant by ID
    getById: async (id: string): Promise<ApiResponse<Restaurant>> => {
        return fetchApi(`/restaurants/${id}`);
    },

    // Get restaurant menu
    getMenu: async (id: string): Promise<ApiResponse<FoodItem[]>> => {
        return fetchApi(`/restaurants/${id}/menu`);
    },

    // Search restaurants
    search: async (query: string): Promise<ApiResponse<Restaurant[]>> => {
        return fetchApi(`/restaurants/search?q=${encodeURIComponent(query)}`);
    },
};

// ============ FOOD SERVICES ============
export const FoodService = {
    // Get all food items with pagination
    getAll: async (params?: SearchParams): Promise<ApiResponse<PaginatedResponse<FoodItem>>> => {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set('q', params.query);
        if (params?.category) queryParams.set('category', params.category);
        if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
        
        return fetchApi(`/foods?${queryParams.toString()}`);
    },

    // Get featured/popular foods
    getFeatured: async (): Promise<ApiResponse<FoodItem[]>> => {
        return fetchApi('/foods/featured');
    },

    // Get single food item
    getById: async (id: string): Promise<ApiResponse<FoodItem>> => {
        return fetchApi(`/foods/${id}`);
    },

    // Get food categories
    getCategories: async (): Promise<ApiResponse<FoodCategory[]>> => {
        return fetchApi('/foods/categories');
    },

    // Search foods
    search: async (query: string): Promise<ApiResponse<FoodItem[]>> => {
        return fetchApi(`/foods/search?q=${encodeURIComponent(query)}`);
    },
};

// ============ DEAL SERVICES ============
export const DealService = {
    // Get active deals
    getActive: async (): Promise<ApiResponse<Deal[]>> => {
        return fetchApi('/deals/active');
    },

    // Get deal by ID
    getById: async (id: string): Promise<ApiResponse<Deal>> => {
        return fetchApi(`/deals/${id}`);
    },
};

// ============ CART SERVICES ============
export const CartService = {
    // Get current cart
    get: async (): Promise<ApiResponse<Cart>> => {
        return fetchApi('/cart');
    },

    // Add item to cart
    addItem: async (item: Omit<CartItem, 'id'>): Promise<ApiResponse<Cart>> => {
        return fetchApi('/cart/items', {
            method: 'POST',
            body: JSON.stringify(item),
        });
    },

    // Add food item by ID with quantity
    addFood: async (foodId: number, quantity: number = 1): Promise<ApiResponse<Cart>> => {
        return fetchApi('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ foodId, quantity }),
        });
    },

    // Add deal to cart
    addDeal: async (dealId: number, quantity: number = 1): Promise<ApiResponse<Cart>> => {
        return fetchApi('/cart/deals', {
            method: 'POST',
            body: JSON.stringify({ dealId, quantity }),
        });
    },

    // Update item quantity
    updateQuantity: async (itemId: string, quantity: number): Promise<ApiResponse<Cart>> => {
        return fetchApi(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    },

    // Remove item from cart
    removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
        return fetchApi(`/cart/items/${itemId}`, { method: 'DELETE' });
    },

    // Clear cart
    clear: async (): Promise<ApiResponse<void>> => {
        return fetchApi('/cart', { method: 'DELETE' });
    },

    // Apply coupon
    applyCoupon: async (code: string): Promise<ApiResponse<Cart>> => {
        return fetchApi('/cart/coupon', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },
};

// ============ ORDER SERVICES ============
export const OrderService = {
    // Create new order
    create: async (orderData: {
        deliveryAddress: string;
        floor?: string;
        doorNumber?: string;
        doorCode?: string;
        notes?: string;
        paymentMethod: string;
    }): Promise<ApiResponse<Order>> => {
        return fetchApi('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Get user's orders
    getMyOrders: async (params?: { page?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.status) queryParams.set('status', params.status);
        
        return fetchApi(`/orders?${queryParams.toString()}`);
    },

    // Get active orders (in progress)
    getActive: async (): Promise<ApiResponse<Order[]>> => {
        return fetchApi('/orders/active');
    },

    // Get order by ID
    getById: async (id: string): Promise<ApiResponse<Order>> => {
        return fetchApi(`/orders/${id}`);
    },

    // Get order tracking
    getTracking: async (id: string): Promise<ApiResponse<Order>> => {
        return fetchApi(`/orders/${id}/tracking`);
    },

    // Cancel order
    cancel: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
        return fetchApi(`/orders/${id}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },

    // Reorder (add previous order items to cart)
    reorder: async (id: string): Promise<ApiResponse<Cart>> => {
        return fetchApi(`/orders/${id}/reorder`, { method: 'POST' });
    },
};

// ============ REVIEW SERVICES ============
export const ReviewService = {
    // Submit review for order
    submit: async (orderId: string, review: {
        foodRating: number;
        deliveryRating: number;
        comment?: string;
    }): Promise<ApiResponse<Review>> => {
        return fetchApi(`/orders/${orderId}/review`, {
            method: 'POST',
            body: JSON.stringify(review),
        });
    },

    // Get restaurant reviews
    getRestaurantReviews: async (restaurantId: string): Promise<ApiResponse<Review[]>> => {
        return fetchApi(`/restaurants/${restaurantId}/reviews`);
    },
};

// ============ NOTIFICATION SERVICES ============
export const NotificationService = {
    // Get notifications
    getAll: async (): Promise<ApiResponse<Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: string;
    }>>> => {
        return fetchApi('/notifications');
    },

    // Mark as read
    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        return fetchApi(`/notifications/${id}/read`, { method: 'POST' });
    },

    // Mark all as read
    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        return fetchApi('/notifications/read-all', { method: 'POST' });
    },
};

// ============ ALIASES FOR COMPATIBILITY ============
export const CartAPI = CartService;
export const FoodAPI = FoodService;
export const RestaurantAPI = RestaurantService;
export const DealAPI = DealService;
export const OrderAPI = OrderService;
export const UserAPI = AuthService;
