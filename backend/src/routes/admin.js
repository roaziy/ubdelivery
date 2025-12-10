import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

const router = Router();

// ============================================
// GET ALL USERS
// ============================================

router.get('/users', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    page = 1, limit = 20, 
    role, search, isActive 
  } = req.query;

  let query = supabaseAdmin
    .from('users')
    .select('*', { count: 'exact' });

  if (role) {
    query = query.eq('role', role);
  }

  if (search) {
    query = query.or(`
      full_name.ilike.%${search}%,
      email.ilike.%${search}%,
      phone.ilike.%${search}%
    `);
  }

  if (isActive === 'true') {
    query = query.eq('is_active', true);
  } else if (isActive === 'false') {
    query = query.eq('is_active', false);
  }

  query = query.order('created_at', { ascending: false });

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: users, error, count } = await query;

  if (error) throw error;

  // Remove sensitive data
  const sanitizedUsers = users.map(user => {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  });

  res.json({
    success: true,
    data: {
      items: sanitizedUsers,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE USER
// ============================================

router.get('/users/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) {
    return res.status(404).json({
      success: false,
      message: 'Хэрэглэгч олдсонгүй'
    });
  }

  const { password_hash, ...safeUser } = user;

  res.json({
    success: true,
    data: safeUser
  });
}));

// ============================================
// CREATE ADMIN USER
// ============================================

router.post('/users', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    email, phone, password, 
    fullName, full_name, role = 'admin' 
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Имэйл болон нууц үг шаардлагатай'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      phone,
      password_hash: hashedPassword,
      full_name: fullName || full_name,
      role
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Энэ имэйл эсвэл утас бүртгэлтэй байна'
      });
    }
    throw error;
  }

  const { password_hash, ...safeUser } = user;

  res.json({
    success: true,
    data: safeUser
  });
}));

// ============================================
// UPDATE USER
// ============================================

router.put('/users/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    email, phone, fullName, full_name, 
    role, isActive, is_active 
  } = req.body;

  const updates = { updated_at: new Date().toISOString() };

  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (fullName || full_name) updates.full_name = fullName || full_name;
  if (role) updates.role = role;
  if (isActive !== undefined || is_active !== undefined) {
    updates.is_active = isActive ?? is_active;
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const { password_hash, ...safeUser } = user;

  res.json({
    success: true,
    data: safeUser
  });
}));

// ============================================
// RESET USER PASSWORD
// ============================================

router.post('/users/:id/reset-password', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const newPassword = password || Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await supabaseAdmin
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('id', id);

  res.json({
    success: true,
    data: { password: newPassword }
  });
}));

// ============================================
// DELETE USER
// ============================================

router.delete('/users/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Don't allow deleting self
  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Өөрийгөө устгах боломжгүй'
    });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Хэрэглэгч устгагдлаа'
  });
}));

// ============================================
// GET ALL RESTAURANTS (Admin)
// ============================================

router.get('/restaurants', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    page = 1, limit = 20, 
    isActive, search 
  } = req.query;

  let query = supabaseAdmin
    .from('restaurants')
    .select(`
      *,
      owner:users!restaurants_owner_id_fkey(id, full_name, email, phone)
    `, { count: 'exact' });

  if (isActive === 'true') {
    query = query.eq('is_active', true);
  } else if (isActive === 'false') {
    query = query.eq('is_active', false);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: restaurants, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: restaurants,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// UPDATE RESTAURANT STATUS (Admin)
// ============================================

router.patch('/restaurants/:id/status', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive, is_active } = req.body;

  const active = isActive ?? is_active;

  const { data: restaurant, error } = await supabaseAdmin
    .from('restaurants')
    .update({
      is_active: active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Notify owner
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: restaurant.owner_id,
      type: 'system',
      title: active ? 'Ресторан идэвхжлээ' : 'Ресторан түр хаагдлаа',
      message: active 
        ? 'Таны ресторан идэвхжлээ' 
        : 'Таны ресторан түр хаагдлаа'
    });

  res.json({
    success: true,
    data: restaurant
  });
}));

// ============================================
// SYSTEM SETTINGS
// ============================================

router.get('/settings', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { data: settings } = await supabaseAdmin
    .from('system_settings')
    .select('*');

  // Convert to key-value object
  const settingsObj = settings?.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {}) || {};

  res.json({
    success: true,
    data: settingsObj
  });
}));

router.put('/settings', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const settings = req.body;

  // Upsert each setting
  for (const [key, value] of Object.entries(settings)) {
    await supabaseAdmin
      .from('system_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
  }

  res.json({
    success: true,
    message: 'Тохиргоо хадгалагдлаа'
  });
}));

// ============================================
// FINANCE/REPORTS
// ============================================

router.get('/finance/summary', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { startDate, endDate, period = 'month' } = req.query;

  let start, end;
  const now = new Date();

  if (startDate && endDate) {
    start = startDate;
    end = endDate;
  } else if (period === 'week') {
    start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    end = now.toISOString();
  } else if (period === 'month') {
    start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    end = now.toISOString();
  } else if (period === 'year') {
    start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    end = now.toISOString();
  }

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, total_amount, delivery_fee, created_at')
    .gte('created_at', start)
    .lte('created_at', end);

  const deliveredOrders = orders?.filter(o => o.status === 'delivered') || [];

  const summary = {
    totalOrders: orders?.length || 0,
    completedOrders: deliveredOrders.length,
    cancelledOrders: orders?.filter(o => o.status === 'cancelled').length || 0,
    totalRevenue: deliveredOrders
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
    totalDeliveryFees: deliveredOrders
      .reduce((sum, o) => sum + parseFloat(o.delivery_fee || 0), 0),
    averageOrderValue: deliveredOrders.length 
      ? deliveredOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) 
        / deliveredOrders.length
      : 0
  };

  // Platform commission (10%)
  summary.platformCommission = summary.totalRevenue * 0.1;

  res.json({
    success: true,
    data: summary
  });
}));

// ============================================
// EXPORT DATA
// ============================================

router.get('/export/:type', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;

  let data;
  
  switch (type) {
    case 'orders':
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select(`
          id, order_number, status, total_amount, delivery_fee,
          created_at, delivered_at,
          restaurant:restaurants(name),
          user:users!orders_user_id_fkey(full_name, phone)
        `)
        .gte('created_at', startDate || '2000-01-01')
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false });
      data = orders;
      break;

    case 'users':
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('id, full_name, email, phone, role, created_at, last_login');
      data = users;
      break;

    case 'restaurants':
      const { data: restaurants } = await supabaseAdmin
        .from('restaurants')
        .select('*');
      data = restaurants;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Буруу экспорт төрөл'
      });
  }

  res.json({
    success: true,
    data
  });
}));

export default router;
