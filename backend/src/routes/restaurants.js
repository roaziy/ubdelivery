import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireRestaurantOwner } from '../middleware/auth.js';
import { uploadAndProcess, deleteImage } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// PUBLIC: Get all approved restaurants
// ============================================

router.get('/', asyncHandler(async (req, res) => {
  const { 
    q, category, sortBy = 'rating', 
    page = 1, limit = 20, lat, lng 
  } = req.query;

  let query = supabaseAdmin
    .from('restaurants')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');

  // Search by name
  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  // Filter by cuisine type
  if (category) {
    query = query.eq('cuisine_type', category);
  }

  // Sorting
  if (sortBy === 'rating') {
    query = query.order('rating', { ascending: false });
  } else if (sortBy === 'orders') {
    query = query.order('total_orders', { ascending: false });
  } else if (sortBy === 'new') {
    query = query.order('created_at', { ascending: false });
  }

  // Pagination
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
// PUBLIC: Get restaurant by ID
// ============================================

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: restaurant, error } = await supabaseAdmin
    .from('restaurants')
    .select(`
      *,
      food_categories (
        id, name, sort_order
      )
    `)
    .eq('id', id)
    .single();

  if (error || !restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Ресторан олдсонгүй'
    });
  }

  // Get foods grouped by category
  const { data: foods } = await supabaseAdmin
    .from('foods')
    .select('*')
    .eq('restaurant_id', id)
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  res.json({
    success: true,
    data: {
      ...restaurant,
      foods: foods || []
    }
  });
}));

// ============================================
// RESTAURANT ADMIN: Get own restaurant
// ============================================

router.get('/me', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.restaurant
  });
}));

// ============================================
// RESTAURANT ADMIN: Get settings
// ============================================

router.get('/me/settings', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const r = req.restaurant;
  
  res.json({
    success: true,
    data: {
      restaurantName: r.name,
      cuisineType: r.cuisine_type,
      coordinates: r.latitude && r.longitude 
        ? `${r.latitude}, ${r.longitude}` 
        : '',
      phone: r.phone,
      email: r.email,
      isActive: r.is_open,
      openTime: r.open_time,
      closeTime: r.close_time,
      logoUrl: r.logo_url,
      bannerUrl: r.banner_url
    }
  });
}));

// ============================================
// RESTAURANT ADMIN: Update restaurant
// ============================================

router.put('/me', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant.id;
  const {
    name, restaurantName, description, cuisine_type, cuisineType,
    phone, email, address, coordinates,
    is_open, isActive, is_24_hours,
    open_time, openTime, close_time, closeTime,
    bank_account, bank_name, account_holder
  } = req.body;

  // Parse coordinates if provided
  let latitude, longitude;
  if (coordinates) {
    const parts = coordinates.split(',').map(s => s.trim());
    if (parts.length === 2) {
      latitude = parseFloat(parts[0]);
      longitude = parseFloat(parts[1]);
    }
  }

  const updates = {
    updated_at: new Date().toISOString()
  };

  // Map various field names
  if (name || restaurantName) updates.name = name || restaurantName;
  if (description) updates.description = description;
  if (cuisine_type || cuisineType) updates.cuisine_type = cuisine_type || cuisineType;
  if (phone) updates.phone = phone;
  if (email) updates.email = email;
  if (address) updates.address = address;
  if (latitude) updates.latitude = latitude;
  if (longitude) updates.longitude = longitude;
  if (is_open !== undefined || isActive !== undefined) {
    updates.is_open = is_open !== undefined ? is_open : isActive;
  }
  if (is_24_hours !== undefined) updates.is_24_hours = is_24_hours;
  if (open_time || openTime) updates.open_time = open_time || openTime;
  if (close_time || closeTime) updates.close_time = close_time || closeTime;
  if (bank_account) updates.bank_account = bank_account;
  if (bank_name) updates.bank_name = bank_name;
  if (account_holder) updates.account_holder = account_holder;

  const { data: restaurant, error } = await supabaseAdmin
    .from('restaurants')
    .update(updates)
    .eq('id', restaurantId)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: restaurant
  });
}));

// ============================================
// RESTAURANT ADMIN: Upload logo
// ============================================

router.post('/me/logo', 
  verifyToken, 
  requireRestaurantOwner,
  uploadAndProcess('logo', 'logo', 'restaurants/logos'),
  asyncHandler(async (req, res) => {
    if (!req.uploadedImageUrl) {
      console.error('Logo upload failed: uploadedImageUrl is missing');
      return res.status(400).json({
        success: false,
        message: 'Зураг олдсонгүй'
      });
    }

    // Delete old logo
    if (req.restaurant.logo_url) {
      await deleteImage(req.restaurant.logo_url);
    }

    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .update({ 
        logo_url: req.uploadedImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.restaurant.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: { url: req.uploadedImageUrl }
    });
  })
);

// ============================================
// RESTAURANT ADMIN: Upload banner
// ============================================

router.post('/me/banner', 
  verifyToken, 
  requireRestaurantOwner,
  uploadAndProcess('banner', 'banner', 'restaurants/banners'),
  asyncHandler(async (req, res) => {
    if (!req.uploadedImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Зураг олдсонгүй'
      });
    }

    if (req.restaurant.banner_url) {
      await deleteImage(req.restaurant.banner_url);
    }

    const { error } = await supabaseAdmin
      .from('restaurants')
      .update({ 
        banner_url: req.uploadedImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.restaurant.id);

    if (error) throw error;

    res.json({
      success: true,
      data: { url: req.uploadedImageUrl }
    });
  })
);

// ============================================
// RESTAURANT ADMIN: Get setup status
// ============================================

router.get('/me/setup-status', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      completed: req.restaurant.setup_completed,
      step: req.restaurant.setup_completed ? 4 : 1
    }
  });
}));

// ============================================
// RESTAURANT ADMIN: Complete setup
// ============================================

router.post('/me/complete-setup', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { is24Hours, openTime, closeTime, bankAccount } = req.body;

  const updates = {
    setup_completed: true,
    updated_at: new Date().toISOString()
  };

  if (is24Hours !== undefined) updates.is_24_hours = is24Hours;
  if (openTime) updates.open_time = openTime;
  if (closeTime) updates.close_time = closeTime;
  if (bankAccount) updates.bank_account = bankAccount;

  const { data: restaurant, error } = await supabaseAdmin
    .from('restaurants')
    .update(updates)
    .eq('id', req.restaurant.id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: restaurant
  });
}));

// ============================================
// RESTAURANT ADMIN: Toggle open status
// ============================================

router.patch('/me/status', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { isOpen } = req.body;

  const { data, error } = await supabaseAdmin
    .from('restaurants')
    .update({ 
      is_open: isOpen,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.restaurant.id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: { isOpen: data.is_open }
  });
}));

export default router;
