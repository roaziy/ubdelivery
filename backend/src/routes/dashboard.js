import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { 
  verifyToken, requireAdmin, requireRestaurantOwner, requireDriver 
} from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// RESTAURANT DASHBOARD STATS
// ============================================

router.get('/restaurant', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant.id;
  const { period = 'today' } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      break;
    case 'week':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  }

  // Get orders
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', startDate);

  // Get reviews
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('id, food_rating, created_at, reply')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', startDate);

  // Calculate stats
  const stats = {
    orders: {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      completed: orders?.filter(o => o.status === 'delivered').length || 0,
      cancelled: orders?.filter(o => o.status === 'cancelled').length || 0
    },
    revenue: {
      total: orders?.filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0
    },
    reviews: {
      total: reviews?.length || 0,
      average: reviews?.length 
        ? (reviews.reduce((sum, r) => sum + r.food_rating, 0) / reviews.length).toFixed(1)
        : 0,
      unreplied: reviews?.filter(r => !r.reply).length || 0
    }
  };

  // Get pending orders for quick view
  const { data: pendingOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, status, total_amount, created_at,
      user:users!orders_user_id_fkey(full_name),
      items:order_items(quantity)
    `)
    .eq('restaurant_id', restaurantId)
    .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent reviews
  const { data: recentReviews } = await supabaseAdmin
    .from('reviews')
    .select(`
      id, food_rating, comment, created_at,
      user:users!reviews_user_id_fkey(full_name, avatar_url)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(5);

  res.json({
    success: true,
    data: {
      stats,
      pendingOrders: pendingOrders || [],
      recentReviews: recentReviews || []
    }
  });
}));

// ============================================
// RESTAURANT DASHBOARD STATS ONLY
// ============================================

router.get('/restaurant/stats', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant.id;
  const { period = 'today' } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      break;
    case 'week':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  }

  // Get orders
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', startDate);

  // Calculate stats
  const todayOrders = orders?.filter(o => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length || 0;

  const todayRevenue = orders?.filter(o => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString() && o.status === 'delivered';
  }).reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0;

  // Get previous period for trend calculation
  const prevStartDate = new Date(new Date(startDate).getTime() - (new Date().getTime() - new Date(startDate).getTime()));
  const { data: prevOrders } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', prevStartDate.toISOString())
    .lt('created_at', startDate);

  const prevTodayOrders = prevOrders?.filter(o => {
    const orderDate = new Date(o.created_at);
    const prevToday = new Date(prevStartDate);
    return orderDate.toDateString() === prevToday.toDateString();
  }).length || 0;

  const prevTodayRevenue = prevOrders?.filter(o => {
    const orderDate = new Date(o.created_at);
    const prevToday = new Date(prevStartDate);
    return orderDate.toDateString() === prevToday.toDateString() && o.status === 'delivered';
  }).reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0;

  const ordersTrend = prevTodayOrders > 0 
    ? Math.round(((todayOrders - prevTodayOrders) / prevTodayOrders) * 100)
    : todayOrders > 0 ? 100 : 0;

  const revenueTrend = prevTodayRevenue > 0
    ? Math.round(((todayRevenue - prevTodayRevenue) / prevTodayRevenue) * 100)
    : todayRevenue > 0 ? 100 : 0;

  res.json({
    success: true,
    data: {
      todayOrders,
      todayRevenue,
      totalOrders: orders?.length || 0,
      totalRevenue: orders?.filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0,
      ordersTrend,
      revenueTrend,
      pendingOrders: orders?.filter(o => o.status === 'pending').length || 0
    }
  });
}));

// ============================================
// RESTAURANT DASHBOARD BEST SELLING FOODS
// ============================================

router.get('/restaurant/best-selling', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant.id;
  const limit = parseInt(req.query.limit) || 10;

  // Get all delivered orders for this restaurant
  const { data: deliveredOrders } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'delivered');

  if (!deliveredOrders || deliveredOrders.length === 0) {
    return res.json({
      success: true,
      data: []
    });
  }

  const orderIds = deliveredOrders.map(o => o.id);

  // Get order items for delivered orders
  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select(`
      food_id,
      quantity,
      price,
      food:foods(id, name, image_url)
    `)
    .in('order_id', orderIds);

  if (!items || items.length === 0) {
    return res.json({
      success: true,
      data: []
    });
  }

  // Aggregate by food_id
  const foodStats = {};
  items.forEach(item => {
    if (!item.food_id || !item.food) return;
    const foodId = item.food_id;
    if (!foodStats[foodId]) {
      foodStats[foodId] = {
        foodId,
        foodName: item.food.name,
        foodImage: item.food.image_url,
        totalOrders: 0,
        revenue: 0
      };
    }
    foodStats[foodId].totalOrders += item.quantity;
    foodStats[foodId].revenue += parseFloat(item.price) * item.quantity;
  });

  // Convert to array and sort by revenue
  const bestSelling = Object.values(foodStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  res.json({
    success: true,
    data: bestSelling
  });
}));

// ============================================
// RESTAURANT DASHBOARD RECENT ORDERS
// ============================================

router.get('/restaurant/recent-orders', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant.id;
  const limit = parseInt(req.query.limit) || 10;

  // Get recent orders
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_amount,
      created_at,
      user:users!orders_user_id_fkey(id, phone, full_name)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!orders) {
    return res.json({
      success: true,
      data: []
    });
  }

  // Transform orders to match frontend Order interface
  const transformedOrders = orders.map(order => ({
    id: order.id,
    orderNumber: order.order_number || order.id.slice(0, 8).toUpperCase(),
    userId: order.user?.id || '',
    userName: order.user?.full_name || null,
    userPhone: order.user?.phone || '',
    restaurantId: restaurantId,
    driverId: null,
    driverName: null,
    status: order.status,
    items: [],
    subtotal: parseFloat(order.total_amount),
    deliveryFee: 0,
    serviceFee: 0,
    discount: 0,
    total: parseFloat(order.total_amount),
    deliveryAddress: '',
    deliveryLat: 0,
    deliveryLng: 0,
    notes: null,
    estimatedDeliveryTime: null,
    actualDeliveryTime: null,
    createdAt: order.created_at,
    updatedAt: order.created_at
  }));

  res.json({
    success: true,
    data: transformedOrders
  });
}));

// ============================================
// DRIVER DASHBOARD STATS
// ============================================

router.get('/driver', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const driverId = req.driver.id;
  const { period = 'today' } = req.query;

  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      break;
    case 'week':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  }

  // Get deliveries
  const { data: deliveries } = await supabaseAdmin
    .from('orders')
    .select('id, status, delivery_fee, delivered_at')
    .eq('driver_id', driverId)
    .gte('created_at', startDate);

  // Get driver info
  const { data: driver } = await supabaseAdmin
    .from('drivers')
    .select('rating, total_reviews, total_deliveries, is_available')
    .eq('id', driverId)
    .single();

  const stats = {
    deliveries: {
      total: deliveries?.length || 0,
      completed: deliveries?.filter(d => d.status === 'delivered').length || 0,
      inProgress: deliveries?.filter(d => 
        ['ready', 'picked_up'].includes(d.status)
      ).length || 0
    },
    earnings: {
      total: deliveries?.filter(d => d.status === 'delivered')
        .reduce((sum, d) => sum + parseFloat(d.delivery_fee || 0), 0) || 0
    },
    rating: driver?.rating || 0,
    totalReviews: driver?.total_reviews || 0,
    isAvailable: driver?.is_available || false
  };

  // Get current/active orders
  const { data: activeOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, status, delivery_address, created_at,
      restaurant:restaurants(name, address, phone),
      user:users!orders_user_id_fkey(full_name, phone)
    `)
    .eq('driver_id', driverId)
    .in('status', ['ready', 'picked_up'])
    .order('created_at', { ascending: true });

  // Get available orders
  const { data: availableOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, delivery_fee, delivery_address,
      restaurant:restaurants(name, address)
    `)
    .eq('status', 'ready')
    .is('driver_id', null)
    .limit(5);

  res.json({
    success: true,
    data: {
      stats,
      activeOrders: activeOrders || [],
      availableOrders: availableOrders || []
    }
  });
}));

// ============================================
// ADMIN DASHBOARD STATS
// ============================================

router.get('/admin', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { period = 'today' } = req.query;

  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      break;
    case 'week':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  }

  // Get orders
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, delivery_fee')
    .gte('created_at', startDate);

  // Get counts
  const { count: usersCount } = await supabaseAdmin
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'user');

  const { count: restaurantsCount } = await supabaseAdmin
    .from('restaurants')
    .select('id', { count: 'exact', head: true });

  const { count: driversCount } = await supabaseAdmin
    .from('drivers')
    .select('id', { count: 'exact', head: true });

  const { count: pendingApps } = await supabaseAdmin
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const stats = {
    orders: {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      delivered: orders?.filter(o => o.status === 'delivered').length || 0,
      cancelled: orders?.filter(o => o.status === 'cancelled').length || 0
    },
    revenue: {
      total: orders?.filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0,
      deliveryFees: orders?.filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + parseFloat(o.delivery_fee || 0), 0) || 0
    },
    users: usersCount || 0,
    restaurants: restaurantsCount || 0,
    drivers: driversCount || 0,
    pendingApplications: pendingApps || 0
  };

  // Get recent orders
  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, status, total_amount, created_at,
      restaurant:restaurants(name),
      user:users!orders_user_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get pending applications
  const { data: applications } = await supabaseAdmin
    .from('applications')
    .select('id, type, name, phone, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get top restaurants
  const { data: topRestaurants } = await supabaseAdmin
    .from('restaurants')
    .select('id, name, logo_url, rating, review_count')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(5);

  res.json({
    success: true,
    data: {
      stats,
      recentOrders: recentOrders || [],
      pendingApplications: applications || [],
      topRestaurants: topRestaurants || []
    }
  });
}));

// ============================================
// USER DASHBOARD (www-user)
// ============================================

router.get('/user', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get recent orders
  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, status, total_amount, created_at,
      restaurant:restaurants(id, name, logo_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get active order
  const { data: activeOrder } = await supabaseAdmin
    .from('orders')
    .select(`
      id, order_number, status, delivery_address, estimated_delivery_time,
      restaurant:restaurants(id, name, phone, address),
      driver:drivers(
        id,
        user:users(full_name, phone),
        current_latitude, current_longitude
      )
    `)
    .eq('user_id', userId)
    .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'picked_up'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get favorite restaurants (based on order frequency)
  const { data: favorites } = await supabaseAdmin
    .from('orders')
    .select('restaurant_id')
    .eq('user_id', userId)
    .eq('status', 'delivered');

  // Count orders per restaurant
  const restaurantCounts = {};
  favorites?.forEach(order => {
    restaurantCounts[order.restaurant_id] = 
      (restaurantCounts[order.restaurant_id] || 0) + 1;
  });

  const topRestaurantIds = Object.entries(restaurantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  let favoriteRestaurants = [];
  if (topRestaurantIds.length) {
    const { data } = await supabaseAdmin
      .from('restaurants')
      .select('id, name, logo_url, rating, cuisine_type')
      .in('id', topRestaurantIds);
    favoriteRestaurants = data || [];
  }

  res.json({
    success: true,
    data: {
      activeOrder,
      recentOrders: recentOrders || [],
      favoriteRestaurants
    }
  });
}));

// ============================================
// CHART DATA - ORDERS OVER TIME
// ============================================

router.get('/charts/orders', verifyToken, asyncHandler(async (req, res) => {
  const { period = 'week', restaurantId } = req.query;

  let days = 7;
  if (period === 'month') days = 30;
  if (period === 'year') days = 365;

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let query = supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, created_at')
    .gte('created_at', startDate);

  // Filter by restaurant if needed
  if (req.user.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id)
      .single();
    query = query.eq('restaurant_id', restaurant.id);
  } else if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data: orders } = await query;

  // Group by date
  const grouped = {};
  orders?.forEach(order => {
    const date = order.created_at.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { orders: 0, revenue: 0 };
    }
    grouped[date].orders++;
    if (order.status === 'delivered') {
      grouped[date].revenue += parseFloat(order.total_amount);
    }
  });

  // Fill in missing dates
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    result.push({
      date,
      orders: grouped[date]?.orders || 0,
      revenue: grouped[date]?.revenue || 0
    });
  }

  res.json({
    success: true,
    data: result
  });
}));

export default router;
