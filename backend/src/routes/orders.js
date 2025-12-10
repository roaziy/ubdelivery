import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { 
  verifyToken, requireAdmin, requireDriver, 
  requireRestaurantOwner, optionalAuth 
} from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ============================================
// GET ORDERS (Role-based)
// ============================================

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    status, page = 1, limit = 20, 
    startDate, endDate, search 
  } = req.query;

  let query = supabaseAdmin
    .from('orders')
    .select(`
      *,
      user:users!orders_user_id_fkey(id, full_name, phone),
      restaurant:restaurants(id, name, logo_url),
      driver:drivers(id, user:users(id, full_name, phone)),
      items:order_items(
        id, quantity, price, notes,
        food:foods(id, name, image_url)
      )
    `, { count: 'exact' });

  // Role-based filtering
  if (req.user.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id)
      .single();
    
    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: 'Ресторан олдсонгүй'
      });
    }
    query = query.eq('restaurant_id', restaurant.id);
  } else if (req.user.role === 'driver') {
    const { data: driver } = await supabaseAdmin
      .from('drivers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();
    
    if (!driver) {
      return res.status(403).json({
        success: false,
        message: 'Жолооч олдсонгүй'
      });
    }
    query = query.eq('driver_id', driver.id);
  } else if (req.user.role === 'user') {
    query = query.eq('user_id', req.user.id);
  }
  // Admin sees all orders

  if (status) {
    if (status.includes(',')) {
      query = query.in('status', status.split(','));
    } else {
      query = query.eq('status', status);
    }
  }

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  if (search) {
    query = query.or(`order_number.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: orders, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: orders,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE ORDER
// ============================================

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      user:users!orders_user_id_fkey(id, full_name, phone, avatar_url),
      restaurant:restaurants(id, name, logo_url, phone, address),
      driver:drivers(
        id, 
        user:users(id, full_name, phone, avatar_url),
        vehicle_type, vehicle_number
      ),
      items:order_items(
        id, quantity, price, notes,
        food:foods(id, name, image_url, price)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    return res.status(404).json({
      success: false,
      message: 'Захиалга олдсонгүй'
    });
  }

  // Check access
  if (req.user.role === 'user' && order.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Хандах эрхгүй'
    });
  }

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// CREATE ORDER (User)
// ============================================

router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    restaurant_id, restaurantId, items, 
    delivery_address, deliveryAddress, delivery_notes, deliveryNotes,
    payment_method, paymentMethod
  } = req.body;

  const restId = restaurant_id || restaurantId;
  const address = delivery_address || deliveryAddress;
  const notes = delivery_notes || deliveryNotes;
  const payment = payment_method || paymentMethod || 'cash';

  if (!restId || !items || !items.length || !address) {
    return res.status(400).json({
      success: false,
      message: 'Ресторан, хоол болон хаяг шаардлагатай'
    });
  }

  // Get food prices
  const foodIds = items.map(item => item.food_id || item.foodId);
  const { data: foods } = await supabaseAdmin
    .from('foods')
    .select('id, price')
    .in('id', foodIds);

  const foodPriceMap = foods.reduce((acc, food) => {
    acc[food.id] = food.price;
    return acc;
  }, {});

  // Calculate totals
  let subtotal = 0;
  const orderItems = items.map(item => {
    const foodId = item.food_id || item.foodId;
    const price = foodPriceMap[foodId] || 0;
    const quantity = item.quantity || 1;
    subtotal += price * quantity;
    return {
      food_id: foodId,
      quantity,
      price,
      notes: item.notes || ''
    };
  });

  const deliveryFee = 3000; // Fixed delivery fee
  const totalAmount = subtotal + deliveryFee;

  // Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: req.user.id,
      restaurant_id: restId,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      delivery_address: address,
      delivery_notes: notes,
      payment_method: payment,
      payment_status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const itemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }));

  await supabaseAdmin
    .from('order_items')
    .insert(itemsWithOrderId);

  // Create notification for restaurant
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.restaurant_id, // Will be resolved by trigger
      type: 'new_order',
      title: 'Шинэ захиалга',
      message: `Шинэ захиалга #${order.order_number}`,
      data: { order_id: order.id }
    });

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// ACCEPT ORDER (Restaurant)
// ============================================

router.post('/:id/accept', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estimatedTime } = req.body;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'confirmed',
      estimated_delivery_time: estimatedTime 
        ? new Date(Date.now() + estimatedTime * 60000).toISOString()
        : new Date(Date.now() + 30 * 60000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга батлах боломжгүй'
    });
  }

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.user_id,
      type: 'order_update',
      title: 'Захиалга баталгаажлаа',
      message: `Таны #${order.order_number} захиалга баталгаажлаа`,
      data: { order_id: order.id }
    });

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// REJECT ORDER (Restaurant)
// ============================================

router.post('/:id/reject', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'cancelled',
      cancellation_reason: reason || 'Ресторан цуцаллаа',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга цуцлах боломжгүй'
    });
  }

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.user_id,
      type: 'order_update',
      title: 'Захиалга цуцлагдлаа',
      message: reason || 'Таны захиалга цуцлагдлаа',
      data: { order_id: order.id }
    });

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// MARK ORDER READY (Restaurant)
// ============================================

router.post('/:id/ready', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'ready',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .in('status', ['confirmed', 'preparing'])
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалгыг бэлэн болгох боломжгүй'
    });
  }

  // Notify driver if assigned
  if (order.driver_id) {
    const { data: driver } = await supabaseAdmin
      .from('drivers')
      .select('user_id')
      .eq('id', order.driver_id)
      .single();

    if (driver) {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: driver.user_id,
          type: 'order_update',
          title: 'Захиалга бэлэн',
          message: `#${order.order_number} захиалга авахад бэлэн`,
          data: { order_id: order.id }
        });
    }
  }

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// ASSIGN DRIVER (Admin or Auto)
// ============================================

router.post('/:id/assign-driver', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;

  // Check if admin or auto-assignment
  if (req.user.role !== 'admin' && !driverId) {
    return res.status(403).json({
      success: false,
      message: 'Зөвхөн админ жолооч оноох эрхтэй'
    });
  }

  // Find available driver if not specified
  let assignedDriverId = driverId;
  if (!assignedDriverId) {
    const { data: drivers } = await supabaseAdmin
      .from('drivers')
      .select('id')
      .eq('is_available', true)
      .eq('is_active', true)
      .limit(1);

    if (drivers?.length) {
      assignedDriverId = drivers[0].id;
    }
  }

  if (!assignedDriverId) {
    return res.status(400).json({
      success: false,
      message: 'Боломжтой жолооч олдсонгүй'
    });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      driver_id: assignedDriverId,
      status: 'ready',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .in('status', ['confirmed', 'ready'])
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Жолооч оноох боломжгүй'
    });
  }

  // Notify driver
  const { data: driver } = await supabaseAdmin
    .from('drivers')
    .select('user_id')
    .eq('id', assignedDriverId)
    .single();

  if (driver) {
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: driver.user_id,
        type: 'new_order',
        title: 'Шинэ захиалга',
        message: `Танд #${order.order_number} захиалга оноогдлоо`,
        data: { order_id: order.id }
      });
  }

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// PICKUP ORDER (Driver)
// ============================================

router.post('/:id/pickup', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'picked_up',
      picked_up_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('driver_id', req.driver.id)
    .eq('status', 'ready')
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга авах боломжгүй'
    });
  }

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.user_id,
      type: 'order_update',
      title: 'Захиалга замдаа',
      message: 'Таны захиалга хүргэлтэнд гарлаа',
      data: { order_id: order.id }
    });

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// DELIVER ORDER (Driver)
// ============================================

router.post('/:id/deliver', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      payment_status: 'paid',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('driver_id', req.driver.id)
    .eq('status', 'picked_up')
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга хүргэх боломжгүй'
    });
  }

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.user_id,
      type: 'order_update',
      title: 'Захиалга хүргэгдлээ',
      message: 'Таны захиалга амжилттай хүргэгдлээ',
      data: { order_id: order.id }
    });

  // Update driver availability
  await supabaseAdmin
    .from('drivers')
    .update({ is_available: true })
    .eq('id', req.driver.id);

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// CANCEL ORDER (User)
// ============================================

router.post('/:id/cancel', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  let query = supabaseAdmin
    .from('orders')
    .update({
      status: 'cancelled',
      cancellation_reason: reason || 'Хэрэглэгч цуцаллаа',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .in('status', ['pending', 'confirmed']);

  // User can only cancel their own orders
  if (req.user.role === 'user') {
    query = query.eq('user_id', req.user.id);
  }

  const { data: order, error } = await query.select().single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга цуцлах боломжгүй'
    });
  }

  res.json({
    success: true,
    data: order
  });
}));

// ============================================
// GET ORDER STATISTICS
// ============================================

router.get('/stats/summary', verifyToken, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let baseQuery = supabaseAdmin.from('orders').select('*');

  // Role-based filtering
  if (req.user.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id)
      .single();
    baseQuery = baseQuery.eq('restaurant_id', restaurant.id);
  } else if (req.user.role === 'driver') {
    const { data: driver } = await supabaseAdmin
      .from('drivers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();
    baseQuery = baseQuery.eq('driver_id', driver.id);
  }

  if (startDate) baseQuery = baseQuery.gte('created_at', startDate);
  if (endDate) baseQuery = baseQuery.lte('created_at', endDate);

  const { data: orders } = await baseQuery;

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    confirmed: orders?.filter(o => o.status === 'confirmed').length || 0,
    preparing: orders?.filter(o => o.status === 'preparing').length || 0,
    ready: orders?.filter(o => o.status === 'ready').length || 0,
    pickedUp: orders?.filter(o => o.status === 'picked_up').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
    cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
    revenue: orders?.filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;
