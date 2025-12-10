// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Generic API fetch wrapper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || data.error || 'Something went wrong',
            };
        }

        // Handle nested data structure
        return {
            success: true,
            data: data.data || data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

// API Methods
export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: unknown) => 
        apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown) => 
        apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: unknown) => 
        apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// File upload helper
export async function uploadFile<T>(
    endpoint: string,
    formData: FormData
): Promise<ApiResponse<T>> {
    try {
        const token = typeof window !== 'undefined' 
            ? sessionStorage.getItem('auth_token') 
            : null;
        
        const headers: HeadersInit = {
            ...(token && { Authorization: `Bearer ${token}` }),
            // Don't set Content-Type - browser will set it with boundary for FormData
        };

        // Log FormData contents for debugging
        if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
            console.log('Uploading to:', `${API_BASE_URL}${endpoint}`);
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`FormData field "${key}":`, {
                        name: value.name,
                        type: value.type,
                        size: value.size
                    });
                } else {
                    console.log(`FormData field "${key}":`, value);
                }
            }
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || 'Upload failed' };
            }
            console.error('Upload failed:', {
                status: response.status,
                statusText: response.statusText,
                endpoint,
                error: errorData
            });
            return {
                success: false,
                error: errorData.message || 'Upload failed',
            };
        }

        const data = await response.json();

        return {
            success: true,
            data: data.data || data,
        };
    } catch (error) {
        console.error('Upload Error:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

export default api;
