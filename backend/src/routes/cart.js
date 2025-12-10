import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// GET CART
// ============================================

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  // Get or create cart
  let { data: cart } = await supabaseAdmin
    .from('carts')
    .select(`
      *,
      restaurant:restaurants(id, name, logo_url, minimum_order),
      items:cart_items(
        id, quantity,
        food:foods(id, name, price, image_url, is_available)
      )
    `)
    .eq('user_id', req.user.id)
    .single();

  if (!cart) {
    const { data: newCart } = await supabaseAdmin
      .from('carts')
      .insert({ user_id: req.user.id })
      .select()
      .single();
    cart = { ...newCart, items: [] };
  }

  // Calculate totals
  let subtotal = 0;
  const items = cart.items?.map(item => {
    const itemTotal = item.food.price * item.quantity;
    subtotal += itemTotal;
    return {
      ...item,
      total: itemTotal
    };
  }) || [];

  res.json({
    success: true,
    data: {
      ...cart,
      items,
      subtotal,
      deliveryFee: cart.restaurant_id ? 3000 : 0,
      total: subtotal + (cart.restaurant_id ? 3000 : 0)
    }
  });
}));

// ============================================
// ADD ITEM TO CART
// ============================================

router.post('/items', verifyToken, asyncHandler(async (req, res) => {
  const { foodId, food_id, quantity = 1 } = req.body;
  const targetFoodId = foodId || food_id;

  if (!targetFoodId) {
    return res.status(400).json({
      success: false,
      message: 'Хоолны ID шаардлагатай'
    });
  }

  // Get food and its restaurant
  const { data: food } = await supabaseAdmin
    .from('foods')
    .select('id, restaurant_id, price, is_available')
    .eq('id', targetFoodId)
    .single();

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Хоол олдсонгүй'
    });
  }

  if (!food.is_available) {
    return res.status(400).json({
      success: false,
      message: 'Энэ хоол одоогоор байхгүй байна'
    });
  }

  // Get or create cart
  let { data: cart } = await supabaseAdmin
    .from('carts')
    .select('id, restaurant_id')
    .eq('user_id', req.user.id)
    .single();

  if (!cart) {
    const { data: newCart } = await supabaseAdmin
      .from('carts')
      .insert({ 
        user_id: req.user.id,
        restaurant_id: food.restaurant_id
      })
      .select()
      .single();
    cart = newCart;
  }

  // Check if cart has items from different restaurant
  if (cart.restaurant_id && cart.restaurant_id !== food.restaurant_id) {
    return res.status(400).json({
      success: false,
      message: 'Өөр рестораны хоол сагсанд байна. Эхлээд сагсаа хоослоно уу.',
      code: 'DIFFERENT_RESTAURANT'
    });
  }

  // Update cart restaurant if needed
  if (!cart.restaurant_id) {
    await supabaseAdmin
      .from('carts')
      .update({ restaurant_id: food.restaurant_id })
      .eq('id', cart.id);
  }

  // Check if item already exists
  const { data: existingItem } = await supabaseAdmin
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('food_id', targetFoodId)
    .single();

  if (existingItem) {
    // Update quantity
    await supabaseAdmin
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
  } else {
    // Add new item
    await supabaseAdmin
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        food_id: targetFoodId,
        quantity
      });
  }

  // Return updated cart
  const { data: updatedCart } = await supabaseAdmin
    .from('carts')
    .select(`
      *,
      restaurant:restaurants(id, name, logo_url),
      items:cart_items(
        id, quantity,
        food:foods(id, name, price, image_url)
      )
    `)
    .eq('id', cart.id)
    .single();

  res.json({
    success: true,
    data: updatedCart
  });
}));

// ============================================
// UPDATE ITEM QUANTITY
// ============================================

router.patch('/items/:itemId', verifyToken, asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Тоо хэмжээ 1-ээс багагүй байх ёстой'
    });
  }

  // Get cart
  const { data: cart } = await supabaseAdmin
    .from('carts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Сагс олдсонгүй'
    });
  }

  // Update item
  const { data: item, error } = await supabaseAdmin
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('cart_id', cart.id)
    .select()
    .single();

  if (error || !item) {
    return res.status(404).json({
      success: false,
      message: 'Бараа олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: item
  });
}));

// ============================================
// REMOVE ITEM FROM CART
// ============================================

router.delete('/items/:itemId', verifyToken, asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Get cart
  const { data: cart } = await supabaseAdmin
    .from('carts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Сагс олдсонгүй'
    });
  }

  // Delete item
  await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('cart_id', cart.id);

  // Check if cart is empty
  const { count } = await supabaseAdmin
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('cart_id', cart.id);

  // Clear restaurant if cart is empty
  if (count === 0) {
    await supabaseAdmin
      .from('carts')
      .update({ restaurant_id: null })
      .eq('id', cart.id);
  }

  res.json({
    success: true,
    message: 'Бараа устгагдлаа'
  });
}));

// ============================================
// CLEAR CART
// ============================================

router.delete('/clear', verifyToken, asyncHandler(async (req, res) => {
  // Get cart
  const { data: cart } = await supabaseAdmin
    .from('carts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (cart) {
    // Delete all items
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    // Clear restaurant
    await supabaseAdmin
      .from('carts')
      .update({ restaurant_id: null })
      .eq('id', cart.id);
  }

  res.json({
    success: true,
    message: 'Сагс хоосолсон'
  });
}));

// ============================================
// CHECKOUT (Create Order from Cart)
// ============================================

router.post('/checkout', verifyToken, asyncHandler(async (req, res) => {
  const { 
    deliveryAddress, delivery_address,
    deliveryNotes, delivery_notes,
    paymentMethod, payment_method
  } = req.body;

  const address = deliveryAddress || delivery_address;
  const notes = deliveryNotes || delivery_notes;
  const payment = paymentMethod || payment_method || 'cash';

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Хүргэлтийн хаяг шаардлагатай'
    });
  }

  // Get cart with items
  const { data: cart } = await supabaseAdmin
    .from('carts')
    .select(`
      *,
      restaurant:restaurants(id, minimum_order, is_active),
      items:cart_items(
        id, quantity,
        food:foods(id, name, price, is_available)
      )
    `)
    .eq('user_id', req.user.id)
    .single();

  if (!cart || !cart.items?.length) {
    return res.status(400).json({
      success: false,
      message: 'Сагс хоосон байна'
    });
  }

  if (!cart.restaurant?.is_active) {
    return res.status(400).json({
      success: false,
      message: 'Ресторан одоогоор ажиллахгүй байна'
    });
  }

  // Check item availability
  const unavailableItems = cart.items.filter(item => !item.food.is_available);
  if (unavailableItems.length) {
    return res.status(400).json({
      success: false,
      message: 'Зарим хоол одоогоор байхгүй байна',
      data: unavailableItems.map(i => i.food.name)
    });
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = cart.items.map(item => {
    const price = item.food.price;
    subtotal += price * item.quantity;
    return {
      food_id: item.food.id,
      quantity: item.quantity,
      price
    };
  });

  // Check minimum order
  if (cart.restaurant.minimum_order && subtotal < cart.restaurant.minimum_order) {
    return res.status(400).json({
      success: false,
      message: `Хамгийн бага захиалга: ${cart.restaurant.minimum_order}₮`
    });
  }

  const deliveryFee = 3000;
  const totalAmount = subtotal + deliveryFee;

  // Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: req.user.id,
      restaurant_id: cart.restaurant_id,
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

  // Clear cart
  await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);

  await supabaseAdmin
    .from('carts')
    .update({ restaurant_id: null })
    .eq('id', cart.id);

  // Create notification for restaurant owner
  const { data: restaurant } = await supabaseAdmin
    .from('restaurants')
    .select('owner_id')
    .eq('id', cart.restaurant_id)
    .single();

  if (restaurant) {
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: restaurant.owner_id,
        type: 'new_order',
        title: 'Шинэ захиалга',
        message: `Шинэ захиалга #${order.order_number}`,
        data: { order_id: order.id }
      });
  }

  res.json({
    success: true,
    data: order
  });
}));

export default router;
