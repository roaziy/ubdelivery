import { 
    AdminUser,
    RestaurantApplication,
    DriverApplication,
    Restaurant,
    Driver,
    User,
    Order,
    OrderItem,
    RefundRequest,
    Payout,
    PlatformStats,
    RevenueData,
    DailyStats
} from '@/types';

// ============ MOCK ADMIN ============
export const mockAdminUser: AdminUser = {
    id: 'admin_001',
    name: 'Super Admin',
    username: 'superadmin',
    email: 'admin@ubdelivery.com',
    role: 'super_admin',
    createdAt: '2024-01-01T00:00:00Z',
};

// ============ MOCK RESTAURANT APPLICATIONS ============
export const mockRestaurantApplications: RestaurantApplication[] = [
    {
        id: 'app_r_001',
        restaurantName: 'Burger Palace',
        ownerName: 'John Smith',
        phone: '+1 555-0101',
        email: 'john@burgerpalace.com',
        address: '123 Main Street, Downtown',
        description: 'Premium burger restaurant with gourmet options',
        cuisineType: 'American',
        businessLicense: 'BL-2024-001',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        reviewedAt: null,
        reviewedBy: null,
    },
    {
        id: 'app_r_002',
        restaurantName: 'Thai Fusion Kitchen',
        ownerName: 'Sarah Chen',
        phone: '+1 555-0102',
        email: 'sarah@thaifusion.com',
        address: '456 Oak Avenue, Midtown',
        description: 'Authentic Thai cuisine with modern twist',
        cuisineType: 'Thai',
        businessLicense: 'BL-2024-002',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        reviewedAt: null,
        reviewedBy: null,
    },
    {
        id: 'app_r_003',
        restaurantName: 'Sushi Express',
        ownerName: 'Mike Tanaka',
        phone: '+1 555-0103',
        email: 'mike@sushiexpress.com',
        address: '789 Pearl Street, Uptown',
        description: 'Fresh sushi and Japanese delicacies',
        cuisineType: 'Japanese',
        businessLicense: 'BL-2024-003',
        status: 'approved',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        reviewedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        reviewedBy: 'admin_001',
    },
];

// ============ MOCK DRIVER APPLICATIONS ============
export const mockDriverApplications: DriverApplication[] = [
    {
        id: 'app_d_001',
        driverName: 'David Wilson',
        phone: '+1 555-0201',
        email: 'david.wilson@email.com',
        address: '321 Elm Street, Suburbia',
        vehicleType: 'car',
        vehicleModel: 'Toyota Camry 2022',
        licensePlate: 'ABC-1234',
        driverLicense: 'DL-2024-001',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        reviewedAt: null,
        reviewedBy: null,
    },
    {
        id: 'app_d_002',
        driverName: 'Emily Brown',
        phone: '+1 555-0202',
        email: 'emily.brown@email.com',
        address: '654 Maple Drive, Westside',
        vehicleType: 'motorcycle',
        vehicleModel: 'Honda CBR 2021',
        licensePlate: 'XYZ-5678',
        driverLicense: 'DL-2024-002',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        reviewedAt: null,
        reviewedBy: null,
    },
    {
        id: 'app_d_003',
        driverName: 'Mike Johnson',
        phone: '+1 555-0203',
        email: 'mike.j@email.com',
        address: '987 Pine Road, Eastside',
        vehicleType: 'bike',
        vehicleModel: 'Mountain Bike',
        licensePlate: 'N/A',
        driverLicense: 'DL-2024-003',
        status: 'rejected',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        reviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        reviewedBy: 'admin_001',
        rejectionReason: 'Missing required documentation',
    },
];

// ============ MOCK RESTAURANTS ============
export const mockRestaurants: Restaurant[] = [
    {
        id: 'rest_001',
        name: 'Pizza Hut',
        ownerName: 'John Manager',
        phone: '555-0101',
        email: 'pizzahut@example.com',
        address: 'Central Tower, Downtown',
        cuisineType: 'Italian',
        rating: 4.5,
        reviewCount: 1250,
        totalOrders: 12450,
        totalRevenue: 185569000,
        avgDeliveryTime: '25-35 min',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'rest_002',
        name: 'KFC',
        ownerName: 'Sarah Owner',
        phone: '555-0102',
        email: 'kfc@example.com',
        address: 'Main Street Mall',
        cuisineType: 'American',
        rating: 4.3,
        reviewCount: 980,
        totalOrders: 9800,
        totalRevenue: 125000000,
        avgDeliveryTime: '20-30 min',
        status: 'active',
        createdAt: '2024-02-20T10:00:00Z',
    },
    {
        id: 'rest_003',
        name: 'Sushi Express',
        ownerName: 'Mike Chef',
        phone: '555-0103',
        email: 'sushi@example.com',
        address: 'Riverside District',
        cuisineType: 'Japanese',
        rating: 4.7,
        reviewCount: 560,
        totalOrders: 5600,
        totalRevenue: 89000000,
        avgDeliveryTime: '30-40 min',
        status: 'active',
        createdAt: '2024-03-10T10:00:00Z',
    },
    {
        id: 'rest_004',
        name: 'Burger King',
        ownerName: 'Tom Director',
        phone: '555-0104',
        email: 'bk@example.com',
        address: 'North Plaza',
        cuisineType: 'American',
        rating: 4.0,
        reviewCount: 320,
        totalOrders: 3200,
        totalRevenue: 45000000,
        avgDeliveryTime: '15-25 min',
        status: 'suspended',
        createdAt: '2024-04-05T10:00:00Z',
    },
];

// ============ MOCK DRIVERS ============
export const mockDrivers: Driver[] = [
    {
        id: 'driver_001',
        name: 'David Wilson',
        phone: '555-1001',
        email: 'david@delivery.com',
        vehicleType: 'motorcycle',
        vehicleModel: 'Honda CBR 2022',
        licensePlate: 'ABC-1234',
        rating: 4.8,
        totalDeliveries: 532,
        totalEarnings: 2850000,
        completionRate: 98.5,
        status: 'active',
        createdAt: '2024-03-15T10:00:00Z',
    },
    {
        id: 'driver_002',
        name: 'Emily Brown',
        phone: '555-1002',
        email: 'emily@delivery.com',
        vehicleType: 'car',
        vehicleModel: 'Toyota Camry 2021',
        licensePlate: 'XYZ-5678',
        rating: 4.5,
        totalDeliveries: 245,
        totalEarnings: 1520000,
        completionRate: 95.2,
        status: 'active',
        createdAt: '2024-05-20T10:00:00Z',
    },
    {
        id: 'driver_003',
        name: 'Mike Johnson',
        phone: '555-1003',
        email: 'mike@delivery.com',
        vehicleType: 'bike',
        vehicleModel: 'Mountain Bike',
        licensePlate: 'N/A',
        rating: 4.9,
        totalDeliveries: 128,
        totalEarnings: 650000,
        completionRate: 99.1,
        status: 'offline',
        createdAt: '2024-08-10T10:00:00Z',
    },
    {
        id: 'driver_004',
        name: 'James Smith',
        phone: '555-1004',
        email: 'james@delivery.com',
        vehicleType: 'motorcycle',
        vehicleModel: 'Yamaha R15',
        licensePlate: 'DEF-9012',
        rating: 3.8,
        totalDeliveries: 85,
        totalEarnings: 420000,
        completionRate: 88.5,
        status: 'suspended',
        createdAt: '2024-07-01T10:00:00Z',
    },
];

// ============ MOCK USERS ============
export const mockUsers: User[] = [
    {
        id: 'user_001',
        name: 'Alice Johnson',
        phone: '555-2001',
        email: 'alice@email.com',
        totalOrders: 45,
        totalSpent: 1250000,
        lastOrderDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'user_002',
        name: 'Bob Smith',
        phone: '555-2002',
        email: 'bob@email.com',
        totalOrders: 28,
        totalSpent: 750000,
        lastOrderDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: 'active',
        createdAt: '2024-02-20T10:00:00Z',
    },
    {
        id: 'user_003',
        name: 'Carol White',
        phone: '555-2003',
        email: 'carol@email.com',
        totalOrders: 12,
        totalSpent: 320000,
        lastOrderDate: new Date(Date.now() - 10 * 86400000).toISOString(),
        status: 'active',
        createdAt: '2024-03-10T10:00:00Z',
    },
    {
        id: 'user_004',
        name: 'Dan Brown',
        phone: '555-2004',
        email: 'dan@email.com',
        totalOrders: 8,
        totalSpent: 180000,
        lastOrderDate: null,
        status: 'suspended',
        createdAt: '2024-04-05T10:00:00Z',
    },
];

// Sample order items generator
const generateOrderItems = (count: number): OrderItem[] => {
    const items = [
        { name: 'Pepperoni Pizza', price: 25000 },
        { name: 'Chicken Wings', price: 18000 },
        { name: 'Caesar Salad', price: 12000 },
        { name: 'Margherita Pizza', price: 22000 },
        { name: 'Garlic Bread', price: 8000 },
        { name: 'Coca Cola', price: 3000 },
    ];
    
    return Array(count).fill(null).map((_, i) => ({
        id: `item_${i}`,
        name: items[i % items.length].name,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: items[i % items.length].price,
    }));
};

// ============ MOCK ORDERS ============
export const mockOrders: Order[] = [
    {
        id: 'order_001',
        customerId: 'user_001',
        customerName: 'Alice Johnson',
        customerPhone: '555-2001',
        restaurantId: 'rest_001',
        restaurantName: 'Pizza Hut',
        driverId: 'driver_001',
        driverName: 'David Wilson',
        items: generateOrderItems(3),
        subtotal: 65000,
        deliveryFee: 4000,
        serviceFee: 1000,
        totalAmount: 70000,
        deliveryAddress: '123 Main Street, Apt 4B',
        status: 'delivered',
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        deliveredAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    },
    {
        id: 'order_002',
        customerId: 'user_002',
        customerName: 'Bob Smith',
        customerPhone: '555-2002',
        restaurantId: 'rest_002',
        restaurantName: 'KFC',
        driverId: 'driver_002',
        driverName: 'Emily Brown',
        items: generateOrderItems(2),
        subtotal: 45000,
        deliveryFee: 4000,
        serviceFee: 1000,
        totalAmount: 50000,
        deliveryAddress: '456 Oak Avenue',
        status: 'delivering',
        createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    },
    {
        id: 'order_003',
        customerId: 'user_003',
        customerName: 'Carol White',
        customerPhone: '555-2003',
        restaurantId: 'rest_003',
        restaurantName: 'Sushi Express',
        items: generateOrderItems(4),
        subtotal: 85000,
        deliveryFee: 5000,
        serviceFee: 1500,
        totalAmount: 91500,
        deliveryAddress: '789 Pine Road, Suite 12',
        status: 'preparing',
        createdAt: new Date(Date.now() - 0.3 * 3600000).toISOString(),
    },
    {
        id: 'order_004',
        customerId: 'user_001',
        customerName: 'Alice Johnson',
        customerPhone: '555-2001',
        restaurantId: 'rest_001',
        restaurantName: 'Pizza Hut',
        items: generateOrderItems(2),
        subtotal: 35000,
        deliveryFee: 4000,
        serviceFee: 1000,
        totalAmount: 40000,
        deliveryAddress: '123 Main Street, Apt 4B',
        status: 'pending',
        createdAt: new Date(Date.now() - 0.1 * 3600000).toISOString(),
    },
    {
        id: 'order_005',
        customerId: 'user_004',
        customerName: 'Dan Brown',
        customerPhone: '555-2004',
        restaurantId: 'rest_002',
        restaurantName: 'KFC',
        driverId: 'driver_003',
        driverName: 'Mike Johnson',
        items: generateOrderItems(3),
        subtotal: 55000,
        deliveryFee: 4000,
        serviceFee: 1000,
        totalAmount: 60000,
        deliveryAddress: '321 Elm Street',
        status: 'cancelled',
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
];

// ============ MOCK REFUNDS ============
export const mockRefundRequests: RefundRequest[] = [
    {
        id: 'refund_001',
        orderId: 'order_005',
        customerId: 'user_004',
        customerName: 'Dan Brown',
        customerEmail: 'dan@email.com',
        amount: 60000,
        reason: 'Order was cancelled but payment went through',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'refund_002',
        orderId: 'order_003',
        customerId: 'user_003',
        customerName: 'Carol White',
        customerEmail: 'carol@email.com',
        amount: 30000,
        reason: 'Food arrived cold and late',
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
        id: 'refund_003',
        orderId: 'order_001',
        customerId: 'user_001',
        customerName: 'Alice Johnson',
        customerEmail: 'alice@email.com',
        amount: 15000,
        reason: 'Missing items in order',
        status: 'approved',
        adminNotes: 'Verified with restaurant, 2 items were missing',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        processedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    },
];

// ============ MOCK PAYOUTS ============
export const mockPayouts: Payout[] = [
    {
        id: 'payout_001',
        restaurantId: 'rest_001',
        restaurantName: 'Pizza Hut',
        amount: 2500000,
        period: 'Week 1-7 Jan 2025',
        bankName: 'Chase Bank',
        accountNumber: '****5678',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
        id: 'payout_002',
        restaurantId: 'rest_002',
        restaurantName: 'KFC',
        amount: 1800000,
        period: 'Week 1-7 Jan 2025',
        bankName: 'Bank of America',
        accountNumber: '****1234',
        status: 'processing',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
        id: 'payout_003',
        restaurantId: 'rest_003',
        restaurantName: 'Sushi Express',
        amount: 950000,
        period: 'Week 25-31 Dec 2024',
        bankName: 'Wells Fargo',
        accountNumber: '****9012',
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        paidAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
        id: 'payout_004',
        restaurantId: 'rest_004',
        restaurantName: 'Burger King',
        amount: 450000,
        period: 'Week 18-24 Dec 2024',
        bankName: 'Chase Bank',
        accountNumber: '****3456',
        status: 'failed',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
];

// ============ MOCK PLATFORM STATS ============
export const mockPlatformStats: PlatformStats = {
    today: {
        orders: 156,
        revenue: 4850000,
        activeUsers: 89,
        activeDrivers: 24,
    },
    week: {
        orders: 1245,
        revenue: 38500000,
        activeUsers: 456,
        activeDrivers: 45,
    },
    month: {
        orders: 5680,
        revenue: 175000000,
        activeUsers: 1250,
        activeDrivers: 52,
    },
};

// ============ MOCK REVENUE DATA ============
export const mockRevenueData: RevenueData[] = [
    { month: 'Aug', orderRevenue: 125000000, deliveryFees: 12500000, serviceFees: 6250000, totalRevenue: 143750000 },
    { month: 'Sep', orderRevenue: 138000000, deliveryFees: 13800000, serviceFees: 6900000, totalRevenue: 158700000 },
    { month: 'Oct', orderRevenue: 152000000, deliveryFees: 15200000, serviceFees: 7600000, totalRevenue: 174800000 },
    { month: 'Nov', orderRevenue: 165000000, deliveryFees: 16500000, serviceFees: 8250000, totalRevenue: 189750000 },
    { month: 'Dec', orderRevenue: 185000000, deliveryFees: 18500000, serviceFees: 9250000, totalRevenue: 212750000 },
    { month: 'Jan', orderRevenue: 175000000, deliveryFees: 17500000, serviceFees: 8750000, totalRevenue: 201250000 },
];

// ============ MOCK DAILY STATS ============
export const mockDailyStats: DailyStats[] = Array(30).fill(null).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
        date: date.toISOString().split('T')[0],
        orders: 350 + Math.floor(Math.random() * 150),
        revenue: 8500000 + Math.floor(Math.random() * 3000000),
        platformRevenue: 850000 + Math.floor(Math.random() * 300000),
        newUsers: 25 + Math.floor(Math.random() * 20),
    };
});

// ============ HELPER FUNCTIONS ============
export const formatCurrency = (amount: number): string => {
    return '$' + (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
};
