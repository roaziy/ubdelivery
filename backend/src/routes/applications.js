import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { uploadAndProcess, deleteImage } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

const router = Router();

// ============================================
// GET APPLICATIONS
// ============================================

router.get('/', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { 
    type, status, page = 1, limit = 20, search 
  } = req.query;

  let query = supabaseAdmin
    .from('applications')
    .select('*', { count: 'exact' });

  if (type) {
    query = query.eq('type', type);
  }

  if (status) {
    query = query.eq('status', status);
  } else {
    // Default to pending
    query = query.eq('status', 'pending');
  }

  if (search) {
    query = query.or(`
      name.ilike.%${search}%,
      phone.ilike.%${search}%,
      email.ilike.%${search}%
    `);
  }

  query = query.order('created_at', { ascending: false });

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: applications, error, count } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data: {
      items: applications,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
}));

// ============================================
// GET SINGLE APPLICATION
// ============================================

router.get('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: application, error } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !application) {
    return res.status(404).json({
      success: false,
      message: 'Өргөдөл олдсонгүй'
    });
  }

  res.json({
    success: true,
    data: application
  });
}));

// ============================================
// SUBMIT RESTAURANT APPLICATION (Public)
// ============================================

// Custom middleware to make documents optional for restaurant applications
const uploadDocumentsOptional = (req, res, next) => {
  req.requireFile = false; // Mark file as optional
  uploadAndProcess('documents', 'document', 'applications')(req, res, next);
};

router.post('/restaurant', 
  uploadDocumentsOptional,
  asyncHandler(async (req, res) => {
    const {
      name, ownerName, owner_name,
      phone, email, address,
      cuisineType, cuisine_type,
      description, message
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Нэр болон утас шаардлагатай'
      });
    }

    // Check if already applied
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('phone', phone)
      .eq('type', 'restaurant')
      .in('status', ['pending', 'reviewing'])
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Энэ утасны дугаараар өргөдөл өгсөн байна'
      });
    }

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .insert({
        type: 'restaurant',
        name,
        owner_name: ownerName || owner_name || name, // Use restaurant name as fallback
        phone,
        email,
        address,
        cuisine_type: cuisineType || cuisine_type,
        description: description || message,
        documents: req.uploadedImageUrl ? [req.uploadedImageUrl] : [],
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for admin
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: null, // Will be sent to all admins
        type: 'new_application',
        title: 'Шинэ ресторан өргөдөл',
        message: `${name} ресторан бүртгүүлэх хүсэлт ирлээ`,
        data: { 
          application_id: application.id,
          type: 'restaurant'
        }
      });

    res.json({
      success: true,
      message: 'Өргөдөл амжилттай илгээгдлээ',
      data: application
    });
  })
);

// ============================================
// SUBMIT DRIVER APPLICATION (Public)
// ============================================

router.post('/driver',
  uploadAndProcess('documents', 'document', 'applications'),
  asyncHandler(async (req, res) => {
    const {
      fullName, full_name, name,
      phone, email,
      vehicleType, vehicle_type,
      vehicleNumber, vehicle_number,
      licenseNumber, license_number,
      experience, message
    } = req.body;

    const applicantName = fullName || full_name || name;

    if (!applicantName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Нэр болон утас шаардлагатай'
      });
    }

    // Check if already applied
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('phone', phone)
      .eq('type', 'driver')
      .in('status', ['pending', 'reviewing'])
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Энэ утасны дугаараар өргөдөл өгсөн байна'
      });
    }

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .insert({
        type: 'driver',
        name: applicantName,
        phone,
        email,
        vehicle_type: vehicleType || vehicle_type,
        vehicle_number: vehicleNumber || vehicle_number,
        license_number: licenseNumber || license_number,
        experience: parseInt(experience) || 0,
        description: message,
        documents: req.uploadedImageUrl ? [req.uploadedImageUrl] : [],
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for admin
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: null,
        type: 'new_application',
        title: 'Шинэ жолооч өргөдөл',
        message: `${applicantName} жолоочоор бүртгүүлэх хүсэлт ирлээ`,
        data: { 
          application_id: application.id,
          type: 'driver'
        }
      });

    res.json({
      success: true,
      message: 'Өргөдөл амжилттай илгээгдлээ',
      data: application
    });
  })
);

// ============================================
// APPROVE APPLICATION (Admin)
// ============================================

router.post('/:id/approve', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, notes } = req.body;

  // Get application
  const { data: application } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('id', id)
    .eq('status', 'pending')
    .single();

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Өргөдөл олдсонгүй эсвэл аль хэдийн шийдвэрлэгдсэн'
    });
  }

  // Generate password if not provided
  const userPassword = password || Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(userPassword, 12);

  // Create user account
  const role = application.type === 'restaurant' ? 'restaurant_admin' : 'driver';
  
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      email: application.email || `${application.phone}@ubdelivery.mn`,
      phone: application.phone,
      full_name: application.owner_name || application.name,
      password_hash: hashedPassword,
      role
    })
    .select()
    .single();

  if (userError) {
    if (userError.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Энэ утас эсвэл имэйлээр бүртгэл байна'
      });
    }
    throw userError;
  }

  // Create restaurant or driver
  if (application.type === 'restaurant') {
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .insert({
        owner_id: user.id,
        name: application.name,
        phone: application.phone,
        email: application.email,
        address: application.address,
        cuisine_type: application.cuisine_type,
        description: application.description,
        status: 'approved',
        is_active: true,
        is_open: true
      })
      .select()
      .single();

    if (restaurantError) {
      console.error('Error creating restaurant:', restaurantError);
      throw restaurantError;
    }

    // Create default food categories for new restaurant
    const defaultCategories = [
      { restaurant_id: restaurant.id, name: 'Үндсэн хоол', sort_order: 1 },
      { restaurant_id: restaurant.id, name: 'Хачир', sort_order: 2 },
      { restaurant_id: restaurant.id, name: 'Нэмэлт', sort_order: 3 }
    ];

    const { error: categoriesError } = await supabaseAdmin
      .from('food_categories')
      .insert(defaultCategories);

    if (categoriesError) {
      console.error('Error creating default categories:', categoriesError);
      // Don't throw - categories can be created later
    }
  } else {
    await supabaseAdmin
      .from('drivers')
      .insert({
        user_id: user.id,
        vehicle_type: application.vehicle_type || 'motorcycle',
        vehicle_number: application.vehicle_number,
        license_number: application.license_number,
        is_active: true,
        is_available: false
      });
  }

  // Update application
  await supabaseAdmin
    .from('applications')
    .update({
      status: 'approved',
      reviewed_by: req.user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: notes
    })
    .eq('id', id);

  // Send notification (in real app, also send SMS with password)
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: user.id,
      type: 'system',
      title: 'Бүртгэл баталгаажлаа',
      message: `Таны ${application.type === 'restaurant' ? 'ресторан' : 'жолооч'} 
        бүртгэл амжилттай баталгаажлаа. Нууц үг: ${userPassword}`
    });

  res.json({
    success: true,
    message: 'Өргөдөл амжилттай баталгаажлаа',
    data: {
      userId: user.id,
      password: userPassword // Return password so admin can share
    }
  });
}));

// ============================================
// REJECT APPLICATION (Admin)
// ============================================

router.post('/:id/reject', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, notes } = req.body;

  const { data: application, error } = await supabaseAdmin
    .from('applications')
    .update({
      status: 'rejected',
      rejection_reason: reason || 'Шаардлага хангаагүй',
      reviewed_by: req.user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: notes
    })
    .eq('id', id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !application) {
    return res.status(400).json({
      success: false,
      message: 'Өргөдөл татгалзах боломжгүй'
    });
  }

  res.json({
    success: true,
    message: 'Өргөдөл татгалзлаа'
  });
}));

// ============================================
// GET APPLICATION STATISTICS
// ============================================

router.get('/stats/summary', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { data: applications } = await supabaseAdmin
    .from('applications')
    .select('type, status');

  const stats = {
    total: applications?.length || 0,
    restaurant: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    driver: {
      pending: 0,
      approved: 0,
      rejected: 0
    }
  };

  applications?.forEach(app => {
    if (stats[app.type]) {
      stats[app.type][app.status]++;
    }
  });

  res.json({
    success: true,
    data: stats
  });
}));

export default router;
