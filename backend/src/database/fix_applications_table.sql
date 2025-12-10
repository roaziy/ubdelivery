-- =============================================
-- FIX APPLICATIONS TABLE - Add Missing Columns
-- Run this in Supabase SQL Editor
-- =============================================
-- Add missing columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS cuisine_type VARCHAR(100);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(50);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0;
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS documents TEXT [];
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
-- Make sure type and status columns exist
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS address TEXT;
-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON applications(phone);
-- =============================================
-- Also make sure users table has all columns
-- =============================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
-- =============================================
-- Make sure restaurants table has all columns
-- =============================================
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS minimum_order DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 3000;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_time INTEGER DEFAULT 30;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS cuisine_type VARCHAR(100);
-- =============================================
-- Make sure drivers table has all columns
-- =============================================
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT false;
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(50);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS total_deliveries INTEGER DEFAULT 0;
-- =============================================
-- Make sure orders table has all columns
-- =============================================
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number VARCHAR(20);
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2);
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2);
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
-- =============================================
-- Verify: Show applications table columns
-- =============================================
SELECT column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'applications'
ORDER BY ordinal_position;