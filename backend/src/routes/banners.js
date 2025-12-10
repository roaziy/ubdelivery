import { Router } from 'express';
import supabaseAdmin from '../config/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadAndProcess } from '../middleware/upload.js';

const router = Router();

// ============================================
// GET ALL BANNERS (Public)
// ============================================

router.get('/', asyncHandler(async (req, res) => {
  const { active } = req.query;
  
  let query = supabaseAdmin
    .from('commercial_banners')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (active === 'true') {
    query = query.eq('is_active', true);
  }
  
  const { data: banners, error } = await query;
  
  if (error) throw error;
  
  res.json({
    success: true,
    data: banners || []
  });
}));

// ============================================
// GET SINGLE BANNER
// ============================================

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const { data: banner, error } = await supabaseAdmin
    .from('commercial_banners')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !banner) {
    return res.status(404).json({
      success: false,
      message: 'Баннер олдсонгүй'
    });
  }
  
  res.json({
    success: true,
    data: banner
  });
}));

// ============================================
// CREATE BANNER (Admin only)
// ============================================

router.post(
  '/',
  verifyToken,
  requireAdmin,
  uploadAndProcess('image', 'banner', 'banners'),
  asyncHandler(async (req, res) => {
    const { title, link, is_active, sort_order } = req.body;
    
    if (!req.uploadedImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Зураг шаардлагатай'
      });
    }
    
    const { data: banner, error } = await supabaseAdmin
      .from('commercial_banners')
      .insert({
        title: title || null,
        image_url: req.uploadedImageUrl,
        link: link || null,
        is_active: is_active === 'true' || is_active === true,
        sort_order: sort_order ? parseInt(sort_order) : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: banner
    });
  })
);

// ============================================
// UPDATE BANNER (Admin only)
// ============================================

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, link, is_active, sort_order } = req.body;
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (link !== undefined) updateData.link = link;
    if (is_active !== undefined) updateData.is_active = is_active === 'true' || is_active === true;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);
    
    const { data: banner, error } = await supabaseAdmin
      .from('commercial_banners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !banner) {
      return res.status(404).json({
        success: false,
        message: 'Баннер олдсонгүй'
      });
    }
    
    res.json({
      success: true,
      data: banner
    });
  })
);

// ============================================
// UPDATE BANNER IMAGE (Admin only)
// ============================================

router.post(
  '/:id/image',
  verifyToken,
  requireAdmin,
  uploadAndProcess('image', 'banner', 'banners'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!req.uploadedImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Зураг олдсонгүй'
      });
    }
    
    // Get old banner to delete old image
    const { data: oldBanner } = await supabaseAdmin
      .from('commercial_banners')
      .select('image_url')
      .eq('id', id)
      .single();
    
    const { data: banner, error } = await supabaseAdmin
      .from('commercial_banners')
      .update({
        image_url: req.uploadedImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !banner) {
      return res.status(404).json({
        success: false,
        message: 'Баннер олдсонгүй'
      });
    }
    
    res.json({
      success: true,
      data: banner
    });
  })
);

// ============================================
// DELETE BANNER (Admin only)
// ============================================

router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin
      .from('commercial_banners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Баннер устгагдлаа'
    });
  })
);

export default router;

