'use client'

import { useState, useCallback, useEffect } from 'react';
import { 
    authService, 
    dashboardService, 
    orderService, 
    menuService, 
    reviewService,
    restaurantService,
    driverService,
    notificationService
} from './services';
import { 
    Order, 
    DashboardStats, 
    BestSellingFood, 
    Food, 
    FoodCategory, 
    Review, 
    Restaurant,
    Driver,
    AppNotification,
    LoginRequest
} from '@/types';
import { PaginatedResponse } from './api';

// Generic hook for API calls with loading state
function useApiCall<T, P extends unknown[]>(
    apiFunc: (...args: P) => Promise<{ success: boolean; data?: T; error?: string }>
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: P) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFunc(...args);
            if (response.success && response.data) {
                setData(response.data);
                return response.data;
            } else {
                setError(response.error || 'Unknown error');
                return null;
            }
        } catch (err) {
            setError('Network error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiFunc]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset, setData };
}

// Auth Hook
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            if (response.success && response.data) {
                sessionStorage.setItem('auth_token', response.data.token);
                sessionStorage.setItem('adminLoggedIn', 'true');
                if (response.data.restaurant) {
                    sessionStorage.setItem('restaurant', JSON.stringify(response.data.restaurant));
                    sessionStorage.setItem('setupCompleted', 'true');
                }
                setIsAuthenticated(true);
                return { success: true, hasRestaurant: !!response.data.restaurant };
            }
            setError(response.error || 'Login failed');
            return { success: false, hasRestaurant: false };
        } catch {
            setError('Network error');
            return { success: false, hasRestaurant: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        sessionStorage.clear();
        setIsAuthenticated(false);
    }, []);

    const checkAuth = useCallback(async () => {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            setIsAuthenticated(false);
            return false;
        }
        const response = await authService.verifyToken();
        setIsAuthenticated(response.success);
        return response.success;
    }, []);

    return { isAuthenticated, loading, error, login, logout, checkAuth };
}

// Dashboard Hook
export function useDashboard() {
    const stats = useApiCall(dashboardService.getStats);
    const bestSelling = useApiCall(dashboardService.getBestSelling);
    const recentOrders = useApiCall(dashboardService.getRecentOrders);

    const fetchAll = useCallback(async () => {
        await Promise.all([
            stats.execute(),
            bestSelling.execute(6),
            recentOrders.execute(8)
        ]);
    }, [stats, bestSelling, recentOrders]);

    return {
        stats: stats.data,
        bestSelling: bestSelling.data,
        recentOrders: recentOrders.data,
        loading: stats.loading || bestSelling.loading || recentOrders.loading,
        error: stats.error || bestSelling.error || recentOrders.error,
        fetchAll
    };
}

// Orders Hook
export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ 
        page: 1, total: 0, totalPages: 1 
    });
    const [stats, setStats] = useState<{
        pending: number;
        preparing: number;
        ready: number;
        delivering: number;
        completed: number;
        cancelled: number;
    } | null>(null);

    const fetchOrders = useCallback(async (params?: Parameters<typeof orderService.getOrders>[0]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getOrders(params);
            if (response.success && response.data) {
                setOrders(response.data.items);
                setPagination({
                    page: response.data.page,
                    total: response.data.total,
                    totalPages: response.data.totalPages
                });
            } else {
                setError(response.error || 'Failed to fetch orders');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        const response = await orderService.getOrderStats();
        if (response.success && response.data) {
            setStats(response.data);
        }
    }, []);

    const acceptOrder = useCallback(async (id: string) => {
        const response = await orderService.acceptOrder(id);
        if (response.success) {
            await fetchStats();
        }
        return response;
    }, [fetchStats]);

    const rejectOrder = useCallback(async (id: string, reason: string) => {
        const response = await orderService.rejectOrder(id, reason);
        if (response.success) {
            await fetchStats();
        }
        return response;
    }, [fetchStats]);

    const markReady = useCallback(async (id: string) => {
        return orderService.markReady(id);
    }, []);

    const assignDriver = useCallback(async (orderId: string, driverId: string) => {
        return orderService.assignDriver(orderId, driverId);
    }, []);

    return {
        orders, loading, error, pagination, stats,
        fetchOrders, fetchStats, acceptOrder, rejectOrder, markReady, assignDriver
    };
}

// Menu Hook
export function useMenu() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ 
        page: 1, total: 0, totalPages: 1 
    });

    const fetchCategories = useCallback(async () => {
        const response = await menuService.getCategories();
        if (response.success && response.data) {
            setCategories(response.data);
        }
    }, []);

    const fetchFoods = useCallback(async (params?: Parameters<typeof menuService.getFoods>[0]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await menuService.getFoods(params);
            if (response.success && response.data) {
                setFoods(response.data.items);
                setPagination({
                    page: response.data.page,
                    total: response.data.total,
                    totalPages: response.data.totalPages
                });
            } else {
                setError(response.error || 'Failed to fetch menu');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    const createFood = useCallback(async (data: Partial<Food>) => {
        const response = await menuService.createFood(data);
        if (response.success) {
            await fetchFoods();
        }
        return response;
    }, [fetchFoods]);

    const updateFood = useCallback(async (id: string, data: Partial<Food>) => {
        const response = await menuService.updateFood(id, data);
        if (response.success) {
            await fetchFoods();
        }
        return response;
    }, [fetchFoods]);

    const deleteFood = useCallback(async (id: string) => {
        const response = await menuService.deleteFood(id);
        if (response.success) {
            await fetchFoods();
        }
        return response;
    }, [fetchFoods]);

    const toggleAvailability = useCallback(async (id: string, isAvailable: boolean) => {
        const response = await menuService.toggleFoodAvailability(id, isAvailable);
        if (response.success && response.data) {
            setFoods(prev => prev.map(f => f.id === id ? response.data! : f));
        }
        return response;
    }, []);

    const createCategory = useCallback(async (name: string) => {
        const response = await menuService.createCategory(name);
        if (response.success) {
            await fetchCategories();
        }
        return response;
    }, [fetchCategories]);

    return {
        foods, categories, loading, error, pagination,
        fetchFoods, fetchCategories, createFood, updateFood, 
        deleteFood, toggleAvailability, createCategory
    };
}

// Reviews Hook
export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ 
        page: 1, total: 0, totalPages: 1 
    });
    const [stats, setStats] = useState<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { rating: number; count: number }[];
    } | null>(null);

    const fetchReviews = useCallback(async (params?: Parameters<typeof reviewService.getReviews>[0]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await reviewService.getReviews(params);
            if (response.success && response.data) {
                setReviews(response.data.items);
                setPagination({
                    page: response.data.page,
                    total: response.data.total,
                    totalPages: response.data.totalPages
                });
            } else {
                setError(response.error || 'Failed to fetch reviews');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        const response = await reviewService.getReviewStats();
        if (response.success && response.data) {
            setStats(response.data);
        }
    }, []);

    const replyToReview = useCallback(async (id: string, reply: string) => {
        const response = await reviewService.replyToReview(id, reply);
        if (response.success && response.data) {
            setReviews(prev => prev.map(r => r.id === id ? response.data! : r));
        }
        return response;
    }, []);

    return {
        reviews, loading, error, pagination, stats,
        fetchReviews, fetchStats, replyToReview
    };
}

// Restaurant Hook
export function useRestaurant() {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRestaurant = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await restaurantService.getMyRestaurant();
            if (response.success && response.data) {
                setRestaurant(response.data);
            } else {
                setError(response.error || 'Failed to fetch restaurant');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRestaurant = useCallback(async (data: Partial<Restaurant>) => {
        setLoading(true);
        try {
            const response = await restaurantService.updateRestaurant(data);
            if (response.success && response.data) {
                setRestaurant(response.data);
            }
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleOpen = useCallback(async (isOpen: boolean) => {
        const response = await restaurantService.toggleOpen(isOpen);
        if (response.success) {
            setRestaurant(prev => prev ? { ...prev, isOpen } : null);
        }
        return response;
    }, []);

    return {
        restaurant, loading, error,
        fetchRestaurant, updateRestaurant, toggleOpen
    };
}

// Settings Hook
export function useSettings() {
    const [settings, setSettings] = useState<{
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
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await restaurantService.getSettings();
            if (response.success && response.data) {
                setSettings(response.data);
            } else {
                setError(response.error || 'Failed to fetch settings');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Fetch on mount
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, loading, error, refetch };
}

// Drivers Hook
export function useDrivers() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailableDrivers = useCallback(async (params?: {
        lat?: number;
        lng?: number;
        radius?: number;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await driverService.getAvailableDrivers(params);
            if (response.success && response.data) {
                setDrivers(response.data);
            } else {
                setError(response.error || 'Failed to fetch drivers');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    return { drivers, loading, error, fetchAvailableDrivers };
}

// Notifications Hook
export function useNotificationsData() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async (params?: {
        page?: number;
        limit?: number;
        unreadOnly?: boolean;
    }) => {
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(params);
            if (response.success && response.data) {
                setNotifications(response.data.items);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        const response = await notificationService.getUnreadCount();
        if (response.success && response.data) {
            setUnreadCount(response.data.count);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        const response = await notificationService.markAsRead(id);
        if (response.success) {
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        const response = await notificationService.markAllAsRead();
        if (response.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    }, []);

    return {
        notifications, unreadCount, loading,
        fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead
    };
}
