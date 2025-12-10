// Data transformation utilities to convert backend data to frontend types
import { Driver, DeliveryOrder, DriverStats, EarningsSummary, DailyEarnings } from '@/types';

// Transform backend driver data to frontend Driver type
export function transformDriver(data: any): Driver {
    // Handle case where driver record doesn't exist yet
    if (!data || data.id === null || (data.id === null && data.user)) {
        // Return user info only
        const user = data?.user || data;
        // Try multiple possible name fields
        const name = user?.full_name || user?.name || user?.fullName || data?.name || '';
        return {
            id: user?.id || data?.id || '',
            name: name,
            phone: user?.phone || data?.phone || '',
            email: user?.email || data?.email || null,
            avatar: user?.avatar_url || user?.avatar || data?.avatar_url || data?.avatar || null,
            vehicleType: 'motorcycle' as 'bike' | 'motorcycle' | 'car',
            vehiclePlate: data?.vehicle_number || data?.vehiclePlate || '',
            isOnline: data?.is_available || false,
            isApproved: false,
            currentLat: null,
            currentLng: null,
            rating: 0,
            totalDeliveries: 0,
            createdAt: new Date().toISOString(),
            bankInfo: undefined,
        };
    }

    // Try multiple possible name fields
    const name = data.user?.full_name || data.user?.name || data.name || data.full_name || '';
    
    return {
        id: data.id || data.driver_id || '',
        name: name,
        phone: data.user?.phone || data.phone || '',
        email: data.user?.email || data.email || null,
        avatar: data.user?.avatar_url || data.avatar || data.user?.avatar || null,
        vehicleType: (data.vehicle_type || data.vehicleType || 'motorcycle') as 'bike' | 'motorcycle' | 'car',
        vehiclePlate: data.vehicle_number || data.vehiclePlate || '',
        isOnline: data.is_available || data.isOnline || false,
        isApproved: data.status === 'approved' || data.isApproved || false,
        currentLat: data.current_lat || data.currentLat || null,
        currentLng: data.current_lng || data.currentLng || null,
        rating: data.rating || 0,
        totalDeliveries: data.total_deliveries || data.totalDeliveries || 0,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        bankInfo: data.bank_account ? {
            bankId: data.bank_account.bank_name || '',
            accountNumber: data.bank_account.account_number || '',
            accountHolder: data.bank_account.account_holder || '',
        } : undefined,
    };
}

// Transform backend order data to frontend DeliveryOrder type
export function transformOrder(data: any): DeliveryOrder {
    const restaurant = data.restaurant || {};
    const user = data.user || {};
    const items = data.items || [];

    return {
        id: data.id || '',
        orderNumber: data.order_number || data.orderNumber || '',
        status: mapOrderStatus(data.status) as any,
        restaurantId: restaurant.id || data.restaurant_id || '',
        restaurantName: restaurant.name || '',
        restaurantAddress: restaurant.address || '',
        restaurantPhone: restaurant.phone || '',
        restaurantLat: restaurant.lat || data.restaurant_lat || 0,
        restaurantLng: restaurant.lng || data.restaurant_lng || 0,
        customerId: user.id || data.user_id || '',
        customerName: user.full_name || user.name || null,
        customerPhone: user.phone || '',
        deliveryAddress: data.delivery_address || data.deliveryAddress || '',
        deliveryLat: data.delivery_lat || data.deliveryLat || 0,
        deliveryLng: data.delivery_lng || data.deliveryLng || 0,
        deliveryNotes: data.delivery_notes || data.deliveryNotes || null,
        items: items.map((item: any) => ({
            id: item.id || '',
            foodName: item.food?.name || item.food_name || '',
            quantity: item.quantity || 0,
            notes: item.notes || null,
        })),
        total: parseFloat(data.total || data.total_amount || '0'),
        deliveryFee: parseFloat(data.delivery_fee || data.deliveryFee || '0'),
        estimatedPickupTime: data.estimated_pickup_time || null,
        actualPickupTime: data.picked_up_at || null,
        estimatedDeliveryTime: data.estimated_delivery_time || null,
        actualDeliveryTime: data.delivered_at || null,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    };
}

// Map backend order status to frontend DeliveryStatus
function mapOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'ready': 'pending_pickup',
        'picked_up': 'picked_up',
        'delivering': 'delivering',
        'delivered': 'delivered',
        'cancelled': 'cancelled',
    };
    return statusMap[status] || status;
}

// Transform backend stats to frontend DriverStats
export function transformStats(data: any): DriverStats {
    const stats = data.stats || data;
    const deliveries = stats.deliveries || {};
    
    return {
        todayDeliveries: deliveries.total || 0,
        todayEarnings: stats.earnings?.total || 0,
        weekDeliveries: deliveries.total || 0, // Will be calculated separately
        weekEarnings: stats.earnings?.total || 0, // Will be calculated separately
        rating: stats.rating || 0,
        completionRate: deliveries.total > 0 
            ? Math.round((deliveries.completed / deliveries.total) * 100) 
            : 0,
        averageDeliveryTime: 30, // Default, should be calculated from actual data
    };
}

// Transform backend earnings summary
export function transformEarningsSummary(data: any): EarningsSummary {
    return {
        today: parseFloat(data.today || '0'),
        thisWeek: parseFloat(data.this_week || data.thisWeek || '0'),
        thisMonth: parseFloat(data.this_month || data.thisMonth || '0'),
        totalDeliveries: data.total_deliveries || data.totalDeliveries || 0,
        averagePerDelivery: data.average_per_delivery || data.averagePerDelivery || 0,
        pendingPayout: data.pending_payout || data.pendingPayout || 0,
    };
}

// Transform daily earnings
export function transformDailyEarnings(data: any[]): DailyEarnings[] {
    return data.map((item: any) => ({
        date: item.date || item.created_at || new Date().toISOString(),
        deliveries: item.deliveries || 0,
        earnings: parseFloat(item.earnings || '0'),
        tips: parseFloat(item.tips || '0'),
        bonuses: parseFloat(item.bonuses || '0'),
        total: parseFloat(item.total || item.earnings || '0'),
    }));
}

