import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { 
  verifyToken, requireAdmin, requireRestaurantOwner 
} from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// GET REVIEWS (Role-based)
// ============================================

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, limit = 20, 
    rating, replied, startDate, endDate 
  } = req.query;

  let query = supabaseAdmin
    .from('reviews')
    .select(`
      *,
      user:users!reviews_user_id_fkey(id, full_name, avatar_url),
      order:orders(id, order_number),
      restaurant:restaurants(id, name)
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
  }
  // Admin sees all reviews

  if (rating) {
    query = query.eq('food_rating', parseInt(rating));
  }

  if (replied === 'true') {
    query = query.not('reply', 'is', null);
  } else if (replied === 'false') {
    query = query.is('reply', null);
  }

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: reviews, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: reviews,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE REVIEW
// ============================================

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .select(`
      *,
      user:users!reviews_user_id_fkey(id, full_name, avatar_url),
      order:orders(id, order_number, items:order_items(
        food:foods(id, name)
      ))
    `)
    .eq('id', id)
    .single();

  if (error || !review) {
    return res.status(404).json({
      success: false,
      message: 'Үнэлгээ олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: review
  });
}));

// ============================================
// CREATE REVIEW (User)
// ============================================

router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    order_id, orderId,
    food_rating, foodRating,
    delivery_rating, deliveryRating,
    comment 
  } = req.body;

  const orderIdValue = order_id || orderId;
  const foodRatingValue = food_rating || foodRating;
  const deliveryRatingValue = delivery_rating || deliveryRating;

  if (!orderIdValue || !foodRatingValue) {
    return res.status(400).json({
      success: false,
      message: 'Захиалга болон үнэлгээ шаардлагатай'
    });
  }

  // Get order and verify ownership
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, user_id, restaurant_id, driver_id, status')
    .eq('id', orderIdValue)
    .single();

  if (!order || order.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Энэ захиалгыг үнэлэх эрхгүй'
    });
  }

  if (order.status !== 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Зөвхөн хүргэгдсэн захиалгыг үнэлэх боломжтой'
    });
  }

  // Check if already reviewed
  const { data: existingReview } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('order_id', orderIdValue)
    .single();

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'Энэ захиалгыг өмнө нь үнэлсэн'
    });
  }

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      order_id: orderIdValue,
      user_id: req.user.id,
      restaurant_id: order.restaurant_id,
      driver_id: order.driver_id,
      food_rating: foodRatingValue,
      delivery_rating: deliveryRatingValue,
      comment
    })
    .select()
    .single();

  if (error) throw error;

  // Update restaurant average rating
  await updateRestaurantRating(order.restaurant_id);

  // Update driver average rating if exists
  if (order.driver_id && deliveryRatingValue) {
    await updateDriverRating(order.driver_id);
  }

  res.json({
    success: true,
    data: review
  });
}));

// ============================================
// REPLY TO REVIEW (Restaurant)
// ============================================

router.post('/:id/reply', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({
      success: false,
      message: 'Хариулт шаардлагатай'
    });
  }

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .update({
      reply,
      replied_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .select()
    .single();

  if (error || !review) {
    return res.status(400).json({
      success: false,
      message: 'Хариулт илгээх боломжгүй'
    });
  }

  // Notify user
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: review.user_id,
      type: 'review_reply',
      title: 'Үнэлгээнд хариулт ирлээ',
      message: 'Таны үнэлгээнд хариулт ирлээ',
      data: { review_id: review.id }
    });

  res.json({
    success: true,
    data: review
  });
}));

// ============================================
// UPDATE REPLY (Restaurant)
// ============================================

router.put('/:id/reply', verifyToken, requireRestaurantOwner, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .update({ reply })
    .eq('id', id)
    .eq('restaurant_id', req.restaurant.id)
    .select()
    .single();

  if (error || !review) {
    return res.status(400).json({
      success: false,
      message: 'Хариулт засах боломжгүй'
    });
  }

  res.json({
    success: true,
    data: review
  });
}));

// ============================================
// DELETE REVIEW (Admin)
// ============================================

router.delete('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('restaurant_id, driver_id')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Recalculate ratings
  if (review) {
    await updateRestaurantRating(review.restaurant_id);
    if (review.driver_id) {
      await updateDriverRating(review.driver_id);
    }
  }

  res.json({
    success: true,
    message: 'Үнэлгээ устгагдлаа'
  });
}));

// ============================================
// GET REVIEW STATISTICS
// ============================================

router.get('/stats/summary', verifyToken, asyncHandler(async (req, res) => {
  let restaurantId = null;

  if (req.user.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id)
      .single();
    restaurantId = restaurant?.id;
  }

  let query = supabaseAdmin.from('reviews').select('*');
  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data: reviews } = await query;

  if (!reviews?.length) {
    return res.json({
      success: true,
      data: {
        total: 0,
        averageRating: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        replied: 0,
        unreplied: 0
      }
    });
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  let replied = 0;

  reviews.forEach(review => {
    distribution[review.food_rating]++;
    totalRating += review.food_rating;
    if (review.reply) replied++;
  });

  res.json({
    success: true,
    data: {
      total: reviews.length,
      averageRating: (totalRating / reviews.length).toFixed(1),
      distribution,
      replied,
      unreplied: reviews.length - replied
    }
  });
}));

// ============================================
// HELPER FUNCTIONS
// ============================================

async function updateRestaurantRating(restaurantId) {
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('food_rating')
    .eq('restaurant_id', restaurantId);

  if (!reviews?.length) return;

  const avgRating = reviews.reduce((sum, r) => sum + r.food_rating, 0) / reviews.length;

  await supabaseAdmin
    .from('restaurants')
    .update({ 
      rating: parseFloat(avgRating.toFixed(1)),
      review_count: reviews.length
    })
    .eq('id', restaurantId);
}

async function updateDriverRating(driverId) {
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('delivery_rating')
    .eq('driver_id', driverId)
    .not('delivery_rating', 'is', null);

  if (!reviews?.length) return;

  const avgRating = reviews.reduce((sum, r) => sum + r.delivery_rating, 0) / reviews.length;

  await supabaseAdmin
    .from('drivers')
    .update({ 
      rating: parseFloat(avgRating.toFixed(1)),
      total_reviews: reviews.length
    })
    .eq('id', driverId);
}

export default router;
