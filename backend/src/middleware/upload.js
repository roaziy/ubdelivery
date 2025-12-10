import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import supabaseAdmin from '../config/supabase.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Зөвхөн JPEG, PNG, WebP зураг оруулна уу'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  }
});

// Image compression configurations
const imageConfigs = {
  logo: { width: 256, height: 256, quality: 80 },
  banner: { width: 800, height: 300, quality: 75 },
  food: { width: 400, height: 400, quality: 75 },
  avatar: { width: 128, height: 128, quality: 80 },
  document: { width: 1200, height: 1200, quality: 70 }
};

// Compress and upload image to Supabase Storage
export async function processAndUploadImage(
  buffer, 
  type = 'food', 
  folder = 'images'
) {
  try {
    const config = imageConfigs[type] || imageConfigs.food;
    const fileName = `${folder}/${uuidv4()}.webp`;

    // Compress image using Sharp
    const compressedBuffer = await sharp(buffer)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: config.quality })
      .toBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(fileName, compressedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error('Зураг хадгалахад алдаа гарлаа');
    }

    // Get public URL - ensure we return the correct format
    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(fileName);

    // Return the public URL - this should be in format:
    // https://[project].supabase.co/storage/v1/object/public/uploads/[path]
    const publicUrl = urlData?.publicUrl || urlData;
    
    // Log for debugging
    console.log('Uploaded image URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
}

// Delete image from storage
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) return;

    // Extract file path from URL
    const urlParts = imageUrl.split('/uploads/');
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    await supabaseAdmin.storage
      .from('uploads')
      .remove([filePath]);
  } catch (error) {
    console.error('Delete image error:', error);
  }
}

// Upload middleware with processing
export function uploadAndProcess(fieldName, type = 'food', folder = 'images') {
  return async (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'Файлын хэмжээ хэт их байна (max 10MB)'
            });
          }
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (req.file) {
        try {
          const imageUrl = await processAndUploadImage(
            req.file.buffer,
            type,
            folder
          );
          req.uploadedImageUrl = imageUrl;
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: 'Зураг боловсруулахад алдаа гарлаа'
          });
        }
      }

      next();
    });
  };
}
