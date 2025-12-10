import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import restaurantsRoutes from './routes/restaurants.js';
import menuRoutes from './routes/menu.js';
import ordersRoutes from './routes/orders.js';
import reviewsRoutes from './routes/reviews.js';
import driversRoutes from './routes/drivers.js';
import applicationsRoutes from './routes/applications.js';
import notificationsRoutes from './routes/notifications.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import bannerRoutes from './routes/banners.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    process.env.WWW_USER_URL,
    process.env.RESTAURANT_ADMIN_URL,
    process.env.SUPER_ADMIN_URL,
    process.env.GO_DELIVERY_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/banners', bannerRoutes);

// Public restaurant endpoints for www-user
app.get('/api/public/restaurants', async (req, res, next) => {
  try {
    const { 
      page = 1, limit = 20, 
      cuisineType, search, 
      sortBy = 'rating' 
    } = req.query;

    const supabaseAdmin = (await import('./config/supabase.js')).default;

    let query = supabaseAdmin
      .from('restaurants')
      .select(`
        id, name, description, logo_url, banner_url,
        cuisine_type, address, rating, review_count,
        minimum_order, delivery_fee, delivery_time
      `, { count: 'exact' })
      .eq('is_active', true);

    if (cuisineType) {
      query = query.eq('cuisine_type', cuisineType);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,cuisine_type.ilike.%${search}%`);
    }

    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'deliveryTime') {
      query = query.order('delivery_time', { ascending: true });
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: true });
    }

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
  } catch (error) {
    next(error);
  }
});

app.get('/api/public/restaurants/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabaseAdmin = (await import('./config/supabase.js')).default;

    const { data: restaurant, error } = await supabaseAdmin
      .from('restaurants')
      .select(`
        *,
        categories:food_categories(
          id, name, sort_order,
          foods(
            id, name, description, price, image_url, 
            is_available, preparation_time
          )
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Ресторан олдсонгүй'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     UB Delivery API Server                ║
╠════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}            ║
║  📍 http://localhost:${PORT}                  ║
║  🔧 Environment: ${process.env.NODE_ENV || 'development'}       ║
╚════════════════════════════════════════════╝
  `);
});

export default app;
