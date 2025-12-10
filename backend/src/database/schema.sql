-- =============================================
-- UB DELIVERY DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE user_role AS ENUM (
    'user',
    'restaurant_admin',
    'driver',
    'super_admin'
);
CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'delivering',
    'delivered',
    'cancelled'
);
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE application_type AS ENUM ('restaurant', 'driver');
CREATE TYPE transaction_type AS ENUM ('order', 'payout', 'refund', 'commission');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    firebase_uid VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
-- =============================================
-- RESTAURANTS TABLE
-- =============================================
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cuisine_type VARCHAR(100),
        logo_url TEXT,
        banner_url TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_open BOOLEAN DEFAULT false,
        is_24_hours BOOLEAN DEFAULT false,
        open_time TIME DEFAULT '09:00',
        close_time TIME DEFAULT '22:00',
        rating DECIMAL(3, 2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        total_orders INTEGER DEFAULT 0,
        status application_status DEFAULT 'pending',
        setup_completed BOOLEAN DEFAULT false,
        bank_account VARCHAR(50),
        bank_name VARCHAR(100),
        account_holder VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_is_open ON restaurants(is_open);
-- =============================================
-- DRIVERS TABLE
-- =============================================
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    license_number VARCHAR(100),
    license_image_url TEXT,
    profile_image_url TEXT,
    is_available BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status application_status DEFAULT 'pending',
    total_deliveries INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    account_holder VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_drivers_user ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_available ON drivers(is_available, is_online);
-- =============================================
-- FOOD CATEGORIES TABLE
-- =============================================
CREATE TABLE food_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_food_categories_restaurant ON food_categories(restaurant_id);
-- =============================================
-- FOODS TABLE
-- =============================================
CREATE TABLE foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES food_categories(id) ON DELETE
    SET NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        preparation_time INTEGER DEFAULT 15,
        total_orders INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_foods_restaurant ON foods(restaurant_id);
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_foods_available ON foods(is_available);
-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE
    SET NULL,
        driver_id UUID REFERENCES drivers(id) ON DELETE
    SET NULL,
        status order_status DEFAULT 'pending',
        delivery_address TEXT NOT NULL,
        delivery_latitude DECIMAL(10, 8),
        delivery_longitude DECIMAL(11, 8),
        delivery_distance DECIMAL(5, 2),
        subtotal DECIMAL(10, 2) NOT NULL,
        delivery_fee DECIMAL(10, 2) NOT NULL,
        platform_fee DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        estimated_delivery TIMESTAMP WITH TIME ZONE,
        confirmed_at TIMESTAMP WITH TIME ZONE,
        preparing_at TIMESTAMP WITH TIME ZONE,
        ready_at TIMESTAMP WITH TIME ZONE,
        picked_up_at TIMESTAMP WITH TIME ZONE,
        delivered_at TIMESTAMP WITH TIME ZONE,
        cancelled_at TIMESTAMP WITH TIME ZONE,
        cancelled_by UUID REFERENCES users(id),
        cancel_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE
    SET NULL,
        food_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
        driver_id UUID REFERENCES drivers(id) ON DELETE
    SET NULL,
        food_rating INTEGER CHECK (
            food_rating >= 1
            AND food_rating <= 5
        ),
        delivery_rating INTEGER CHECK (
            delivery_rating >= 1
            AND delivery_rating <= 5
        ),
        comment TEXT,
        reply TEXT,
        replied_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
-- =============================================
-- APPLICATIONS TABLE
-- =============================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        type application_type NOT NULL,
        business_name VARCHAR(255),
        owner_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        description TEXT,
        documents JSONB DEFAULT '[]',
        status application_status DEFAULT 'pending',
        reviewed_by UUID REFERENCES users(id),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(type);
-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
-- =============================================
-- CARTS TABLE
-- =============================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);
CREATE INDEX idx_carts_user ON carts(user_id);
-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, food_id)
);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE
    SET NULL,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE
    SET NULL,
        driver_id UUID REFERENCES drivers(id) ON DELETE
    SET NULL,
        type transaction_type NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        status transaction_status DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_transactions_restaurant ON transactions(restaurant_id);
CREATE INDEX idx_transactions_driver ON transactions(driver_id);
-- =============================================
-- SAVED ADDRESSES TABLE
-- =============================================
CREATE TABLE saved_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_saved_addresses_user ON saved_addresses(user_id);
-- =============================================
-- FUNCTIONS
-- =============================================
-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$
DECLARE today_count INTEGER;
new_number TEXT;
BEGIN
SELECT COUNT(*) + 1 INTO today_count
FROM orders
WHERE DATE(created_at) = CURRENT_DATE;
new_number := '#' || LPAD(today_count::TEXT, 4, '0');
RETURN new_number;
END;
$$ LANGUAGE plpgsql;
-- Update restaurant rating function
CREATE OR REPLACE FUNCTION update_restaurant_rating() RETURNS TRIGGER AS $$ BEGIN
UPDATE restaurants
SET rating = (
        SELECT COALESCE(AVG(food_rating), 0)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
    )
WHERE id = NEW.restaurant_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Update driver rating function
CREATE OR REPLACE FUNCTION update_driver_rating() RETURNS TRIGGER AS $$ BEGIN IF NEW.driver_id IS NOT NULL THEN
UPDATE drivers
SET rating = (
        SELECT COALESCE(AVG(delivery_rating), 0)
        FROM reviews
        WHERE driver_id = NEW.driver_id
            AND delivery_rating IS NOT NULL
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE driver_id = NEW.driver_id
            AND delivery_rating IS NOT NULL
    )
WHERE id = NEW.driver_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER trigger_update_restaurant_rating
AFTER
INSERT
    OR
UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();
CREATE TRIGGER trigger_update_driver_rating
AFTER
INSERT
    OR
UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_driver_rating();
-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR
SELECT USING (auth.uid()::text = id::text);
-- Public can view active restaurants
CREATE POLICY "Public can view approved restaurants" ON restaurants FOR
SELECT USING (status = 'approved');
-- Public can view available foods
CREATE POLICY "Public can view available foods" ON foods FOR
SELECT USING (is_available = true);
-- Users can view own orders
CREATE POLICY "Users can view own orders" ON orders FOR
SELECT USING (auth.uid()::text = user_id::text);
-- Users can view own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR
SELECT USING (auth.uid()::text = user_id::text);
-- Users can manage own cart
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
    cart_id IN (
        SELECT id
        FROM carts
        WHERE user_id::text = auth.uid()::text
    )
);
-- =============================================
-- ADDITIONAL TABLES (Added for full functionality)
-- =============================================
-- Bank accounts for drivers and restaurants
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT bank_accounts_driver_or_restaurant CHECK (
        (
            driver_id IS NOT NULL
            AND restaurant_id IS NULL
        )
        OR (
            driver_id IS NULL
            AND restaurant_id IS NOT NULL
        )
    )
);
CREATE INDEX idx_bank_accounts_driver ON bank_accounts(driver_id);
CREATE INDEX idx_bank_accounts_restaurant ON bank_accounts(restaurant_id);
-- Notification settings per user
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    push_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT true,
    order_updates BOOLEAN DEFAULT true,
    promotions BOOLEAN DEFAULT true,
    news BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_notification_settings_user ON notification_settings(user_id);
-- System settings for admin
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Add missing columns to existing tables
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
ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8);
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP WITH TIME ZONE;
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS minimum_order DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 3000;
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_time INTEGER DEFAULT 30;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number VARCHAR(20);
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2);
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
-- =============================================
-- AUTO ORDER NUMBER TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION set_order_number() RETURNS TRIGGER AS $$
DECLARE today_count INTEGER;
BEGIN
SELECT COUNT(*) + 1 INTO today_count
FROM orders
WHERE DATE(created_at) = CURRENT_DATE;
NEW.order_number := '#' || LPAD(today_count::TEXT, 4, '0');
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number BEFORE
INSERT ON orders FOR EACH ROW
    WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION set_order_number();
-- =============================================
-- POLICIES FOR NEW TABLES
-- =============================================
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;