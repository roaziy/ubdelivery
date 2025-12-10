-- =============================================
-- COMMERCIAL BANNERS TABLE
-- Run this in Supabase SQL Editor
-- =============================================
CREATE TABLE IF NOT EXISTS commercial_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_banners_active ON commercial_banners(is_active);
CREATE INDEX idx_banners_sort ON commercial_banners(sort_order);
-- Insert some default banners
INSERT INTO commercial_banners (title, image_url, link, is_active, sort_order)
VALUES (
        'Хямдралтай хоол',
        '/LandingPage/iphone.png',
        '/home/foods',
        true,
        1
    ),
    (
        'Шинэ ресторанууд',
        '/LandingPage/iphone.png',
        '/home/restaurants',
        true,
        2
    ),
    (
        'Онцлох санал',
        '/LandingPage/iphone.png',
        '/home',
        true,
        3
    ) ON CONFLICT DO NOTHING;