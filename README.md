# 🍔 UB Delivery - Food Delivery Platform

A complete food delivery platform with 4 frontends and a Node.js backend, using Firebase for OTP authentication and Supabase for database & storage.

## 📁 Project Structure

```
ubdelivery/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/         # Firebase & Supabase config
│   │   ├── database/       # SQL schema
│   │   ├── middleware/     # Auth, upload, error handling
│   │   └── routes/         # API routes
│   └── package.json
│
└── frontend/
    ├── www-user/           # Customer web app (Firebase OTP)
    ├── restaurant-admin/   # Restaurant dashboard
    ├── super-admin/        # Platform admin dashboard
    └── go-delivery/        # Driver mobile-first app
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Firebase project with Phone Authentication enabled

### 1️⃣ Setup Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:
   ```
   backend/src/database/schema.sql
   ```
3. Go to **Storage** and create a bucket named `uploads` with public access
4. Get your API keys from **Project Settings > API**

### 2️⃣ Setup Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Phone Authentication** in Authentication > Sign-in method
3. Add your domain to **Authorized domains**
4. Get Firebase config from Project Settings > General
5. Generate Admin SDK credentials from Project Settings > Service Accounts

### 3️⃣ Configure Environment Variables

**Backend** (`backend/.env`):

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT
JWT_SECRET=your-super-secret-jwt-key-32-chars-min

# CORS
WWW_USER_URL=http://localhost:3000
RESTAURANT_ADMIN_URL=http://localhost:3001
SUPER_ADMIN_URL=http://localhost:3002
GO_DELIVERY_URL=http://localhost:3003
```

**www-user Frontend** (`frontend/www-user/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Other Frontends** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4️⃣ Install & Run

```bash
# Backend
cd backend
npm install
npm run dev         # Runs on port 5000

# In separate terminals:

# Customer App
cd frontend/www-user
npm install
npm run dev         # Runs on port 3000

# Restaurant Admin
cd frontend/restaurant-admin
npm install
npm run dev -- -p 3001

# Super Admin
cd frontend/super-admin
npm install
npm run dev -- -p 3002

# Driver App
cd frontend/go-delivery
npm install
npm run dev -- -p 3003
```

## 📱 Applications

| App              | Port | Description                                       |
| ---------------- | ---- | ------------------------------------------------- |
| www-user         | 3000 | Customer ordering app with Firebase OTP login     |
| restaurant-admin | 3001 | Restaurant dashboard for orders & menu management |
| super-admin      | 3002 | Platform admin for approving restaurants/drivers  |
| go-delivery      | 3003 | Driver app for deliveries                         |

## 🔐 Authentication Flow

### Customer (www-user)

1. Enter phone number → Firebase sends OTP
2. Verify OTP → Get Firebase ID token
3. Send ID token to backend → Backend creates/returns user + JWT
4. Use JWT for subsequent API calls

### Restaurant Admin / Driver / Super Admin

1. Enter email/phone + password
2. Backend verifies credentials
3. Returns JWT token

## 📊 Database Schema

### Main Tables

- `users` - All user accounts
- `restaurants` - Restaurant profiles
- `drivers` - Driver profiles
- `foods` - Menu items
- `food_categories` - Menu categories
- `orders` - Customer orders
- `order_items` - Items in orders
- `reviews` - Ratings & reviews
- `applications` - Restaurant/driver registration requests
- `notifications` - User notifications
- `carts` - Shopping carts
- `cart_items` - Cart items

## 🔑 API Endpoints

### Auth

- `POST /api/auth/verify-otp` - Firebase OTP verification (www-user)
- `POST /api/auth/restaurant/login` - Restaurant login
- `POST /api/auth/driver/login` - Driver login
- `POST /api/auth/admin/login` - Admin login

### Public

- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Restaurant details
- `GET /api/menu/foods` - List foods

### Protected (requires JWT)

- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `POST /api/cart/checkout` - Create order
- `GET /api/orders` - List orders
- `POST /api/applications/restaurant` - Submit restaurant application
- `POST /api/applications/driver` - Submit driver application

## 🖼️ Image Upload

Images are automatically compressed before upload:

| Type   | Size    | Quality |
| ------ | ------- | ------- |
| Logo   | 256x256 | 80%     |
| Banner | 800x300 | 75%     |
| Food   | 400x400 | 75%     |
| Avatar | 128x128 | 80%     |

All images are converted to WebP format for optimal size.

## 🔧 Development Tips

### Create Super Admin

Run in Supabase SQL Editor:

```sql
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@ubdelivery.mn',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.H1RXZF.RLRQMHC', -- password: admin123
  'Super Admin',
  'super_admin',
  true
);
```

### Test Phone Numbers (Firebase)

Use Firebase test numbers for development:

1. Go to Firebase Console > Authentication > Sign-in method > Phone
2. Add test numbers like `+97699999999` with code `123456`

## 📄 License

MIT License
