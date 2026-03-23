# Pinnacle Supermarket E-Commerce Platform

A modern, full-stack e-commerce website for Pinnacle Supermarket in Dugbe, Ibadan, Nigeria.

## 🚀 Features

### Customer Features
- Browse products by category
- Search and filter products
- Shopping cart with persistent storage
- User registration and authentication
- Online payment via Paystack
- Order tracking
- Delivery and pickup options

### Admin Features
- Dashboard with sales statistics
- Product management (CRUD)
- Image upload via Cloudinary
- Order management
- Stock tracking
- Multi-admin support with role-based access

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- React Router v6
- Zustand (State Management)
- Axios
- React Paystack
- Vanilla CSS

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Paystack Payment Integration
- Cloudinary (Image Upload)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB installed and running
- Paystack account (test or live keys)
- Cloudinary account

### 1. Clone the repository
```bash
cd pinnacle-supermarket
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pinnacle-supermarket
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy `.env.example` to `.env.local` and update:
```env
VITE_API_URL=http://localhost:5000
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### Start Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## 🔐 Creating the First Super Admin

To create your first super admin account, you'll need to manually insert it into MongoDB:

```javascript
// Run this in MongoDB shell or MongoDB Compass
use pinnacle-supermarket

db.admins.insertOne({
  name: "Super Admin",
  email: "admin@pinnacle.com",
  password: "$2a$10$...", // You need to hash this with bcrypt
  role: "super_admin",
  createdAt: new Date()
})
```

Or use the Node.js script (create `backend/scripts/createAdmin.ts`):
```typescript
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const admin = await Admin.create({
    name: 'Super Admin',
    email: 'admin@pinnacle.com',
    password: 'secure_password_123',
    role: 'super_admin'
  });

  console.log('Super Admin created:', admin.email);
  process.exit(0);
};

createSuperAdmin();
```

## 🧪 Testing Paystack Integration

Use these test cards from Paystack:

**Successful Transaction:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Transaction:**
- Card Number: `4084080000000409`

## 📁 Project Structure

```
pinnacle-supermarket/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── config/         # DB & Cloudinary config
│   │   ├── utils/          # Paystack utilities
│   │   └── index.ts        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand stores
    │   ├── types/          # TypeScript types
    │   ├── lib/            # API client
    │   ├── styles/         # CSS files
    │   └── App.tsx         # Main app
    └── package.json
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/verify/:reference` - Verify payment

### Admin
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/dashboard/stats` - Dashboard stats

## 🎨 Design Features

- Modern, clean supermarket aesthetic
- Red, white, and neutral color scheme
- Fully responsive (mobile-first)
- Smooth animations and transitions
- Loading states and error handling

## 📞 Business Information

**Pinnacle Supermarket**
- Address: 28 Adekunle Fajuyi Road, Dugbe, Ibadan
- Phone: 0809 412 3400
- Hours: Mon-Sat, 8:00 AM - 8:00 PM

## 🚢 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB is accessible

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 📝 License

Private - All rights reserved to Pinnacle Supermarket

## 👨‍💻 Support

For support, email support@pinnaclesupermarket.com or call 0809 412 3400.
