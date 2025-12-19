# 🍔 UB Delivery - Complete Food Delivery Platform

A full-stack food delivery platform built with Next.js and Express.js, featuring 4 specialized frontend applications and a unified REST API backend. The platform supports customers, restaurants, drivers, and administrators with role-based access control, real-time order tracking, and comprehensive management dashboards.

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend Applications                     │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│  www-user    │ restaurant-  │  super-admin │   go-delivery   │
│  (Customer)  │    admin     │  (Platform)  │    (Driver)     │
│   Port 3000  │   Port 3001  │   Port 3002  │   Port 3003     │
└──────────────┴──────────────┴──────────────┴─────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js REST API Backend                    │
│                    Port 5000                                │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│   Supabase    │              │   Firebase    │
│  PostgreSQL   │              │  Auth (OTP)   │
│   Database    │              │   & Storage   │
└───────────────┘              └───────────────┘
```

## 🚀 Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Admin SDK (OTP), JWT
- **File Storage**: Supabase Storage
- **Image Processing**: Sharp (WebP conversion, compression)
- **Security**: bcryptjs, express-rate-limit, CORS

### Frontend

- **Framework**: Next.js 16.x (App Router)
- **UI Library**: React 19.x
- **Styling**: Tailwind CSS 4.x
- **Maps**: Leaflet & React Leaflet
- **Animations**: GSAP
- **Icons**: React Icons
- **TypeScript**: Full type safety

### Services

- **Firebase**: Phone authentication (OTP), user management
- **Supabase**: PostgreSQL database, file storage, real-time capabilities

## 📁 Project Structure

```
ubdelivery/
├── backend/                      # Express.js API Server
│   ├── src/
│   │   ├── app.js               # Main application entry
│   │   ├── config/              # Configuration files
│   │   │   ├── firebase.js      # Firebase Admin setup
│   │   │   └── supabase.js      # Supabase client
│   │   ├── database/            # Database files
│   │   │   ├── schema.sql       # Complete database schema
│   │   │   ├── seed.js          # Database seeding script
│   │   │   └── fix_applications_table.sql
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   └── upload.js        # File upload handling
│   │   └── routes/              # API route handlers
│   │       ├── admin.js         # Super admin routes
│   │       ├── applications.js # Restaurant/driver applications
│   │       ├── auth.js          # Authentication routes
│   │       ├── cart.js          # Shopping cart operations
│   │       ├── dashboard.js    # Analytics & stats
│   │       ├── drivers.js      # Driver management
│   │       ├── menu.js          # Menu & food items
│   │       ├── notifications.js # User notifications
│   │       ├── orders.js        # Order management
│   │       ├── restaurants.js   # Restaurant operations
│   │       └── reviews.js       # Reviews & ratings
│   ├── package.json
│   └── .env                     # Environment variables
│
└── frontend/
    ├── www-user/                # Customer Web Application
    │   ├── src/
    │   │   ├── app/             # Next.js app router pages
    │   │   │   ├── page.tsx     # Landing page
    │   │   │   ├── login/       # Firebase OTP authentication
    │   │   │   ├── home/        # Main customer interface
    │   │   │   │   ├── page.tsx # Home feed
    │   │   │   │   ├── restaurants/ # Restaurant listings
    │   │   │   │   ├── foods/   # Food browsing
    │   │   │   │   ├── cart/    # Shopping cart
    │   │   │   │   ├── orders/  # Order history & tracking
    │   │   │   │   └── settings/ # User settings
    │   │   │   └── collaborate/ # Partner application
    │   │   ├── components/      # React components
    │   │   │   ├── home/        # Home page components
    │   │   │   ├── LandingPage/ # Landing page components
    │   │   │   └── ui/          # Reusable UI components
    │   │   └── lib/             # Utilities & services
    │   │       ├── api.ts       # API client
    │   │       ├── firebase.ts   # Firebase client config
    │   │       ├── types.ts     # TypeScript types
    │   │       └── mockData.ts   # Mock data for development
    │   └── package.json
    │
    ├── restaurant-admin/         # Restaurant Dashboard
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── dashboard/    # Analytics dashboard
    │   │   │   ├── menu/        # Menu management
    │   │   │   ├── orders/      # Order management
    │   │   │   ├── reviews/     # Customer reviews
    │   │   │   ├── settings/    # Restaurant settings
    │   │   │   └── setup/       # Initial setup wizard
    │   │   ├── components/      # Dashboard components
    │   │   └── lib/             # Services & hooks
    │   └── package.json
    │
    ├── super-admin/              # Platform Admin Dashboard
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── dashboard/    # Platform analytics
    │   │   │   ├── restaurants/ # Restaurant management
    │   │   │   ├── drivers/     # Driver management
    │   │   │   ├── applications/ # Application approvals
    │   │   │   ├── orders/      # All orders overview
    │   │   │   ├── finance/     # Financial management
    │   │   │   ├── users/       # User management
    │   │   │   └── settings/    # Platform settings
    │   │   ├── components/       # Admin components
    │   │   └── lib/             # Admin services
    │   └── package.json
    │
    └── go-delivery/               # Driver Mobile App
        ├── src/
        │   ├── app/
        │   │   ├── dashboard/    # Driver dashboard
        │   │   ├── deliveries/   # Active deliveries
        │   │   ├── history/     # Delivery history
        │   │   ├── earnings/    # Earnings tracking
        │   │   ├── profile/     # Driver profile
        │   │   └── bank-account/ # Payment setup
        │   ├── components/       # Driver components
        │   └── lib/             # Driver services
        └── package.json
```

## ✨ Key Features

### 👥 Customer App (www-user)

- **Firebase OTP Authentication** - Phone number-based login
- **Restaurant Discovery** - Browse restaurants with filters (cuisine, rating, delivery time)
- **Interactive Maps** - Leaflet maps for location selection and restaurant locations
- **Menu Browsing** - Browse foods by category, restaurant, or search
- **Shopping Cart** - Multi-restaurant cart with quantity management
- **Order Placement** - Address input, payment method selection, order confirmation
- **Real-time Order Tracking** - Track order status from placement to delivery
- **Order History** - View past orders with details
- **Reviews & Ratings** - Rate restaurants and food items
- **User Profile** - Manage profile, addresses, payment methods
- **Partner Application** - Submit restaurant or driver applications

### 🏪 Restaurant Admin Dashboard

- **Analytics Dashboard** - Sales, orders, revenue statistics
- **Order Management** - Accept/reject orders, update status, assign drivers
- **Menu Management** - Create/edit/delete food items and categories
- **Inventory Control** - Mark items as available/unavailable
- **Review Management** - View and respond to customer reviews
- **Restaurant Settings** - Update profile, hours, bank account
- **Setup Wizard** - Initial restaurant configuration

### 🚗 Driver App (go-delivery)

- **Delivery Dashboard** - View available and active deliveries
- **Order Acceptance** - Accept/reject delivery requests
- **Navigation Support** - Get directions to pickup and delivery locations
- **Earnings Tracking** - Daily, weekly, monthly earnings
- **Delivery History** - Past deliveries with details
- **Profile Management** - Update profile, vehicle info, bank account
- **Availability Toggle** - Go online/offline

### 👨‍💼 Super Admin Dashboard

- **Platform Analytics** - Overall platform statistics and trends
- **Restaurant Management** - Approve/reject restaurant applications, manage restaurants
- **Driver Management** - Approve/reject driver applications, manage drivers
- **Application Review** - Review and process restaurant/driver applications
- **Order Oversight** - View all orders across the platform
- **Financial Management** - View revenue, payouts, refunds
- **User Management** - Manage all user accounts
- **Platform Settings** - Configure platform-wide settings

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** (free tier works)
- **Firebase Project** with Phone Authentication enabled
- **Git** (for cloning the repository)

### 1️⃣ Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:
   ```sql
   -- Copy and paste the entire content of:
   backend/src/database/schema.sql
   ```
3. Go to **Storage** and create a bucket:
   - Name: `uploads`
   - Public: ✅ Enabled
   - File size limit: 5MB
4. Get your API keys from **Project Settings > API**:
   - Project URL
   - `anon` key (public)
   - `service_role` key (secret)

### 2️⃣ Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Phone Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Phone provider
   - Add test phone numbers for development (optional)
3. Add authorized domains:
   - `localhost` (for development)
   - Your production domain
4. Get Firebase config:
   - Project Settings > General > Your apps
   - Copy Firebase SDK configuration
5. Generate Admin SDK credentials:
   - Project Settings > Service Accounts
   - Generate new private key
   - Download JSON file

### 3️⃣ Environment Configuration

#### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# CORS Origins (optional, defaults to localhost)
WWW_USER_URL=http://localhost:3000
RESTAURANT_ADMIN_URL=http://localhost:3001
SUPER_ADMIN_URL=http://localhost:3002
GO_DELIVERY_URL=http://localhost:3003
```

#### Customer App (`frontend/www-user/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### Other Frontends (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4️⃣ Installation & Running

#### Backend

```bash
cd backend
npm install
npm run dev    # Runs on http://localhost:5000
```

#### Frontend Applications

Open separate terminal windows for each:

```bash
# Customer App (Port 3000)
cd frontend/www-user
npm install
npm run dev

# Restaurant Admin (Port 3001)
cd frontend/restaurant-admin
npm install
npm run dev -- -p 3001

# Super Admin (Port 3002)
cd frontend/super-admin
npm install
npm run dev -- -p 3002

# Driver App (Port 3003)
cd frontend/go-delivery
npm install
npm run dev -- -p 3003
```

### 5️⃣ Create Super Admin Account

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'admin@ubdelivery.mn',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.H1RXZF.RLRQMHC', -- password: admin123
  'Super Admin',
  'super_admin',
  true
);
```

**⚠️ Important**: Change the password after first login!

## 📱 Application Access

| Application      | URL                   | Default Credentials            |
| ---------------- | --------------------- | ------------------------------ |
| Customer App     | http://localhost:3000 | Phone OTP (Firebase)           |
| Restaurant Admin | http://localhost:3001 | Email/Phone + Password         |
| Super Admin      | http://localhost:3002 | admin@ubdelivery.mn / admin123 |
| Driver App       | http://localhost:3003 | Email/Phone + Password         |

## 🔐 Authentication & Authorization

### Customer Authentication (Firebase OTP)

1. User enters phone number
2. Firebase sends OTP via SMS
3. User verifies OTP → Receives Firebase ID token
4. Frontend sends ID token to `/api/auth/verify-otp`
5. Backend verifies token, creates/updates user, returns JWT
6. JWT used for subsequent authenticated requests

### Restaurant Admin / Driver / Super Admin

1. User enters email/phone + password
2. Backend verifies credentials against database
3. Returns JWT token with role information
4. JWT used for role-based API access

### Role-Based Access Control

- **user**: Regular customers
- **restaurant_admin**: Restaurant owners/managers
- **driver**: Delivery drivers
- **super_admin**: Platform administrators

## 📊 Database Schema

### Core Tables

- **users** - All user accounts (customers, admins, drivers)
- **restaurants** - Restaurant profiles and settings
- **drivers** - Driver profiles and vehicle information
- **foods** - Menu items
- **food_categories** - Menu categories per restaurant
- **orders** - Customer orders
- **order_items** - Items in each order
- **carts** - Shopping carts
- **cart_items** - Items in shopping carts
- **reviews** - Customer reviews and ratings
- **applications** - Restaurant and driver registration applications
- **notifications** - User notifications
- **transactions** - Financial transactions (orders, payouts, refunds)

### Key Relationships

- Users → Restaurants (one-to-many via `owner_id`)
- Users → Drivers (one-to-one via `user_id`)
- Restaurants → Foods (one-to-many)
- Orders → Order Items (one-to-many)
- Orders → Users (many-to-one)
- Orders → Restaurants (many-to-one)
- Orders → Drivers (many-to-one, optional)

## 🔑 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint                 | Description                           | Auth Required |
| ------ | ------------------------ | ------------------------------------- | ------------- |
| POST   | `/auth/verify-otp`       | Verify Firebase OTP token (customers) | No            |
| POST   | `/auth/restaurant/login` | Restaurant admin login                | No            |
| POST   | `/auth/driver/login`     | Driver login                          | No            |
| POST   | `/auth/admin/login`      | Super admin login                     | No            |
| GET    | `/auth/me`               | Get current user                      | Yes           |
| GET    | `/auth/profile`          | Get user profile                      | Yes           |
| PUT    | `/auth/profile`          | Update profile                        | Yes           |

### Restaurant Endpoints

| Method | Endpoint                | Description               | Auth Required    |
| ------ | ----------------------- | ------------------------- | ---------------- |
| GET    | `/restaurants`          | List restaurants (public) | No               |
| GET    | `/restaurants/:id`      | Get restaurant details    | No               |
| GET    | `/restaurants/:id/menu` | Get restaurant menu       | No               |
| PUT    | `/restaurants/:id`      | Update restaurant         | Restaurant Admin |

### Menu Endpoints

| Method | Endpoint           | Description      | Auth Required    |
| ------ | ------------------ | ---------------- | ---------------- |
| GET    | `/menu/foods`      | List foods       | No               |
| GET    | `/menu/foods/:id`  | Get food details | No               |
| GET    | `/menu/categories` | List categories  | Restaurant Admin |
| POST   | `/menu/foods`      | Create food item | Restaurant Admin |
| PUT    | `/menu/foods/:id`  | Update food item | Restaurant Admin |
| DELETE | `/menu/foods/:id`  | Delete food item | Restaurant Admin |

### Cart Endpoints

| Method | Endpoint          | Description            | Auth Required |
| ------ | ----------------- | ---------------------- | ------------- |
| GET    | `/cart`           | Get user cart          | Yes (User)    |
| POST   | `/cart/items`     | Add item to cart       | Yes (User)    |
| PATCH  | `/cart/items/:id` | Update item quantity   | Yes (User)    |
| DELETE | `/cart/items/:id` | Remove item from cart  | Yes (User)    |
| POST   | `/cart/checkout`  | Create order from cart | Yes (User)    |

### Order Endpoints

| Method | Endpoint                    | Description              | Auth Required    |
| ------ | --------------------------- | ------------------------ | ---------------- |
| GET    | `/orders`                   | List orders (role-based) | Yes              |
| GET    | `/orders/:id`               | Get order details        | Yes              |
| POST   | `/orders/:id/accept`        | Accept order             | Restaurant Admin |
| POST   | `/orders/:id/reject`        | Reject order             | Restaurant Admin |
| POST   | `/orders/:id/ready`         | Mark order ready         | Restaurant Admin |
| POST   | `/orders/:id/assign-driver` | Assign driver            | Restaurant Admin |
| POST   | `/orders/:id/cancel`        | Cancel order             | User/Restaurant  |
| POST   | `/orders/:id/pickup`        | Mark picked up           | Driver           |
| POST   | `/orders/:id/deliver`       | Mark delivered           | Driver           |

### Application Endpoints

| Method | Endpoint                    | Description                   | Auth Required |
| ------ | --------------------------- | ----------------------------- | ------------- |
| POST   | `/applications/restaurant`  | Submit restaurant application | No            |
| POST   | `/applications/driver`      | Submit driver application     | No            |
| GET    | `/applications`             | List applications             | Super Admin   |
| POST   | `/applications/:id/approve` | Approve application           | Super Admin   |
| POST   | `/applications/:id/reject`  | Reject application            | Super Admin   |

### Review Endpoints

| Method | Endpoint                  | Description            | Auth Required |
| ------ | ------------------------- | ---------------------- | ------------- |
| POST   | `/reviews`                | Submit review          | Yes (User)    |
| GET    | `/reviews`                | List reviews           | No            |
| GET    | `/reviews/restaurant/:id` | Get restaurant reviews | No            |

### Dashboard Endpoints

| Method | Endpoint                | Description          | Auth Required    |
| ------ | ----------------------- | -------------------- | ---------------- |
| GET    | `/dashboard/restaurant` | Restaurant analytics | Restaurant Admin |
| GET    | `/dashboard/admin`      | Platform analytics   | Super Admin      |
| GET    | `/dashboard/driver`     | Driver statistics    | Driver           |

### Admin Endpoints

| Method | Endpoint             | Description          | Auth Required |
| ------ | -------------------- | -------------------- | ------------- |
| GET    | `/admin/restaurants` | List all restaurants | Super Admin   |
| GET    | `/admin/drivers`     | List all drivers     | Super Admin   |
| GET    | `/admin/users`       | List all users       | Super Admin   |
| PUT    | `/admin/users/:id`   | Update user          | Super Admin   |

## 🖼️ Image Upload & Processing

All images are automatically processed before storage:

| Image Type        | Max Size | Dimensions | Quality | Format |
| ----------------- | -------- | ---------- | ------- | ------ |
| Restaurant Logo   | 2MB      | 256×256px  | 80%     | WebP   |
| Restaurant Banner | 5MB      | 800×300px  | 75%     | WebP   |
| Food Image        | 3MB      | 400×400px  | 75%     | WebP   |
| User Avatar       | 1MB      | 128×128px  | 80%     | WebP   |
| Driver License    | 5MB      | Original   | 85%     | WebP   |

Images are stored in Supabase Storage bucket `uploads` and served via CDN.

## 🛠️ Development

### Building for Production

```bash
# Backend
cd backend
npm run build  # (if applicable)
npm start

# Frontends
cd frontend/[app-name]
npm run build
npm start
```

### TypeScript

All frontends use TypeScript with strict mode enabled. Run type checking:

```bash
cd frontend/[app-name]
npx tsc --noEmit
```

### Code Structure

- **Backend**: ES6 modules, async/await pattern
- **Frontend**: Next.js App Router, React Server Components where applicable
- **Styling**: Tailwind CSS utility classes
- **State Management**: React hooks (useState, useEffect, custom hooks)

## 🧪 Testing

### Firebase Test Phone Numbers

For development, add test phone numbers in Firebase Console:

1. Go to Authentication > Sign-in method > Phone
2. Add test numbers:
   - Phone: `+97699999999`
   - Code: `123456`

These will bypass SMS sending during development.

### Database Seeding

```bash
cd backend
npm run db:seed
```

## 🚢 Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- **Backend**: Set all variables from `backend/.env`
- **Frontends**: Set `NEXT_PUBLIC_API_URL` to your production API URL
- **www-user**: Set all Firebase environment variables

### Recommended Hosting

- **Backend**: Railway, Render, or DigitalOcean App Platform
- **Frontends**: Vercel (recommended for Next.js) or Netlify
- **Database**: Supabase (already hosted)
- **Storage**: Supabase Storage (already included)

### Build Commands

All frontends use standard Next.js build commands:

```bash
npm run build  # Production build
npm start      # Start production server
```

## 📝 API Response Format

All API responses follow this format:

```typescript
// Success Response
{
  success: true,
  data: { ... }
}

// Error Response
{
  success: false,
  error: "Error message",
  message?: "Additional details"
}

// Paginated Response
{
  success: true,
  data: {
    items: [...],
    total: 100,
    page: 1,
    limit: 20,
    totalPages: 5
  }
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Middleware enforces permissions
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Configured allowed origins
- **Input Validation** - Validator library for sanitization
- **Image Compression** - Prevents storage abuse
- **SQL Injection Protection** - Supabase parameterized queries

## 🐛 Troubleshooting

### Common Issues

1. **Firebase OTP not sending**

   - Check Firebase project settings
   - Verify phone number format (include country code)
   - Check Firebase quotas

2. **Database connection errors**

   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database schema is applied

3. **Image upload failures**

   - Verify Supabase Storage bucket exists
   - Check bucket permissions (public)
   - Verify file size limits

4. **CORS errors**

   - Add frontend URL to backend CORS configuration
   - Check environment variables

5. **Build errors**
   - Run `npm install` in each directory
   - Clear `.next` folders: `rm -rf .next`
   - Check TypeScript errors: `npx tsc --noEmit`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ by roaziy**
