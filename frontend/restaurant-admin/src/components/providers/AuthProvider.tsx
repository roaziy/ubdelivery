'use client'

import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    ReactNode 
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Restaurant, User } from '@/types';
import { authService } from '@/lib/services';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    restaurant: Restaurant | null;
    login: (token: string, user: User, restaurant: Restaurant | null) => void;
    logout: () => void;
    updateRestaurant: (restaurant: Restaurant) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicPaths = ['/', '/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    const login = useCallback((
        token: string, 
        userData: User, 
        restaurantData: Restaurant | null
    ) => {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('adminLoggedIn', 'true');
        if (restaurantData) {
            sessionStorage.setItem('restaurant', JSON.stringify(restaurantData));
            sessionStorage.setItem('setupCompleted', 'true');
        }
        setUser(userData);
        setRestaurant(restaurantData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore logout errors
        }
        sessionStorage.clear();
        setUser(null);
        setRestaurant(null);
        setIsAuthenticated(false);
        router.push('/');
    }, [router]);

    const updateRestaurant = useCallback((restaurantData: Restaurant) => {
        setRestaurant(restaurantData);
        sessionStorage.setItem('restaurant', JSON.stringify(restaurantData));
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('auth_token');
            const storedRestaurant = sessionStorage.getItem('restaurant');
            
            if (!token) {
                setIsLoading(false);
                if (!publicPaths.includes(pathname)) {
                    router.push('/');
                }
                return;
            }

            try {
                const response = await authService.getProfile();
                if (response.success && response.data) {
                    setUser(response.data.user as User);
                    setRestaurant(response.data.restaurant);
                    setIsAuthenticated(true);
                } else {
                    // Token invalid, try to use stored data
                    if (storedRestaurant) {
                        setRestaurant(JSON.parse(storedRestaurant));
                        setIsAuthenticated(true);
                    } else {
                        sessionStorage.clear();
                        if (!publicPaths.includes(pathname)) {
                            router.push('/');
                        }
                    }
                }
            } catch {
                // Network error, use stored data if available
                if (storedRestaurant) {
                    setRestaurant(JSON.parse(storedRestaurant));
                    setIsAuthenticated(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            restaurant,
            login,
            logout,
            updateRestaurant
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

// Alias for convenience
export const useAuth = useAuthContext;
