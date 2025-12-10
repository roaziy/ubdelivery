import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// GET NOTIFICATIONS
// ============================================

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, limit = 20, 
    unreadOnly, type 
  } = req.query;

  let query = supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact' });

  // For admin, get all admin notifications (user_id is null or matches)
  if (req.user.role === 'admin') {
    query = query.or(`user_id.eq.${req.user.id},user_id.is.null`);
  } else {
    query = query.eq('user_id', req.user.id);
  }

  if (unreadOnly === 'true') {
    query = query.eq('is_read', false);
  }

  if (type) {
    query = query.eq('type', type);
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: notifications, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: notifications,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET UNREAD COUNT
// ============================================

router.get('/unread-count', verifyToken, asyncHandler(async (req, res) => {
  let query = supabaseAdmin
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);

  if (req.user.role === 'admin') {
    query = query.or(`user_id.eq.${req.user.id},user_id.is.null`);
  } else {
    query = query.eq('user_id', req.user.id);
  }

  const { count, error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: { count: count || 0 }
  });
}));

// ============================================
// MARK NOTIFICATION AS READ
// ============================================

router.patch('/:id/read', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: notification, error } = await supabaseAdmin
    .from('notifications')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', id)
    .or(`user_id.eq.${req.user.id},user_id.is.null`)
    .select()
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Мэдэгдэл олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: notification
  });
}));

// ============================================
// MARK ALL AS READ
// ============================================

router.patch('/read-all', verifyToken, asyncHandler(async (req, res) => {
  let query = supabaseAdmin
    .from('notifications')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq('is_read', false);

  if (req.user.role === 'admin') {
    query = query.or(`user_id.eq.${req.user.id},user_id.is.null`);
  } else {
    query = query.eq('user_id', req.user.id);
  }

  const { error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    message: 'Бүх мэдэгдэл уншсан болголоо'
  });
}));

// ============================================
// DELETE NOTIFICATION
// ============================================

router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('notifications')
    .delete()
    .eq('id', id)
    .or(`user_id.eq.${req.user.id},user_id.is.null`);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Мэдэгдэл устгагдлаа'
  });
}));

// ============================================
// DELETE ALL READ NOTIFICATIONS
// ============================================

router.delete('/clear/read', verifyToken, asyncHandler(async (req, res) => {
  let query = supabaseAdmin
    .from('notifications')
    .delete()
    .eq('is_read', true);

  if (req.user.role === 'admin') {
    query = query.or(`user_id.eq.${req.user.id},user_id.is.null`);
  } else {
    query = query.eq('user_id', req.user.id);
  }

  const { error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    message: 'Уншсан мэдэгдлүүд устгагдлаа'
  });
}));

// ============================================
// SEND NOTIFICATION (Admin)
// ============================================

router.post('/send', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    userId, user_id, 
    type = 'system',
    title, message, 
    data 
  } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Гарчиг болон мессеж шаардлагатай'
    });
  }

  const { data: notification, error } = await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: userId || user_id, // null for broadcast to admins
      type,
      title,
      message,
      data: data || {}
    })
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: notification
  });
}));

// ============================================
// BROADCAST NOTIFICATION (Admin)
// ============================================

router.post('/broadcast', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    role, // 'all', 'users', 'drivers', 'restaurant_admins'
    type = 'system',
    title, message, 
    data 
  } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Гарчиг болон мессеж шаардлагатай'
    });
  }

  // Get target users
  let userQuery = supabaseAdmin.from('users').select('id');
  
  if (role === 'users') {
    userQuery = userQuery.eq('role', 'user');
  } else if (role === 'drivers') {
    userQuery = userQuery.eq('role', 'driver');
  } else if (role === 'restaurant_admins') {
    userQuery = userQuery.eq('role', 'restaurant_admin');
  }
  // 'all' gets everyone

  const { data: users } = await userQuery;

  if (!users?.length) {
    return res.status(400).json({
      success: false,
      message: 'Хэрэглэгч олдсонгүй'
    });
  }

  // Create notifications for all users
  const notifications = users.map(user => ({
    user_id: user.id,
    type,
    title,
    message,
    data: data || {}
  }));

  const { error } = await supabaseAdmin
    .from('notifications')
    .insert(notifications);

  if (error) throw error;

  res.json({
    success: true,
    message: `${notifications.length} хэрэглэгчид мэдэгдэл илгээгдлээ`
  });
}));

// ============================================
// GET NOTIFICATION SETTINGS (User)
// ============================================

router.get('/settings', verifyToken, asyncHandler(async (req, res) => {
  const { data: settings } = await supabaseAdmin
    .from('notification_settings')
    .select('*')
    .eq('user_id', req.user.id)
    .single();

  // Return defaults if not set
  const defaultSettings = {
    push_enabled: true,
    email_enabled: true,
    sms_enabled: true,
    order_updates: true,
    promotions: true,
    news: true
  };

  res.json({
    success: true,
    data: settings || defaultSettings
  });
}));

// ============================================
// UPDATE NOTIFICATION SETTINGS (User)
// ============================================

router.put('/settings', verifyToken, asyncHandler(async (req, res) => {
  const settings = req.body;

  const { data: existing } = await supabaseAdmin
    .from('notification_settings')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  let result;
  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('notification_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('notification_settings')
      .insert({
        user_id: req.user.id,
        ...settings
      })
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  res.json({
    success: true,
    data: result
  });
}));

export default router;
