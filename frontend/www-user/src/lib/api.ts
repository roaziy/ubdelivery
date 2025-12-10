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

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
}

// Helper function for API calls
async function fetchApi<T>(
    endpoint: string, 
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            return { 
                success: false, 
                error: data.message || 'Алдаа гарлаа' 
            };
        }

        return { 
            success: true, 
            data: data.data || data 
        };
    } catch (error) {
        console.error('API Error:', error);
        return { 
            success: false, 
            error: 'Сервертэй холбогдоход алдаа гарлаа' 
        };
    }
}

// Helper for form data API calls (file uploads)
async function fetchApiFormData<T>(
    endpoint: string, 
    formData: FormData
): Promise<ApiResponse<T>> {
    try {
        const token = getAuthToken();
        const headers: HeadersInit = {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return { 
                success: false, 
                error: data.message || 'Алдаа гарлаа' 
            };
        }

        return { 
            success: true, 
            data: data.data || data 
        };
    } catch (error) {
        console.error('API Error:', error);
        return { 
            success: false, 
            error: 'Сервертэй холбогдоход алдаа гарлаа' 
        };
    }
}

// ============ AUTH SERVICES ============
export const AuthService = {
    // Verify Firebase OTP token and login/register
    verifyOtp: async (firebaseToken: string, name?: string): Promise<ApiResponse<{ token: string; user: User }>> => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firebaseToken}`
            },
            body: JSON.stringify({ name }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return { success: false, error: data.message || 'Баталгаажуулалт амжилтгүй' };
        }
        
        // Store the JWT token
        if (data.data?.token) {
            sessionStorage.setItem('authToken', data.data.token);
            sessionStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        return { success: true, data: data.data };
    },

    // Get current user
    getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
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
    logout: async (): Promise<void> => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('phoneNumber');
        sessionStorage.removeItem('isLoggedIn');
    },

    // Check if logged in
    isLoggedIn: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!sessionStorage.getItem('authToken');
    },

    // Get stored user
    getStoredUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Delete account
    deleteAccount: async (): Promise<ApiResponse<{ message: string }>> => {
        return fetchApi('/auth/account', { method: 'DELETE' });
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
        if (params?.pageSize) queryParams.set('limit', params.pageSize.toString());
        
        const response = await fetchApi<{ items: Restaurant[]; total: number; page: number; limit: number; totalPages: number }>(`/restaurants?${queryParams.toString()}`);
        
        if (response.success && response.data) {
            // Transform the response to match frontend types
            return {
                success: true,
                data: {
                    items: transformRestaurants(response.data.items),
                    total: response.data.total,
                    page: response.data.page,
                    pageSize: response.data.limit,
                    totalPages: response.data.totalPages
                }
            };
        }
        
        return { success: false, error: response.error };
    },

    // Get single restaurant by ID
    getById: async (id: string): Promise<ApiResponse<Restaurant>> => {
        const response = await fetchApi<Restaurant>(`/restaurants/${id}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformRestaurant(response.data)
            };
        }
        
        return response;
    },

    // Search restaurants
    search: async (query: string): Promise<ApiResponse<Restaurant[]>> => {
        const response = await fetchApi<{ items: Restaurant[] }>(`/restaurants?q=${encodeURIComponent(query)}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformRestaurants(response.data.items)
            };
        }
        
        return { success: false, error: response.error };
    },
};

// ============ FOOD SERVICES ============
export const FoodService = {
    // Get all food items
    getAll: async (params?: SearchParams & { restaurantId?: string }): Promise<ApiResponse<PaginatedResponse<FoodItem>>> => {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set('search', params.query);
        if (params?.category) queryParams.set('categoryId', params.category);
        if (params?.restaurantId) queryParams.set('restaurantId', params.restaurantId);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.pageSize) queryParams.set('limit', params.pageSize.toString());
        
        const response = await fetchApi<{ items: FoodItem[]; total: number; page: number; limit: number; totalPages: number }>(`/menu/foods?${queryParams.toString()}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: {
                    items: transformFoods(response.data.items),
                    total: response.data.total,
                    page: response.data.page,
                    pageSize: response.data.limit,
                    totalPages: response.data.totalPages
                }
            };
        }
        
        return { success: false, error: response.error };
    },

    // Get single food item
    getById: async (id: string): Promise<ApiResponse<FoodItem>> => {
        const response = await fetchApi<FoodItem>(`/menu/foods/${id}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformFood(response.data)
            };
        }
        
        return response;
    },

    // Get food categories
    getCategories: async (): Promise<ApiResponse<FoodCategory[]>> => {
        // For now return static categories since we don't have a global categories endpoint
        return {
            success: true,
            data: [
                { id: 'all', name: 'Бүгд' },
                { id: 'burger', name: 'Бургер' },
                { id: 'pizza', name: 'Пицца' },
                { id: 'chicken', name: 'Тахиа' },
                { id: 'korean', name: 'Солонгос' },
                { id: 'japanese', name: 'Япон' },
                { id: 'chinese', name: 'Хятад' },
                { id: 'mongolian', name: 'Монгол' },
                { id: 'dessert', name: 'Амттан' },
                { id: 'drinks', name: 'Уух зүйл' },
            ]
        };
    },
};

// ============ CART SERVICES ============
export const CartService = {
    // Get current cart
    get: async (): Promise<ApiResponse<Cart>> => {
        const response = await fetchApi<Cart>('/cart');
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformCart(response.data)
            };
        }
        
        return response;
    },

    // Add item to cart
    addItem: async (foodId: string, quantity: number = 1): Promise<ApiResponse<Cart>> => {
        const response = await fetchApi<Cart>('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ foodId, quantity }),
        });
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformCart(response.data)
            };
        }
        
        return response;
    },

    // Update item quantity
    updateQuantity: async (itemId: string, quantity: number): Promise<ApiResponse<Cart>> => {
        return fetchApi(`/cart/items/${itemId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
    },

    // Remove item from cart
    removeItem: async (itemId: string): Promise<ApiResponse<{ message: string }>> => {
        return fetchApi(`/cart/items/${itemId}`, { method: 'DELETE' });
    },

    // Clear cart
    clear: async (): Promise<ApiResponse<{ message: string }>> => {
        return fetchApi('/cart/clear', { method: 'DELETE' });
    },

    // Checkout
    checkout: async (data: {
        deliveryAddress: string;
        deliveryNotes?: string;
        paymentMethod?: string;
    }): Promise<ApiResponse<Order>> => {
        return fetchApi('/cart/checkout', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Add deal to cart (for now, returns success - can be implemented when backend supports it)
    addDeal: async (dealId: number, quantity: number = 1): Promise<ApiResponse<Cart>> => {
        // TODO: Implement deal addition when backend endpoint is available
        // For now, return success to prevent build errors
        return { success: true, data: { items: [], subtotal: 0, deliveryFee: 0, serviceFee: 0, total: 0 } };
    },
};

// ============ ORDER SERVICES ============
export const OrderService = {
    // Get user's orders
    getMyOrders: async (params?: { page?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.status) queryParams.set('status', params.status);
        
        const response = await fetchApi<{ items: Order[]; total: number; page: number; limit: number; totalPages: number }>(`/orders?${queryParams.toString()}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: {
                    items: transformOrders(response.data.items),
                    total: response.data.total,
                    page: response.data.page,
                    pageSize: response.data.limit,
                    totalPages: response.data.totalPages
                }
            };
        }
        
        return { success: false, error: response.error };
    },

    // Get order by ID
    getById: async (id: string): Promise<ApiResponse<Order>> => {
        const response = await fetchApi<Order>(`/orders/${id}`);
        
        if (response.success && response.data) {
            return {
                success: true,
                data: transformOrder(response.data)
            };
        }
        
        return response;
    },

    // Cancel order
    cancel: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
        return fetchApi(`/orders/${id}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
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
        return fetchApi('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                orderId,
                foodRating: review.foodRating,
                deliveryRating: review.deliveryRating,
                comment: review.comment,
            }),
        });
    },

    // Get restaurant reviews
    getRestaurantReviews: async (restaurantId: string): Promise<ApiResponse<Review[]>> => {
        return fetchApi(`/reviews?restaurantId=${restaurantId}`);
    },
};

// ============ NOTIFICATION SERVICES ============
export const NotificationService = {
    // Get notifications
    getAll: async (): Promise<ApiResponse<{ items: Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        is_read: boolean;
        created_at: string;
    }> }>> => {
        return fetchApi('/notifications');
    },

    // Mark as read
    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        return fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
    },

    // Mark all as read
    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        return fetchApi('/notifications/read-all', { method: 'PATCH' });
    },

    // Get unread count
    getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
        return fetchApi('/notifications/unread-count');
    },
};

// ============ APPLICATION SERVICES (Collaborate Page) ============
export const ApplicationService = {
    // Submit restaurant application
    submitRestaurant: async (data: {
        name: string;
        phone: string;
        email?: string;
        address?: string;
        coordinates?: string;
        message?: string;
    }): Promise<ApiResponse<{ id: string }>> => {
        return fetchApi('/applications/restaurant', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Submit driver application with file
    submitDriver: async (formData: FormData): Promise<ApiResponse<{ id: string }>> => {
        return fetchApiFormData('/applications/driver', formData);
    },
};

// ============ DEAL SERVICES ============
export const DealService = {
    // Get active deals (from restaurants with discounts)
    getActive: async (): Promise<ApiResponse<Deal[]>> => {
        // For now, return empty array - deals can be implemented later
        return { success: true, data: [] };
    },

    // Get deal by ID
    getById: async (id: string): Promise<ApiResponse<Deal>> => {
        return fetchApi(`/deals/${id}`);
    },
};

// ============ TRANSFORM FUNCTIONS ============
// Transform backend data to frontend format

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRestaurant(data: any): Restaurant {
    return {
        id: data.id,
        name: data.name,
        type: data.cuisine_type || 'Restaurant',
        cuisineType: data.cuisine_type || '',
        description: data.description,
        logo: data.logo_url,
        banner: data.banner_url,
        hours: data.is_24_hours ? '24 цаг' : `${data.open_time || '09:00'} - ${data.close_time || '22:00'}`,
        rating: parseFloat(data.rating) || 0,
        reviewCount: data.review_count || data.total_reviews || 0,
        address: data.address,
        phone: data.phone,
        isOpen: data.is_open ?? data.is_active ?? true,
        deliveryTime: `${data.delivery_time || 30} мин`,
        deliveryFee: data.delivery_fee || 3000,
        minOrder: data.minimum_order || 0,
        coordinates: data.latitude && data.longitude ? {
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude)
        } : undefined,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRestaurants(items: any[]): Restaurant[] {
    return items?.map(transformRestaurant) || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFood(data: any): FoodItem {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        image: data.image_url,
        category: data.category?.name || data.category_id || '',
        restaurantId: data.restaurant_id,
        restaurantName: data.restaurant?.name || '',
        rating: 0,
        reviewCount: 0,
        isAvailable: data.is_available ?? true,
        preparationTime: data.preparation_time ? `${data.preparation_time} мин` : undefined,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFoods(items: any[]): FoodItem[] {
    return items?.map(transformFood) || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformCart(data: any): Cart {
    const items: CartItem[] = data.items?.map((item: { id: string; quantity: number; food: { id: string; name: string; price: number; image_url?: string }; }) => ({
        id: item.id,
        foodId: item.food?.id,
        name: item.food?.name || '',
        price: parseFloat(item.food?.price?.toString() || '0'),
        quantity: item.quantity,
        restaurantId: data.restaurant_id,
        restaurantName: data.restaurant?.name || '',
        image: item.food?.image_url,
    })) || [];
    
    return {
        items,
        subtotal: data.subtotal || 0,
        deliveryFee: data.deliveryFee || 3000,
        serviceFee: 0,
        total: data.total || 0,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformOrder(data: any): Order {
    return {
        id: data.id,
        orderNumber: data.order_number || '',
        userId: data.user_id,
        restaurantId: data.restaurant_id,
        restaurantName: data.restaurant?.name || '',
        restaurantLogo: data.restaurant?.logo_url,
        items: data.items?.map((item: { id: string; quantity: number; price: number; food: { id: string; name: string; image_url?: string } }) => ({
            id: item.id,
            foodId: item.food?.id,
            name: item.food?.name || '',
            price: parseFloat(item.price?.toString() || '0'),
            quantity: item.quantity,
            image: item.food?.image_url,
        })) || [],
        status: data.status,
        subtotal: parseFloat(data.subtotal?.toString() || '0'),
        deliveryFee: parseFloat(data.delivery_fee?.toString() || '0'),
        serviceFee: 0,
        total: parseFloat(data.total_amount?.toString() || data.total?.toString() || '0'),
        deliveryAddress: data.delivery_address || '',
        paymentMethod: data.payment_method || 'cash',
        isPaid: data.payment_status === 'paid',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        estimatedDelivery: data.estimated_delivery_time,
        driver: data.driver ? {
            id: data.driver.id,
            name: data.driver.user?.full_name || data.driver.user?.name || '',
            phone: data.driver.user?.phone || '',
            avatar: data.driver.user?.avatar_url,
            rating: parseFloat(data.driver.rating?.toString() || '0'),
            vehicleType: data.driver.vehicle_type || '',
            vehiclePlate: data.driver.vehicle_number || '',
        } : undefined,
        isRated: false, // Will be updated based on reviews
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformOrders(items: any[]): Order[] {
    return items?.map(transformOrder) || [];
}

// ============ ALIASES FOR COMPATIBILITY ============
export const CartAPI = CartService;
export const FoodAPI = FoodService;
export const RestaurantAPI = RestaurantService;
export const DealAPI = DealService;
export const OrderAPI = OrderService;
export const UserAPI = AuthService;
