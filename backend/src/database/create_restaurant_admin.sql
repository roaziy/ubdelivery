-- =============================================
-- CREATE/UPDATE RESTAURANT ADMIN USER
-- Run this in Supabase SQL Editor
-- Phone: 70117069
-- Password: Restaurant@123
-- =============================================
-- Password hash for 'Restaurant@123' (generated with bcrypt, rounds=10)
-- Generated hash: $2a$10$HPy3faoke6bHJxMm/6uf1eb52xgbf49E08Yi0IunVG06bF8P.Wj7S
INSERT INTO users (
        phone,
        password_hash,
        name,
        role,
        is_active
    )
VALUES (
        '70117069',
        '$2a$10$HPy3faoke6bHJxMm/6uf1eb52xgbf49E08Yi0IunVG06bF8P.Wj7S',
        'Test Restaurant Admin',
        'restaurant_admin',
        true
    ) ON CONFLICT (phone) DO
UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = 'restaurant_admin',
    is_active = true,
    name = COALESCE(EXCLUDED.name, users.name);
-- Verify the user was created/updated
SELECT id,
    phone,
    name,
    role,
    is_active,
    CASE
        WHEN password_hash IS NOT NULL THEN 'Password set'
        ELSE 'No password'
    END as password_status
FROM users
WHERE phone = '70117069';