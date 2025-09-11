 # 🛒 BuyNest - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce platform built with the MERN stack, offering a complete shopping experience similar to Amazon/Flipkart with advanced admin capabilities.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features & Operations](#-features--operations)
- [Workflow & Architecture](#-workflow--architecture)
- [Operators & Logic Used](#-operators--logic-used)
- [Installation & Setup](#-installation--setup)
- [End-to-End Example Workflow](#-end-to-end-example-workflow)
- [API Documentation](#-api-documentation)
- [Contributors](#-contributors)

## 🚀 Project Overview

BuyNest is a comprehensive e-commerce platform that provides a complete online shopping experience with both user and admin interfaces. Built using modern web technologies, it offers secure authentication, product management, shopping cart functionality, payment processing, and order management.

### 🛠️ Technologies Used

**Frontend:**
- **React 19.1.0** - Modern UI library
- **Material-UI (MUI) 7.3.1** - Component library and theming
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Stripe React** - Payment processing
- **Vite** - Build tool and dev server

**Backend:**
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose 8.16.4** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and management
- **bcrypt** - Password hashing
- **Joi** - Data validation

**DevOps & Tools:**
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## ✨ Features & Operations

### 🔐 User Authentication
- **JWT-based Authentication** with access and refresh tokens
- **Google OAuth 2.0** integration for social login
- **Email verification** system with OTP
- **Password reset** functionality
- **Secure cookie-based** token storage
- **Role-based access control** (User/Admin)

### 🛍️ Product Management
- **Product browsing** with advanced filtering and search
- **Category-based navigation** with hierarchical structure
- **Product details** with image galleries
- **Stock management** and availability tracking
- **Product reviews** and ratings system
- **Admin CRUD operations** for products and categories

### 🛒 Shopping Cart & Wishlist
- **Add/Remove items** from cart and wishlist
- **Quantity management** with real-time updates
- **Persistent cart** across sessions
- **Coupon system** with discount calculations
- **Cart total calculations** with tax and fees
- **Wishlist management** for saved items

### 💳 Payment & Checkout
- **Stripe integration** for secure payments
- **Multiple payment methods** (Credit/Debit cards)
- **Payment intent** creation and confirmation
- **Webhook handling** for payment status updates
- **Order confirmation** emails
- **Secure checkout** process

### 📦 Order Management
- **Order creation** and tracking
- **Order history** for users
- **Order status** updates (Pending, Confirmed, Shipped, Delivered)
- **Shipping address** management
- **Order confirmation** and tracking
- **Admin order management** dashboard

### 👨‍💼 Admin Operations
- **Product CRUD** operations
- **Category management** with hierarchical structure
- **User management** and analytics
- **Order management** and tracking
- **Dashboard** with sales analytics
- **Image upload** and management
- **Inventory management**

## 🏗️ Workflow & Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST APIs     │    │ • User Data     │
│ • State Mgmt    │    │ • Authentication│    │ • Products      │
│ • Routing       │    │ • Business Logic│    │ • Orders        │
│ • Components    │    │ • Data Access   │    │ • Cart/Wishlist │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   File Storage  │    │   Payment       │
│   Services      │    │   (Cloudinary)  │    │   (Stripe)      │
│                 │    │                 │    │                 │
│ • Google OAuth  │    │ • Image Upload  │    │ • Payment Proc. │
│ • Email Service │    │ • File Mgmt     │    │ • Webhooks      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend-Backend Communication

The frontend communicates with the backend through RESTful APIs using Axios:

```javascript
// Example API call
const response = await apiService.createOrder(orderData);
```

**API Endpoints Structure:**
- `/api/v1/auth/*` - Authentication routes
- `/api/v1/products/*` - Product management
- `/api/v1/cart/*` - Shopping cart operations
- `/api/v1/orders/*` - Order management
- `/api/v1/payments/*` - Payment processing
- `/api/v1/admin/*` - Admin operations

### Database Schema Overview

**User Collection:**
```javascript
{
  id: String,
  userName: String,
  email: String,
  password: String (hashed),
  salt: String,
  isEmailVerified: Boolean,
  isGoogleProvided: Boolean,
  googleId: String,
  profile: String,
  refresh_token: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Product Collection:**
```javascript
{
  id: String,
  name: String,
  images: [{ url: String, id: String }],
  description: String,
  price: String,
  category: String,
  brandName: String,
  modelName: String,
  stock: Number,
  isListed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Cart Collection:**
```javascript
{
  id: String,
  userId: String,
  items: [{
    productId: String,
    quantity: Number,
    price: Number,
    totalPrice: Number,
    product: Object
  }],
  totalAmount: Number,
  itemCount: Number,
  appliedCoupon: Object,
  discountAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Order Collection:**
```javascript
{
  orderId: String,
  userId: String,
  items: [OrderItem],
  orderSummary: {
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    total: Number
  },
  shippingAddress: Object,
  paymentInfo: {
    method: String,
    paymentStatus: String,
    transactionId: String
  },
  orderStatus: String,
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## ⚙️ Operators & Logic Used

### CRUD Operations
- **Create**: `POST` requests for new entities (users, products, orders)
- **Read**: `GET` requests for fetching data with filtering and pagination
- **Update**: `PUT`/`PATCH` requests for modifying existing entities
- **Delete**: `DELETE` requests for removing entities

### Database Operators
- **`$push`**: Adding items to arrays (cart items, order items)
- **`$pull`**: Removing items from arrays
- **`$set`**: Updating specific fields
- **`$inc`**: Incrementing/decrementing numeric values (stock, quantities)
- **`$lookup`**: Joining collections for complex queries
- **`$aggregate`**: Advanced data processing and analytics

### Authentication Operators
- **bcrypt**: Password hashing with salt generation
- **JWT**: Token generation and validation
- **Passport.js**: OAuth strategy implementation
- **Cookie Parser**: Secure token storage

### React Hooks & State Management
- **`useState`**: Local component state management
- **`useEffect`**: Side effects and lifecycle management
- **`useContext`**: Global state sharing
- **Redux Toolkit**: Centralized state management
- **Custom Hooks**: Reusable logic (useAuth, useCart, useProductRefresh)

### API Operators
- **GET**: Fetching data (products, user info, orders)
- **POST**: Creating resources (authentication, orders, payments)
- **PUT**: Updating resources (cart, user profile)
- **DELETE**: Removing resources (cart items, products)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (18+)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/buynest-ecommerce.git
cd buynest-ecommerce
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your configuration
```

**Environment Variables (.env):**
```env
# Database
DB_URL=mongodb://127.0.0.1:27017/buynest

# Server
PORT=5000
APP_SCERET=your_jwt_secret_key

# Cloudinary (Image Storage)
cloud_name=your_cloudinary_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret

# Google OAuth
google_client_id=your_google_client_id
google_client_secret=your_google_client_secret
google_callback_url=http://localhost:5000/api/v1/auth/google/callback

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_CREDENTIALS=true

# Security
HELMET_ENABLED=true
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure frontend environment variables
```

**Frontend Environment Variables (.env.local):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLIENT_URL=http://localhost:5173
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update DB_URL in .env file
```

### 5. Run Development Servers

**Backend Server:**
```bash
# From root directory
npm run dev
# Server runs on http://localhost:5000
```

**Frontend Server:**
```bash
# From client directory
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 6. Access the Application
- **User Interface**: http://localhost:5173
- **Admin Interface**: http://localhost:5173/admin
- **API Documentation**: http://localhost:5000/api/v1

## 🔄 End-to-End Example Workflow

### Complete Shopping Journey

1. **User Registration/Login**
   ```
   User visits → Signup/Login page → JWT tokens generated → User authenticated
   ```

2. **Product Browsing**
   ```
   Home page → Category selection → Product listing → Product details → Add to cart
   ```

3. **Cart Management**
   ```
   Add items → Update quantities → Apply coupon → Proceed to checkout
   ```

4. **Checkout Process**
   ```
   Review cart → Enter shipping address → Select payment method → Create order
   ```

5. **Payment Processing**
   ```
   Stripe payment intent → Payment confirmation → Order status update → Confirmation email
   ```

6. **Order Management**
   ```
   Order created → Admin processes → Status updates → User tracking → Delivery
   ```

### Example API Flow

```javascript
// 1. User Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
// Response: { access_token, refresh_token, user }

// 2. Add to Cart
POST /api/v1/cart/add
{
  "productId": "product123",
  "quantity": 2
}
// Response: { success: true, cart }

// 3. Create Order
POST /api/v1/orders
{
  "items": [...],
  "shippingAddress": {...},
  "paymentInfo": {...}
}
// Response: { success: true, orderId }

// 4. Process Payment
POST /api/v1/payments/create-intent
{
  "amount": 99.99,
  "currency": "usd",
  "orderId": "order123"
}
// Response: { clientSecret, paymentIntentId }
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/google` - Google OAuth login
- `POST /api/v1/auth/admin/login` - Admin login

### Product Endpoints
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)
- `GET /api/v1/products/search` - Search products

### Cart Endpoints
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove` - Remove cart item
- `POST /api/v1/cart/apply-coupon` - Apply coupon

### Order Endpoints
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id/status` - Update order status (Admin)

### Payment Endpoints
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/webhook` - Stripe webhook handler
- `POST /api/v1/payments/confirm` - Confirm payment

## 👥 Contributors

**Project Owner:** Dinesh S
- **Email:** dinesh@example.com
- **LinkedIn:** [Dinesh S](https://linkedin.com/in/dinesh-s)
- **GitHub:** [@dinesh-s](https://github.com/dinesh-s)

### Development Team
- **Full-Stack Developer:** Dinesh S
- **UI/UX Design:** Material-UI Components
- **Backend Architecture:** Clean Architecture with TypeScript
- **Database Design:** MongoDB with Mongoose ODM

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email dinesh@example.com or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
