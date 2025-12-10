import jwt from 'jsonwebtoken';
import supabaseAdmin from '../config/supabase.js';
import { firebaseAuth } from '../config/firebase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      role: user.role,
      email: user.email,
      phone: user.phone
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token middleware
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Токен олдсонгүй' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get fresh user data
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false, 
        message: 'Таны бүртгэл идэвхгүй байна' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Токены хугацаа дууссан' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Токен буруу байна' 
    });
  }
}

// Verify Firebase ID token (for OTP login)
export async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Firebase токен олдсонгүй' 
      });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Firebase токен буруу байна' 
    });
  }
}

// Role-based access control
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Нэвтрэх шаардлагатай' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Энэ үйлдлийг хийх эрхгүй байна' 
      });
    }

    next();
  };
}

// Optional auth - doesn't fail if no token
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (user && user.is_active) {
      req.user = user;
    }
  } catch {
    // Ignore errors for optional auth
  }
  
  next();
}

// Restaurant owner middleware
export async function requireRestaurantOwner(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Нэвтрэх шаардлагатай' 
      });
    }

    const { data: restaurant, error } = await supabaseAdmin
      .from('restaurants')
      .select('*')
      .eq('owner_id', req.user.id)
      .single();

    if (error || !restaurant) {
      return res.status(403).json({ 
        success: false, 
        message: 'Ресторан олдсонгүй' 
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Серверийн алдаа' 
    });
  }
}

// Driver middleware
export async function requireDriver(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Нэвтрэх шаардлагатай' 
      });
    }

    const { data: driver, error } = await supabaseAdmin
      .from('drivers')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error || !driver) {
      return res.status(403).json({ 
        success: false, 
        message: 'Жолоочийн мэдээлэл олдсонгүй' 
      });
    }

    if (driver.status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Таны бүртгэл баталгаажаагүй байна' 
      });
    }

    req.driver = driver;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Серверийн алдаа' 
    });
  }
}
