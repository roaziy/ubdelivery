import { 
    Order, 
    Food, 
    FoodCategory, 
    Review, 
    Driver, 
    DashboardStats, 
    BestSellingFood,
    Restaurant,
    RestaurantHours,
    BankInfo,
    AppNotification 
} from '@/types';

// ============ MOCK RESTAURANT ============
export const mockRestaurant: Restaurant = {
    id: 'rest_001',
    name: 'Pizza Hut Mongolia',
    description: 'Дэлхийн хамгийн алдартай пицца ресторан',
    logo: '/logos/pizzahut.png',
    coverImage: '/images/cover.jpg',
    address: 'СБД, 1-р хороо, Central Tower',
    phone: '77001234',
    email: 'pizzahut@example.mn',
    rating: 4.5,
    totalReviews: 234,
    isOpen: true,
    isApproved: true,
    ownerId: 'user_001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-10T15:30:00Z',
};

export const mockRestaurantHours: RestaurantHours[] = [
    { id: 'h1', restaurantId: 'rest_001', dayOfWeek: 0, openTime: '10:00', closeTime: '22:00', isClosed: true },
    { id: 'h2', restaurantId: 'rest_001', dayOfWeek: 1, openTime: '10:00', closeTime: '22:00', isClosed: false },
    { id: 'h3', restaurantId: 'rest_001', dayOfWeek: 2, openTime: '10:00', closeTime: '22:00', isClosed: false },
    { id: 'h4', restaurantId: 'rest_001', dayOfWeek: 3, openTime: '10:00', closeTime: '22:00', isClosed: false },
    { id: 'h5', restaurantId: 'rest_001', dayOfWeek: 4, openTime: '10:00', closeTime: '22:00', isClosed: false },
    { id: 'h6', restaurantId: 'rest_001', dayOfWeek: 5, openTime: '10:00', closeTime: '23:00', isClosed: false },
    { id: 'h7', restaurantId: 'rest_001', dayOfWeek: 6, openTime: '10:00', closeTime: '23:00', isClosed: false },
];

export const mockBankInfo: BankInfo = {
    id: 'bank_001',
    restaurantId: 'rest_001',
    bankName: 'Хаан банк',
    accountNumber: '5012345678',
    accountHolder: 'Pizza Hut Mongolia LLC',
};

// ============ MOCK CATEGORIES ============
export const mockCategories: FoodCategory[] = [
    { id: 'cat_1', name: 'Пицца', restaurantId: 'rest_001', order: 1 },
    { id: 'cat_2', name: 'Бургер', restaurantId: 'rest_001', order: 2 },
    { id: 'cat_3', name: 'Паста', restaurantId: 'rest_001', order: 3 },
    { id: 'cat_4', name: 'Салат', restaurantId: 'rest_001', order: 4 },
    { id: 'cat_5', name: 'Ундаа', restaurantId: 'rest_001', order: 5 },
    { id: 'cat_6', name: 'Амттан', restaurantId: 'rest_001', order: 6 },
];

// ============ MOCK FOODS ============
export const mockFoods: Food[] = [
    {
        id: 'food_001',
        name: 'Махан дурлагсад пицца',
        description: 'Махан дурлагсдад зориулсан том пицца. Үхрийн мах, гахайн мах, шарсан тахиа...',
        price: 35000,
        discountPrice: 29900,
        image: '/images/foods/pizza1.jpg',
        categoryId: 'cat_1',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 25,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_002',
        name: 'BBQ Пицца',
        description: 'BBQ соустой, шарсан тахиатай пицца',
        price: 32000,
        discountPrice: null,
        image: '/images/foods/pizza2.jpg',
        categoryId: 'cat_1',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 25,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_003',
        name: 'Pepperoni Пицца',
        description: 'Классик pepperoni пицца',
        price: 28000,
        discountPrice: null,
        image: '/images/foods/pizza3.jpg',
        categoryId: 'cat_1',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 20,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_004',
        name: 'Cheese Бургер',
        description: 'Үхрийн махтай классик бургер',
        price: 18000,
        discountPrice: 15000,
        image: '/images/foods/burger1.jpg',
        categoryId: 'cat_2',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 15,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_005',
        name: 'Double Бургер',
        description: 'Хоёр давхар махтай бургер',
        price: 24000,
        discountPrice: null,
        image: '/images/foods/burger2.jpg',
        categoryId: 'cat_2',
        restaurantId: 'rest_001',
        isAvailable: false,
        preparationTime: 18,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_006',
        name: 'Карбонара паста',
        description: 'Италийн уламжлалт карбонара',
        price: 22000,
        discountPrice: null,
        image: '/images/foods/pasta1.jpg',
        categoryId: 'cat_3',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 20,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_007',
        name: 'Coca Cola 0.5L',
        description: 'Сэрүүн ундаа',
        price: 3500,
        discountPrice: null,
        image: '/images/foods/cola.jpg',
        categoryId: 'cat_5',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 0,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'food_008',
        name: 'Caesar салат',
        description: 'Тахиатай Caesar салат',
        price: 16000,
        discountPrice: null,
        image: '/images/foods/salad1.jpg',
        categoryId: 'cat_4',
        restaurantId: 'rest_001',
        isAvailable: true,
        preparationTime: 10,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
];

// ============ MOCK ORDERS ============
export const mockOrders: Order[] = [
    {
        id: 'order_001',
        orderNumber: '#1024',
        userId: 'user_101',
        userName: 'Алтангэрэл Гэрэл',
        userPhone: '95049990',
        restaurantId: 'rest_001',
        driverId: null,
        driverName: null,
        status: 'pending',
        items: [
            { id: 'oi_1', orderId: 'order_001', foodId: 'food_001', foodName: 'Махан дурлагсад пицца', quantity: 1, price: 29900, notes: null },
            { id: 'oi_2', orderId: 'order_001', foodId: 'food_002', foodName: 'BBQ Пицца', quantity: 2, price: 32000, notes: 'Чинжүүгүй' },
        ],
        subtotal: 93900,
        deliveryFee: 3000,
        serviceFee: 1000,
        discount: 0,
        total: 97900,
        deliveryAddress: 'БЗД, 67р хороо, МХТС, 3 давхар 302 тоот',
        deliveryLat: 47.9184,
        deliveryLng: 106.9177,
        notes: 'Хаалганы код: 1234',
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
        updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        id: 'order_002',
        orderNumber: '#3078',
        userId: 'user_102',
        userName: 'Батаа Батцэцэг',
        userPhone: '99112233',
        restaurantId: 'rest_001',
        driverId: null,
        driverName: null,
        status: 'pending',
        items: [
            { id: 'oi_3', orderId: 'order_002', foodId: 'food_003', foodName: 'Pepperoni Пицца', quantity: 1, price: 28000, notes: null },
            { id: 'oi_4', orderId: 'order_002', foodId: 'food_007', foodName: 'Coca Cola 0.5L', quantity: 2, price: 3500, notes: null },
        ],
        subtotal: 35000,
        deliveryFee: 3000,
        serviceFee: 1000,
        discount: 5000,
        total: 34000,
        deliveryAddress: 'СХД, 11-р хороо, Их тойруу',
        deliveryLat: 47.9284,
        deliveryLng: 106.9277,
        notes: null,
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    // Preparing orders
    ...Array(4).fill(null).map((_, i) => ({
        id: `order_prep_${i}`,
        orderNumber: `#20${i + 10}`,
        userId: `user_2${i}`,
        userName: null,
        userPhone: '88001122',
        restaurantId: 'rest_001',
        driverId: null,
        driverName: null,
        status: 'preparing' as const,
        items: [
            { id: `oi_p${i}_1`, orderId: `order_prep_${i}`, foodId: 'food_001', foodName: 'Махан дурлагсад пицца', quantity: 1, price: 29900, notes: null },
            { id: `oi_p${i}_2`, orderId: `order_prep_${i}`, foodId: 'food_002', foodName: 'BBQ Пицза', quantity: 2, price: 32000, notes: null },
        ],
        subtotal: 93900,
        deliveryFee: 3000,
        serviceFee: 1000,
        discount: 0,
        total: 97900,
        deliveryAddress: 'БЗД, 67р хороо, МХТС, 3 давхар 302 тоот',
        deliveryLat: 47.9184,
        deliveryLng: 106.9177,
        notes: null,
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - (10 + i * 5) * 60000).toISOString(),
        updatedAt: new Date(Date.now() - (10 + i * 5) * 60000).toISOString(),
    })),
    // Delivered orders
    ...Array(8).fill(null).map((_, i) => ({
        id: `order_done_${i}`,
        orderNumber: `#10${i + 10}`,
        userId: `user_3${i}`,
        userName: i % 2 === 0 ? 'А.Гэрэл' : null,
        userPhone: '77889900',
        restaurantId: 'rest_001',
        driverId: 'driver_001',
        driverName: 'Одхүү Батцэцэг',
        status: 'delivered' as const,
        items: [
            { id: `oi_d${i}_1`, orderId: `order_done_${i}`, foodId: 'food_003', foodName: 'Pepperoni Пицза', quantity: 2, price: 28000, notes: null },
        ],
        subtotal: 56000,
        deliveryFee: 3000,
        serviceFee: 1000,
        discount: 0,
        total: 60000,
        deliveryAddress: 'ЧД, 5-р хороо, Оргил хотхон',
        deliveryLat: 47.9084,
        deliveryLng: 106.9077,
        notes: null,
        estimatedDeliveryTime: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
        actualDeliveryTime: new Date(Date.now() - (i + 1) * 3600000 + 1800000).toISOString(),
        createdAt: new Date(Date.now() - (i + 2) * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    })),
    // Cancelled orders
    ...Array(3).fill(null).map((_, i) => ({
        id: `order_cancel_${i}`,
        orderNumber: `#90${i + 10}`,
        userId: `user_4${i}`,
        userName: 'Cancelled User',
        userPhone: '66778899',
        restaurantId: 'rest_001',
        driverId: null,
        driverName: null,
        status: 'cancelled' as const,
        items: [
            { id: `oi_c${i}_1`, orderId: `order_cancel_${i}`, foodId: 'food_004', foodName: 'Cheese Бургер', quantity: 1, price: 15000, notes: null },
        ],
        subtotal: 15000,
        deliveryFee: 3000,
        serviceFee: 1000,
        discount: 0,
        total: 19000,
        deliveryAddress: 'БГД, 1-р хороо',
        deliveryLat: 47.8984,
        deliveryLng: 106.8977,
        notes: null,
        estimatedDeliveryTime: null,
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    })),
];

// ============ MOCK DRIVERS ============
export const mockDrivers: Driver[] = [
    {
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
    },
    {
        id: 'driver_002',
        name: 'Болд Эрдэнэ',
        phone: '99003344',
        email: 'bold@example.mn',
        avatar: null,
        vehicleType: 'car',
        vehiclePlate: '5678 УБВ',
        isOnline: true,
        isApproved: true,
        currentLat: 47.9200,
        currentLng: 106.9200,
        rating: 4.5,
        totalDeliveries: 245,
        createdAt: '2024-05-20T10:00:00Z',
    },
    {
        id: 'driver_003',
        name: 'Тэмүүлэн Ган',
        phone: '99005566',
        email: null,
        avatar: null,
        vehicleType: 'bike',
        vehiclePlate: '',
        isOnline: true,
        isApproved: true,
        currentLat: 47.9150,
        currentLng: 106.9150,
        rating: 4.9,
        totalDeliveries: 128,
        createdAt: '2024-08-10T10:00:00Z',
    },
];

// ============ MOCK REVIEWS ============
export const mockReviews: Review[] = [
    {
        id: 'review_001',
        orderId: 'order_done_0',
        userId: 'user_30',
        userName: 'А.Гэрэл',
        userAvatar: null,
        restaurantId: 'rest_001',
        driverId: 'driver_001',
        foodRating: 5,
        deliveryRating: 5,
        comment: 'Маш амттай байсан! Хүргэлт ч хурдан байлаа. Дахин захиална.',
        reply: 'Баярлалаа! Таныг дахин хүлээж байна.',
        repliedAt: '2025-01-08T14:30:00Z',
        createdAt: '2025-01-08T12:00:00Z',
    },
    {
        id: 'review_002',
        orderId: 'order_done_1',
        userId: 'user_31',
        userName: 'Б.Болд',
        userAvatar: null,
        restaurantId: 'rest_001',
        driverId: 'driver_002',
        foodRating: 4,
        deliveryRating: 3,
        comment: 'Хоол сайн байсан гэхдээ хүргэлт жаахан удсан.',
        reply: null,
        repliedAt: null,
        createdAt: '2025-01-07T18:00:00Z',
    },
    {
        id: 'review_003',
        orderId: 'order_done_2',
        userId: 'user_32',
        userName: 'Д.Дорж',
        userAvatar: null,
        restaurantId: 'rest_001',
        driverId: 'driver_001',
        foodRating: 5,
        deliveryRating: 5,
        comment: 'Perfect! 👍',
        reply: null,
        repliedAt: null,
        createdAt: '2025-01-06T20:00:00Z',
    },
    {
        id: 'review_004',
        orderId: 'order_done_3',
        userId: 'user_33',
        userName: 'Э.Энхжин',
        userAvatar: null,
        restaurantId: 'rest_001',
        driverId: 'driver_003',
        foodRating: 3,
        deliveryRating: 4,
        comment: 'Хоол хүйтэн ирсэн байна.',
        reply: 'Уучлаарай! Дараагийн захиалгад анхаарна.',
        repliedAt: '2025-01-05T16:00:00Z',
        createdAt: '2025-01-05T14:00:00Z',
    },
];

// ============ MOCK STATS ============
export const mockDashboardStats: DashboardStats = {
    todayOrders: 45,
    todayRevenue: 1569000,
    totalOrders: 12450,
    totalRevenue: 185569000,
    averageRating: 4.5,
    pendingOrders: 2,
    ordersTrend: 12.5,
    revenueTrend: 8.3,
};

export const mockBestSelling: BestSellingFood[] = [
    { foodId: 'food_001', foodName: 'Махан дурлагсад пицза', foodImage: '/images/foods/pizza1.jpg', totalOrders: 1250, revenue: 37375000 },
    { foodId: 'food_002', foodName: 'BBQ Пицза', foodImage: '/images/foods/pizza2.jpg', totalOrders: 980, revenue: 31360000 },
    { foodId: 'food_003', foodName: 'Pepperoni Пицза', foodImage: '/images/foods/pizza3.jpg', totalOrders: 856, revenue: 23968000 },
    { foodId: 'food_004', foodName: 'Cheese Бургер', foodImage: '/images/foods/burger1.jpg', totalOrders: 654, revenue: 9810000 },
    { foodId: 'food_006', foodName: 'Карбонара паста', foodImage: '/images/foods/pasta1.jpg', totalOrders: 432, revenue: 9504000 },
    { foodId: 'food_007', foodName: 'Coca Cola 0.5L', foodImage: '/images/foods/cola.jpg', totalOrders: 2100, revenue: 7350000 },
];

// ============ MOCK NOTIFICATIONS ============
export const mockNotifications: AppNotification[] = [
    {
        id: 'notif_001',
        type: 'order',
        title: 'Шинэ захиалга',
        message: 'Шинэ захиалга #1024 ирлээ!',
        isRead: false,
        data: { orderId: 'order_001' },
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        id: 'notif_002',
        type: 'order',
        title: 'Шинэ захиалга',
        message: 'Шинэ захиалга #3078 ирлээ!',
        isRead: false,
        data: { orderId: 'order_002' },
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'notif_003',
        type: 'review',
        title: 'Шинэ сэтгэгдэл',
        message: 'А.Гэрэл 5 одоор үнэлсэн байна.',
        isRead: true,
        data: { reviewId: 'review_001' },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'notif_004',
        type: 'payment',
        title: 'Төлбөр хийгдлээ',
        message: 'Өчигдрийн орлого 1,245,000₮ таны дансанд шилжүүлэгдлээ.',
        isRead: true,
        data: { amount: 1245000 },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];

// ============ HELPER FUNCTIONS ============
export const getOrdersByStatus = (status: string) => {
    if (status === 'new') {
        return mockOrders.filter(o => o.status === 'pending' || o.status === 'confirmed');
    }
    if (status === 'in-progress') {
        return mockOrders.filter(o => o.status === 'preparing' || o.status === 'ready');
    }
    if (status === 'completed') {
        return mockOrders.filter(o => o.status === 'delivered');
    }
    if (status === 'cancelled') {
        return mockOrders.filter(o => o.status === 'cancelled');
    }
    return mockOrders.filter(o => o.status === status);
};

export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Дөнгөж сая';
    if (diffMins < 60) return `${diffMins} минутын өмнө`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} өдрийн өмнө`;
};

export const getTimerFromCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const mins = diffMins % 60;
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
