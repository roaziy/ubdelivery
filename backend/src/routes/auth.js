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

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
  
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

  // Get restaurant info
  const { data: restaurant } = await supabaseAdmin
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

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
