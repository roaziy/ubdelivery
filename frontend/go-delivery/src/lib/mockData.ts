import { 
    Driver,
    DeliveryOrder,
    EarningsSummary,
    DailyEarnings,
    PayoutHistory,
    DriverStats,
    DriverNotification
} from '@/types';

// ============ MOCK DRIVER ============
export const mockDriver: Driver = {
    id: 'driver_001',
    name: 'Одхүү Батцэцэг',
    phone: '99001122',
    email: 'odhuu@example.mn',
    avatar: null,
    vehicleType: 'motorcycle',
    vehiclePlate: '1234 УБА',
    isOnline: true,
    isApproved: true,
    currentLat: 47.9180,
    currentLng: 106.9170,
    rating: 4.8,
    totalDeliveries: 532,
    createdAt: '2024-03-15T10:00:00Z',
    bankInfo: {
        bankId: 'khan',
        accountNumber: '5012345678',
        accountHolder: 'ОДХҮҮ БАТЦЭЦЭГ',
    },
};

// ============ MOCK AVAILABLE ORDERS ============
export const mockAvailableOrders: DeliveryOrder[] = [
    {
        id: 'order_avail_001',
        orderNumber: '#2045',
        status: 'pending_pickup',
        restaurantId: 'rest_001',
        restaurantName: 'Pizza Hut Mongolia',
        restaurantAddress: 'СБД, 1-р хороо, Central Tower',
        restaurantPhone: '77001234',
        restaurantLat: 47.9184,
        restaurantLng: 106.9177,
        customerId: 'user_101',
        customerName: 'Алтангэрэл',
        customerPhone: '95049990',
        deliveryAddress: 'БЗД, 67р хороо, МХТС, 3 давхар 302 тоот',
        deliveryLat: 47.9284,
        deliveryLng: 106.9377,
        deliveryNotes: 'Хаалганы код: 1234',
        items: [
            { id: 'oi_1', foodName: 'Махан дурлагсад пицза', quantity: 1, notes: null },
            { id: 'oi_2', foodName: 'BBQ Пицза', quantity: 2, notes: 'Чинжүүгүй' },
        ],
        total: 97900,
        deliveryFee: 5000,
        estimatedPickupTime: null,
        actualPickupTime: null,
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'order_avail_002',
        orderNumber: '#2046',
        status: 'pending_pickup',
        restaurantId: 'rest_002',
        restaurantName: 'KFC Mongolia',
        restaurantAddress: 'СБД, Их дэлгүүр',
        restaurantPhone: '77005678',
        restaurantLat: 47.9150,
        restaurantLng: 106.9150,
        customerId: 'user_102',
        customerName: 'Батболд',
        customerPhone: '99112233',
        deliveryAddress: 'СХД, 11-р хороо, Их тойруу',
        deliveryLat: 47.9050,
        deliveryLng: 106.9050,
        deliveryNotes: null,
        items: [
            { id: 'oi_3', foodName: 'Chicken Bucket', quantity: 1, notes: null },
            { id: 'oi_4', foodName: 'Fries Large', quantity: 2, notes: null },
        ],
        total: 45000,
        deliveryFee: 4000,
        estimatedPickupTime: null,
        actualPickupTime: null,
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
];

// ============ MOCK ACTIVE DELIVERY ============
export const mockActiveDelivery: DeliveryOrder | null = null;

// ============ MOCK DELIVERY HISTORY ============
export const mockDeliveryHistory: DeliveryOrder[] = Array(20).fill(null).map((_, i) => ({
    id: `order_hist_${i}`,
    orderNumber: `#${1000 + i}`,
    status: 'delivered' as const,
    restaurantId: `rest_00${(i % 3) + 1}`,
    restaurantName: ['Pizza Hut Mongolia', 'KFC Mongolia', 'Burger King'][i % 3],
    restaurantAddress: 'СБД, Central Tower',
    restaurantPhone: '77001234',
    restaurantLat: 47.9184,
    restaurantLng: 106.9177,
    customerId: `user_${100 + i}`,
    customerName: ['Болд', 'Гэрэл', 'Энхжин', 'Сүхбат'][i % 4],
    customerPhone: '99001122',
    deliveryAddress: 'БЗД, МХТС',
    deliveryLat: 47.9284,
    deliveryLng: 106.9377,
    deliveryNotes: null,
    items: [
        { id: `oi_h${i}_1`, foodName: 'Food Item', quantity: 2, notes: null },
    ],
    total: 35000 + (i * 5000),
    deliveryFee: 4000 + (i % 3) * 1000,
    estimatedPickupTime: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    actualPickupTime: new Date(Date.now() - (i + 1) * 3600000 + 600000).toISOString(),
    estimatedDeliveryTime: new Date(Date.now() - (i + 1) * 3600000 + 1800000).toISOString(),
    actualDeliveryTime: new Date(Date.now() - (i + 1) * 3600000 + 1500000).toISOString(),
    createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
}));

// ============ MOCK EARNINGS ============
export const mockEarningsSummary: EarningsSummary = {
    today: 85000,
    thisWeek: 420000,
    thisMonth: 1650000,
    totalDeliveries: 532,
    averagePerDelivery: 5200,
    pendingPayout: 320000,
};

export const mockDailyEarnings: DailyEarnings[] = Array(7).fill(null).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
        date: date.toISOString().split('T')[0],
        deliveries: 8 + Math.floor(Math.random() * 10),
        earnings: 40000 + Math.floor(Math.random() * 30000),
        tips: Math.floor(Math.random() * 10000),
        bonuses: i === 0 ? 5000 : 0,
        total: 50000 + Math.floor(Math.random() * 40000),
    };
});

export const mockPayoutHistory: PayoutHistory[] = [
    {
        id: 'payout_001',
        amount: 500000,
        status: 'completed',
        bankName: 'Хаан банк',
        accountNumber: '****5678',
        requestedAt: '2025-12-01T10:00:00Z',
        completedAt: '2025-12-02T14:00:00Z',
    },
    {
        id: 'payout_002',
        amount: 750000,
        status: 'completed',
        bankName: 'Хаан банк',
        accountNumber: '****5678',
        requestedAt: '2025-11-15T10:00:00Z',
        completedAt: '2025-11-16T11:00:00Z',
    },
    {
        id: 'payout_003',
        amount: 320000,
        status: 'pending',
        bankName: 'Хаан банк',
        accountNumber: '****5678',
        requestedAt: '2025-12-08T10:00:00Z',
        completedAt: null,
    },
];

// ============ MOCK STATS ============
export const mockDriverStats: DriverStats = {
    todayDeliveries: 12,
    todayEarnings: 85000,
    weekDeliveries: 68,
    weekEarnings: 420000,
    rating: 4.8,
    completionRate: 98.5,
    averageDeliveryTime: 28,
};

// ============ MOCK NOTIFICATIONS ============
export const mockNotifications: DriverNotification[] = [
    {
        id: 'notif_001',
        type: 'new_order',
        title: 'Шинэ захиалга',
        message: 'Pizza Hut-аас шинэ хүргэлт ирлээ!',
        isRead: false,
        data: { orderId: 'order_avail_001' },
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        id: 'notif_002',
        type: 'payment',
        title: 'Төлбөр хийгдлээ',
        message: '500,000₮ таны дансанд шилжүүлэгдлээ.',
        isRead: true,
        data: { payoutId: 'payout_001' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'notif_003',
        type: 'system',
        title: 'Урамшуулал',
        message: 'Өнөөдөр 15+ хүргэлт хийвэл 10,000₮ бонус!',
        isRead: false,
        data: {},
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

// ============ HELPER FUNCTIONS ============
export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString() + '₮';
};

export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Дөнгөж сая';
    if (diffMins < 60) return `${diffMins} мин`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} цаг`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} өдөр`;
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};
