import { Router } from 'express';
import bcrypt from 'bcryptjs';
import supabaseAdmin from '../config/supabase.js';
import { firebaseAuth } from '../config/firebase.js';
import { 
  generateToken, 
  verifyToken, 
  verifyFirebaseToken 
} from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ============================================
// WWW-USER: Firebase OTP Authentication
// ============================================

// Verify Firebase token and create/get user
router.post('/verify-otp', verifyFirebaseToken, asyncHandler(async (req, res) => {
  const { phone_number, uid } = req.firebaseUser;
  const { name } = req.body;

  // Clean phone number
  const phone = phone_number.replace('+976', '').replace(/\D/g, '');

  // Check if user exists
  let { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (!user) {
    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        phone,
        firebase_uid: uid,
        name: name || 'Хэрэглэгч',
        role: 'user',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    user = newUser;
  } else {
    // Update firebase_uid if needed
    if (user.firebase_uid !== uid) {
      await supabaseAdmin
        .from('users')
        .update({ firebase_uid: uid })
        .eq('id', user.id);
    }
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role
      }
    }
  });
}));

// ============================================
// RESTAURANT ADMIN: Email/Phone + Password Login
// ============================================

router.post('/restaurant/login', asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Имэйл/утас болон нууц үг шаардлагатай'
    });
  }

  // Find user by email or phone
  let query = supabaseAdmin.from('users').select('*');
  let searchValue = '';
  
  if (email) {
    query = query.eq('email', email);
    searchValue = email;
  } else {
    // Format phone number (remove +976 prefix if present, keep only digits)
    const cleanPhone = phone.replace(/^\+976/, '').replace(/\D/g, '');
    query = query.eq('phone', cleanPhone);
    searchValue = cleanPhone;
    console.log(`[Restaurant Login] Searching for phone: ${phone} -> cleaned: ${cleanPhone}`);
  }

  const { data: user, error } = await query.single();

  if (user) {
    console.log(`[Restaurant Login] User found: ${user.id}, role: ${user.role}, has_password: ${!!user.password_hash}, is_active: ${user.is_active}`);
  }

  // Better error handling - check if it's a "not found" error or other error
  if (error) {
    // If it's a "not found" error (PGRST116), return user not found
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      return res.status(401).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }
    // Log other errors for debugging
    console.error('Database error in restaurant login:', error);
    return res.status(500).json({
      success: false,
      message: 'Серверийн алдаа гарлаа'
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Хэрэглэгч олдсонгүй'
    });
  }

  // Check if user has password hash
  if (!user.password_hash) {
    return res.status(401).json({
      success: false,
      message: 'Нууц үг тохируулаагүй байна. Админаас нууц үг тохируулахыг хүснэ үү.'
    });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Нууц үг буруу байна'
    });
  }

  if (!user.is_active) {
    return res.status(403).json({
      success: false,
      message: 'Таны бүртгэл идэвхгүй байна'
    });
  }

  // Check if user is restaurant admin or owns a restaurant
  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle(); // Use maybeSingle instead of single to avoid error if no restaurant

  // Allow login if user has restaurant_admin role OR owns a restaurant
  if (user.role !== 'restaurant_admin' && !restaurant) {
    return res.status(403).json({
      success: false,
      message: 'Рестораны эрхгүй байна. Ресторан бүртгүүлсэн эсэхийг шалгана уу.'
    });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      restaurant: restaurant || null
    }
  });
}));

// ============================================
// DRIVER: Email/Phone + Password Login
// ============================================

router.post('/driver/login', asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Имэйл/утас болон нууц үг шаардлагатай'
    });
  }

  let query = supabaseAdmin.from('users').select('*');
  
  if (email) {
    query = query.eq('email', email);
  } else {
    query = query.eq('phone', phone);
  }

  const { data: user, error } = await query.single();

  if (error || !user) {
    return res.status(401).json({
      success: false,
      message: 'Хэрэглэгч олдсонгүй'
    });
  }

  if (user.role !== 'driver') {
    return res.status(403).json({
      success: false,
      message: 'Жолоочийн эрхгүй байна'
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
  
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Нууц үг буруу байна'
    });
  }

  // Get driver info
  const { data: driver } = await supabaseAdmin
    .from('drivers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!driver || driver.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Таны жолоочийн бүртгэл баталгаажаагүй байна'
    });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      driver
    }
  });
}));

// ============================================
// SUPER ADMIN: Email + Password Login
// ============================================

router.post('/admin/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Имэйл болон нууц үг шаардлагатай'
    });
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('role', 'super_admin')
    .single();

  if (error || !user) {
    return res.status(401).json({
      success: false,
      message: 'Админ олдсонгүй'
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
  
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Нууц үг буруу байна'
    });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
}));

// ============================================
// GET PROFILE
// ============================================

router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  const user = req.user;

  let additionalData = {};

  if (user.role === 'restaurant_admin') {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    additionalData.restaurant = restaurant;
  }

  if (user.role === 'driver') {
    const { data: driver } = await supabaseAdmin
      .from('drivers')
      .select('*')
      .eq('user_id', user.id)
      .single();
    additionalData.driver = driver;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role
      },
      ...additionalData
    }
  });
}));

// ============================================
// CHANGE PASSWORD (Own Password)
// ============================================

router.post('/change-password', verifyToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Одоогийн болон шинэ нууц үг шаардлагатай'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'
    });
  }

  // Get user with password hash
  const { data: userWithPassword, error } = await supabaseAdmin
    .from('users')
    .select('password_hash')
    .eq('id', user.id)
    .single();

  if (error || !userWithPassword) {
    return res.status(404).json({
      success: false,
      message: 'Хэрэглэгч олдсонгүй'
    });
  }

  // Verify current password
  if (!userWithPassword.password_hash) {
    return res.status(400).json({
      success: false,
      message: 'Одоогийн нууц үг тохируулаагүй байна'
    });
  }

  const isValidPassword = await bcrypt.compare(currentPassword, userWithPassword.password_hash);
  
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Одоогийн нууц үг буруу байна'
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).json({
      success: false,
      message: 'Нууц үг солиход алдаа гарлаа'
    });
  }

  res.json({
    success: true,
    message: 'Нууц үг амжилттай солигдлоо'
  });
}));

// ============================================
// UPDATE PROFILE
// ============================================

router.put('/me', verifyToken, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Өөрчлөх мэдээлэл оруулаагүй байна'
    });
  }

  const { data: updatedUser, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, email, phone, name, avatar_url, role')
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Профайл шинэчлэхэд алдаа гарлаа'
    });
  }

  res.json({
    success: true,
    data: updatedUser
  });
}));

// Alias for profile
router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  const user = req.user;

  let restaurant = null;
  if (user.role === 'restaurant_admin') {
    const { data } = await supabaseAdmin
      .from('restaurants')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    restaurant = data;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name
      },
      restaurant
    }
  });
}));

// ============================================
// UPDATE PROFILE
// ============================================

router.put('/profile', verifyToken, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  updates.updated_at = new Date().toISOString();

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url
    }
  });
}));

// ============================================
// VERIFY TOKEN
// ============================================

router.get('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: { valid: true }
  });
});

// ============================================
// LOGOUT
// ============================================

router.post('/logout', verifyToken, (req, res) => {
  // JWT is stateless, so we just return success
  // Client should remove the token
  res.json({
    success: true,
    message: 'Амжилттай гарлаа'
  });
});

export default router;
