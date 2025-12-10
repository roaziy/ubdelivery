# Restaurant Admin Login Troubleshooting

## Issue: Restaurant Admin Login Not Working

If you're getting "Нууц үг буруу байна" (Password is wrong) or "Хэрэглэгч олдсонгүй" (User not found), follow these steps:

## Solution 1: Create/Update Restaurant Admin User

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL script:

```sql
-- Create/Update restaurant admin user
-- Phone: 70117069
-- Password: Restaurant@123

INSERT INTO users (
    phone,
    password_hash,
    name,
    role,
    is_active
) VALUES (
    '70117069',
    '$2a$10$HPy3faoke6bHJxMm/6uf1eb52xgbf49E08Yi0IunVG06bF8P.Wj7S',
    'Test Restaurant Admin',
    'restaurant_admin',
    true
)
ON CONFLICT (phone) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'restaurant_admin',
    is_active = true,
    name = COALESCE(EXCLUDED.name, users.name);

-- Verify the user
SELECT id, phone, name, role, is_active,
       CASE WHEN password_hash IS NOT NULL THEN 'Password set' ELSE 'No password' END as password_status
FROM users
WHERE phone = '70117069';
```

### Option B: Using Node.js Script

1. Make sure your `.env` file has:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run:
   ```bash
   cd backend
   node src/database/create_restaurant_admin.js
   ```

## Solution 2: Check Existing User

If the user already exists, verify:

1. **Phone number format**: Should be exactly 8 digits (e.g., `70117069`)
2. **Password hash**: Should be set (not NULL)
3. **Role**: Should be `restaurant_admin`
4. **Is active**: Should be `true`

Run this query in Supabase SQL Editor:

```sql
SELECT
    id,
    phone,
    name,
    role,
    is_active,
    CASE
        WHEN password_hash IS NULL THEN 'No password'
        WHEN password_hash = '' THEN 'Empty password'
        ELSE 'Password set'
    END as password_status,
    created_at
FROM users
WHERE phone = '70117069' OR phone LIKE '%70117069%';
```

## Solution 3: Reset Password for Existing User

If you need to reset the password for an existing user:

```sql
-- Generate password hash for 'Restaurant@123' using Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('Restaurant@123', 10).then(hash => console.log(hash));

UPDATE users
SET
    password_hash = '$2a$10$HPy3faoke6bHJxMm/6uf1eb52xgbf49E08Yi0IunVG06bF8P.Wj7S',
    is_active = true,
    role = 'restaurant_admin'
WHERE phone = '70117069';
```

## Solution 4: Create User with Restaurant

If you want to create a user that already owns a restaurant:

```sql
-- First, create the user
INSERT INTO users (
    phone,
    password_hash,
    name,
    role,
    is_active
) VALUES (
    '70117069',
    '$2a$10$HPy3faoke6bHJxMm/6uf1eb52xgbf49E08Yi0IunVG06bF8P.Wj7S',
    'Test Restaurant Admin',
    'restaurant_admin',
    true
)
ON CONFLICT (phone) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'restaurant_admin',
    is_active = true;

-- Then create a restaurant for this user (optional)
-- Replace USER_ID with the actual user ID from the query above
INSERT INTO restaurants (
    owner_id,
    name,
    phone,
    status,
    is_open,
    setup_completed
) VALUES (
    (SELECT id FROM users WHERE phone = '70117069'),
    'Test Restaurant',
    '70117069',
    'approved',
    true,
    false
)
ON CONFLICT DO NOTHING;
```

## Testing Login

After creating/updating the user:

1. Go to `admin.ubdelivery.xyz` (or your restaurant admin URL)
2. Enter phone: `70117069`
3. Enter password: `Restaurant@123`
4. Click "Нэвтрэх" (Login)

## Common Issues

### Issue: "Хэрэглэгч олдсонгүй" (User not found)

- **Cause**: User doesn't exist or phone number doesn't match
- **Fix**: Create the user using Solution 1
- **Check**: Verify phone number format (should be 8 digits, no spaces or dashes)

### Issue: "Нууц үг буруу байна" (Password is wrong)

- **Cause**: Password hash doesn't match or is incorrect
- **Fix**: Update password hash using Solution 3
- **Check**: Verify `password_hash` is not NULL in the database

### Issue: "Нууц үг тохируулаагүй байна" (Password not set)

- **Cause**: `password_hash` is NULL
- **Fix**: Set password hash using Solution 3

### Issue: "Рестораны эрхгүй байна" (No restaurant access)

- **Cause**: User doesn't have `restaurant_admin` role and doesn't own a restaurant
- **Fix**: Update user role to `restaurant_admin` or create a restaurant for the user

### Issue: "Таны бүртгэл идэвхгүй байна" (Account inactive)

- **Cause**: `is_active` is `false`
- **Fix**: Update `is_active = true` in the database

## Debugging

Check backend logs for:

- Phone number cleaning: `[Restaurant Login] Searching for phone: ... -> cleaned: ...`
- User found: `[Restaurant Login] User found: ...`
- Password verification status

## Default Test Credentials

- **Phone**: `70117069`
- **Password**: `Restaurant@123`
- **Role**: `restaurant_admin`
