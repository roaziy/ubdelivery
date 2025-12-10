import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireRestaurantOwner, optionalAuth } from '../middleware/auth.js';
import { uploadAndProcess, deleteImage } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// GET CATEGORIES
// ============================================

router.get('/categories', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { data: categories, error } = await supabaseAdmin
    .from('food_categories')
    .select('*')
    .eq('restaurant_id', req.restaurant.id)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  res.json({
    success: true,
    data: categories
  });
}));

// ============================================
// CREATE CATEGORY
// ============================================

router.post('/categories', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Ангиллын нэр шаардлагатай'
    });
  }

  // Get max sort order
  const { data: existing } = await supabaseAdmin
    .from('food_categories')
    .select('sort_order')
    .eq('restaurant_id', req.restaurant.id)
    .order('sort_order', { ascending: false })
    .limit(1);

  const sortOrder = existing?.length ? existing[0].sort_order + 1 : 1;

  const { data: category, error } = await supabaseAdmin
    .from('food_categories')
    .insert({
      restaurant_id: req.restaurant.id,
      name,
      sort_order: sortOrder
    })
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: category
  });
}));

// ============================================
// UPDATE CATEGORY
// ============================================

router.put('/categories/:id', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data: category, error } = await supabaseAdmin
    .from('food_categories')
    .update({ name })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: category
  });
}));

// ============================================
// DELETE CATEGORY
// ============================================

router.delete('/categories/:id', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('food_categories')
    .delete()
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Ангилал устгагдлаа'
  });
}));

// ============================================
// GET FOODS (Public or Restaurant Admin)
// ============================================

router.get('/foods', optionalAuth, asyncHandler(async (req, res) => {
  const { 
    restaurantId, categoryId, search, 
    isAvailable, page = 1, limit = 20 
  } = req.query;

  let query = supabaseAdmin
    .from('foods')
    .select(`
      *,
      category:food_categories(id, name)
    `, { count: 'exact' });

  // If restaurant admin, show their own foods
  if (req.user?.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id)
      .single();
    
    if (restaurant) {
      query = query.eq('restaurant_id', restaurant.id);
    }
  } else if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
    query = query.eq('is_available', true); // Public only sees available
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (isAvailable !== undefined) {
    query = query.eq('is_available', isAvailable === 'true');
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: foods, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: foods,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE FOOD
// ============================================

router.get('/foods/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: food, error } = await supabaseAdmin
    .from('foods')
    .select(`
      *,
      category:food_categories(id, name),
      restaurant:restaurants(id, name)
    `)
    .eq('id', id)
    .single();

  if (error || !food) {
    return res.status(404).json({
      success: false,
      message: 'Хоол олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: food
  });
}));

// ============================================
// CREATE FOOD
// ============================================

router.post('/foods', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const {
    name, description, price, category_id, categoryId,
    is_available, isAvailable, preparation_time, preparationTime
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Хоолны нэр болон үнэ шаардлагатай'
    });
  }

  const { data: food, error } = await supabaseAdmin
    .from('foods')
    .insert({
      restaurant_id: req.restaurant.id,
      category_id: category_id || categoryId,
      name,
      description,
      price: parseFloat(price),
      is_available: is_available ?? isAvailable ?? true,
      preparation_time: preparation_time || preparationTime || 15
    })
    .select(`
      *,
      category:food_categories(id, name)
    `)
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: food
  });
}));

// ============================================
// UPDATE FOOD
// ============================================

router.put('/foods/:id', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name, description, price, category_id, categoryId,
    is_available, isAvailable, preparation_time, preparationTime
  } = req.body;

  const updates = {
    updated_at: new Date().toISOString()
  };

  if (name) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price) updates.price = parseFloat(price);
  if (category_id || categoryId) updates.category_id = category_id || categoryId;
  if (is_available !== undefined || isAvailable !== undefined) {
    updates.is_available = is_available ?? isAvailable;
  }
  if (preparation_time || preparationTime) {
    updates.preparation_time = preparation_time || preparationTime;
  }

  const { data: food, error } = await supabaseAdmin
    .from('foods')
    .update(updates)
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .select(`
      *,
      category:food_categories(id, name)
    `)
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: food
  });
}));

// ============================================
// DELETE FOOD
// ============================================

router.delete('/foods/:id', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get food to delete image
  const { data: food } = await supabaseAdmin
    .from('foods')
    .select('image_url')
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .single();

  if (food?.image_url) {
    await deleteImage(food.image_url);
  }

  const { error } = await supabaseAdmin
    .from('foods')
    .delete()
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Хоол устгагдлаа'
  });
}));

// ============================================
// TOGGLE FOOD AVAILABILITY
// ============================================

router.patch('/foods/:id/availability', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  const { data: food, error } = await supabaseAdmin
    .from('foods')
    .update({ 
      is_available: isAvailable,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .select(`
      *,
      category:food_categories(id, name)
    `)
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: food
  });
}));

// ============================================
// UPLOAD FOOD IMAGE
// ============================================

router.post('/foods/:id/image', 
  verifyToken, 
  requireRestaurantOwner,
  uploadAndProcess('image', 'food', 'foods'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.uploadedImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Зураг олдсонгүй'
      });
    }

    // Get old image to delete
    const { data: oldFood } = await supabaseAdmin
      .from('foods')
      .select('image_url')
      .eq('id', id)
      .eq('restaurant_id', req.restaurant.id)
      .single();

    if (oldFood?.image_url) {
      await deleteImage(oldFood.image_url);
    }

    const { data: food, error } = await supabaseAdmin
      .from('foods')
      .update({ 
        image_url: req.uploadedImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('restaurant_id', req.restaurant.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: { url: req.uploadedImageUrl }
    });
  })
);

export default router;
