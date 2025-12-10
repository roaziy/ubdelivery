import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { 
  verifyToken, requireAdmin, requireDriver 
} from '../middleware/auth.js';
import { uploadAndProcess, deleteImage } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// ============================================
// GET DRIVERS (Admin)
// ============================================

router.get('/', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    page = 1, limit = 20, 
    status, search, isAvailable 
  } = req.query;

  let query = supabaseAdmin
    .from('drivers')
    .select(`
      *,
      user:users!drivers_user_id_fkey(id, full_name, email, phone, avatar_url)
    `, { count: 'exact' });

  if (status === 'active') {
    query = query.eq('is_active', true);
  } else if (status === 'inactive') {
    query = query.eq('is_active', false);
  }

  if (isAvailable === 'true') {
    query = query.eq('is_available', true);
  } else if (isAvailable === 'false') {
    query = query.eq('is_available', false);
  }

  if (search) {
    query = query.or(`vehicle_number.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: drivers, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: drivers,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE DRIVER (Admin)
// ============================================

router.get('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .select(`
      *,
      user:users!drivers_user_id_fkey(id, full_name, email, phone, avatar_url),
      bank_account:bank_accounts(*)
    `)
    .eq('id', id)
    .single();

  if (error || !driver) {
    return res.status(404).json({
      success: false,
      message: 'Жолооч олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: driver
  });
}));

// ============================================
// GET DRIVER PROFILE (Driver)
// ============================================

router.get('/me/profile', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .select(`
      *,
      user:users!drivers_user_id_fkey(id, full_name, email, phone, avatar_url),
      bank_account:bank_accounts(*)
    `)
    .eq('id', req.driver.id)
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: driver
  });
}));

// ============================================
// UPDATE DRIVER PROFILE (Driver)
// ============================================

router.put('/me/profile', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { 
    vehicleType, vehicle_type,
    vehicleNumber, vehicle_number,
    licenseNumber, license_number,
    fullName, phone
  } = req.body;

  // Update driver info
  const driverUpdates = {};
  if (vehicleType || vehicle_type) {
    driverUpdates.vehicle_type = vehicleType || vehicle_type;
  }
  if (vehicleNumber || vehicle_number) {
    driverUpdates.vehicle_number = vehicleNumber || vehicle_number;
  }
  if (licenseNumber || license_number) {
    driverUpdates.license_number = licenseNumber || license_number;
  }

  if (Object.keys(driverUpdates).length) {
    driverUpdates.updated_at = new Date().toISOString();
    await supabaseAdmin
      .from('drivers')
      .update(driverUpdates)
      .eq('id', req.driver.id);
  }

  // Update user info
  const userUpdates = {};
  if (fullName) userUpdates.full_name = fullName;
  if (phone) userUpdates.phone = phone;

  if (Object.keys(userUpdates).length) {
    await supabaseAdmin
      .from('users')
      .update(userUpdates)
      .eq('id', req.user.id);
  }

  // Get updated profile
  const { data: driver } = await supabaseAdmin
    .from('drivers')
    .select(`
      *,
      user:users!drivers_user_id_fkey(id, full_name, email, phone, avatar_url)
    `)
    .eq('id', req.driver.id)
    .single();

  res.json({
    success: true,
    data: driver
  });
}));

// ============================================
// TOGGLE AVAILABILITY (Driver)
// ============================================

router.patch('/me/availability', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;

  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .update({
      is_available: isAvailable,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.driver.id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: driver
  });
}));

// ============================================
// UPDATE LOCATION (Driver)
// ============================================

router.patch('/me/location', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Байршил шаардлагатай'
    });
  }

  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .update({
      current_latitude: latitude,
      current_longitude: longitude,
      last_location_update: new Date().toISOString()
    })
    .eq('id', req.driver.id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: { latitude, longitude }
  });
}));

// ============================================
// GET DRIVER EARNINGS (Driver)
// ============================================

router.get('/me/earnings', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { startDate, endDate, period = 'week' } = req.query;

  let query = supabaseAdmin
    .from('orders')
    .select('id, delivery_fee, delivered_at, status')
    .eq('driver_id', req.driver.id)
    .eq('status', 'delivered');

  if (startDate) query = query.gte('delivered_at', startDate);
  if (endDate) query = query.lte('delivered_at', endDate);

  const { data: orders } = await query;

  // Calculate earnings
  const totalEarnings = orders?.reduce(
    (sum, order) => sum + parseFloat(order.delivery_fee || 0), 0
  ) || 0;

  // Get today's earnings
  const today = new Date().toISOString().split('T')[0];
  const todayEarnings = orders?.filter(o => 
    o.delivered_at?.startsWith(today)
  ).reduce((sum, o) => sum + parseFloat(o.delivery_fee || 0), 0) || 0;

  // Get this week's earnings
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekEarnings = orders?.filter(o => 
    o.delivered_at >= weekAgo
  ).reduce((sum, o) => sum + parseFloat(o.delivery_fee || 0), 0) || 0;

  res.json({
    success: true,
    data: {
      total: totalEarnings,
      today: todayEarnings,
      week: weekEarnings,
      deliveryCount: orders?.length || 0
    }
  });
}));

// ============================================
// GET DRIVER BANK ACCOUNT
// ============================================

router.get('/me/bank', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { data: bankAccount } = await supabaseAdmin
    .from('bank_accounts')
    .select('*')
    .eq('driver_id', req.driver.id)
    .single();

  res.json({
    success: true,
    data: bankAccount
  });
}));

// ============================================
// UPDATE DRIVER BANK ACCOUNT
// ============================================

router.put('/me/bank', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { 
    bankName, bank_name,
    accountNumber, account_number,
    accountName, account_name
  } = req.body;

  const bankData = {
    driver_id: req.driver.id,
    bank_name: bankName || bank_name,
    account_number: accountNumber || account_number,
    account_name: accountName || account_name,
    updated_at: new Date().toISOString()
  };

  const { data: existing } = await supabaseAdmin
    .from('bank_accounts')
    .select('id')
    .eq('driver_id', req.driver.id)
    .single();

  let bankAccount;
  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('bank_accounts')
      .update(bankData)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    bankAccount = data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('bank_accounts')
      .insert(bankData)
      .select()
      .single();
    if (error) throw error;
    bankAccount = data;
  }

  res.json({
    success: true,
    data: bankAccount
  });
}));

// ============================================
// UPLOAD DRIVER AVATAR
// ============================================

router.post('/me/avatar', 
  verifyToken, 
  requireDriver,
  uploadAndProcess('image', 'avatar', 'avatars'),
  asyncHandler(async (req, res) => {
    if (!req.uploadedImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Зураг олдсонгүй'
      });
    }

    // Delete old avatar
    const { data: oldUser } = await supabaseAdmin
      .from('users')
      .select('avatar_url')
      .eq('id', req.user.id)
      .single();

    if (oldUser?.avatar_url) {
      await deleteImage(oldUser.avatar_url);
    }

    await supabaseAdmin
      .from('users')
      .update({ avatar_url: req.uploadedImageUrl })
      .eq('id', req.user.id);

    res.json({
      success: true,
      data: { url: req.uploadedImageUrl }
    });
  })
);

// ============================================
// ACTIVATE/DEACTIVATE DRIVER (Admin)
// ============================================

router.patch('/:id/status', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive, is_active } = req.body;

  const active = isActive ?? is_active;

  const { data: driver, error } = await supabaseAdmin
    .from('drivers')
    .update({
      is_active: active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      user:users!drivers_user_id_fkey(id, full_name)
    `)
    .single();

  if (error) throw error;

  // Notify driver
  const { data: driverData } = await supabaseAdmin
    .from('drivers')
    .select('user_id')
    .eq('id', id)
    .single();

  if (driverData) {
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: driverData.user_id,
        type: 'system',
        title: active ? 'Бүртгэл идэвхжлээ' : 'Бүртгэл түр хаагдлаа',
        message: active 
          ? 'Таны жолоочийн бүртгэл идэвхжлээ' 
          : 'Таны жолоочийн бүртгэл түр хаагдлаа'
      });
  }

  res.json({
    success: true,
    data: driver
  });
}));

// ============================================
// GET DRIVER STATISTICS
// ============================================

router.get('/me/stats', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  // Get delivery stats
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, delivery_fee')
    .eq('driver_id', req.driver.id);

  const deliveredOrders = orders?.filter(o => o.status === 'delivered') || [];
  const totalEarnings = deliveredOrders.reduce(
    (sum, o) => sum + parseFloat(o.delivery_fee || 0), 0
  );

  // Get rating
  const { data: driver } = await supabaseAdmin
    .from('drivers')
    .select('rating, total_reviews, total_deliveries')
    .eq('id', req.driver.id)
    .single();

  res.json({
    success: true,
    data: {
      totalDeliveries: driver?.total_deliveries || deliveredOrders.length,
      totalEarnings,
      rating: driver?.rating || 0,
      totalReviews: driver?.total_reviews || 0
    }
  });
}));

// ============================================
// GET AVAILABLE ORDERS FOR DRIVER
// ============================================

router.get('/me/available-orders', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      restaurant:restaurants(id, name, address, logo_url),
      items:order_items(
        id, quantity,
        food:foods(id, name)
      )
    `)
    .eq('status', 'ready')
    .is('driver_id', null)
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) throw error;

  res.json({
    success: true,
    data: orders
  });
}));

// ============================================
// ACCEPT ORDER (Driver)
// ============================================

router.post('/me/accept-order/:orderId', verifyToken, requireDriver, asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  // Check if driver is available
  if (!req.driver.is_available) {
    return res.status(400).json({
      success: false,
      message: 'Та одоогоор идэвхгүй байна'
    });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      driver_id: req.driver.id,
      status: 'ready',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('status', 'ready')
    .is('driver_id', null)
    .select()
    .single();

  if (error || !order) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга авах боломжгүй'
    });
  }

  // Set driver as unavailable
  await supabaseAdmin
    .from('drivers')
    .update({ is_available: false })
    .eq('id', req.driver.id);

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: order.user_id,
      type: 'order_update',
      title: 'Жолооч оноогдлоо',
      message: 'Таны захиалгад жолооч оноогдлоо',
      data: { order_id: order.id }
    });

  res.json({
    success: true,
    data: order
  });
}));

export default router;
