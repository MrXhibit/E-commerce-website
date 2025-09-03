# BuyNest - E-Commerce Platform

## Overview

BuyNest is a full-stack e-commerce platform built with modern web technologies. It provides a comprehensive online shopping experience with separate user and admin interfaces, featuring product management, shopping cart functionality, order processing, payment integration, and user authentication.

## Features

### 🛍️ **Product Management System**
- **Location**: `src/domain/entities/Product.ts`, `src/application/services/product/`, `client/src/user/`
- **Workflow**: 
  1. Products are created with images, descriptions, pricing, and inventory
  2. Cloudinary handles image uploads and storage
  3. Products are categorized and searchable
  4. Admin can manage product listings, stock, and visibility
- **Usage**: Browse products by category, search functionality, view detailed product pages

### 🔐 **Authentication & Authorization**
- **Location**: `src/application/services/user/`, `client/src/contexts/AuthContext.jsx`
- **Workflow**:
  1. User registration with email verification
  2. Login with JWT tokens (access + refresh)
  3. Google OAuth integration
  4. Role-based access control (User/Admin)
  5. Automatic token refresh handling
- **Usage**: Register account, login, manage profile, admin panel access

### 🛒 **Shopping Cart System**
- **Location**: `src/application/services/cart/`, `client/src/store/slices/cartSlice.ts`
- **Workflow**:
  1. Add products to cart with quantity selection
  2. Real-time cart updates with Redux state management
  3. Coupon application and discount calculations
  4. Cart persistence across sessions
  5. Stock validation before checkout
- **Usage**: Add/remove items, update quantities, apply coupons, view cart total

### 💳 **Payment Processing**
- **Location**: `src/application/services/payment/stripe.service.ts`, `client/src/user/CheckoutPage.jsx`
- **Workflow**:
  1. Stripe payment intent creation
  2. Secure payment processing
  3. Webhook handling for payment confirmation
  4. Support for both online and COD payments
  5. Payment verification and order confirmation
- **Usage**: Select payment method, complete checkout, receive confirmation

### 📦 **Order Management**
- **Location**: `src/application/services/order/`, `client/src/user/OrderConfirmationPage.jsx`
- **Workflow**:
  1. Order creation from cart items
  2. Address and delivery information collection
  3. Order status tracking (pending → confirmed → processing → shipped → delivered)
  4. Order history and management
  5. Invoice generation (PDF)
- **Usage**: Place orders, track delivery, view order history

### 🏷️ **Category Management**
- **Location**: `src/application/services/category/`, `client/src/user/CategoryNavigation.jsx`
- **Workflow**:
  1. Hierarchical category structure
  2. Product categorization and filtering
  3. Category-specific product pages
  4. Admin category management
- **Usage**: Navigate by category, filter products, browse collections

### ❤️ **Wishlist System**
- **Location**: `src/application/services/wishlist/`, `client/src/store/slices/wishlistSlice.ts`
- **Workflow**:
  1. Save favorite products
  2. Wishlist management and organization
  3. Move items from wishlist to cart
  4. Wishlist sharing capabilities
- **Usage**: Save products, organize favorites, quick add to cart

### 🎫 **Coupon System**
- **Location**: `src/application/services/coupon/`, `src/application/services/cart/`
- **Workflow**:
  1. Coupon code validation
  2. Discount application to cart
  3. Coupon removal and recalculation
  4. Expiry date and usage limits
- **Usage**: Apply discount codes, view savings, remove coupons

### 🏠 **Address Management**
- **Location**: `src/application/services/address/`, `client/src/user/ProfilePage.jsx`
- **Workflow**:
  1. Multiple address storage
  2. Default address selection
  3. Address validation and formatting
  4. Delivery address for orders
- **Usage**: Add/edit addresses, set defaults, manage delivery locations

### 📊 **Admin Dashboard**
- **Location**: `client/src/admin/`, `src/application/services/admin/`
- **Workflow**:
  1. Product CRUD operations
  2. Category management
  3. Order monitoring and status updates
  4. Sales analytics and reporting
  5. User management
- **Usage**: Manage inventory, view analytics, process orders, user administration

### 🔍 **Search & Filtering**
- **Location**: `src/application/services/product/`, `client/src/services/productSearch.service.ts`
- **Workflow**:
  1. Product search by name, brand, model
  2. Advanced filtering (price range, category, brand)
  3. Search result pagination
  4. Real-time search suggestions
- **Usage**: Search products, apply filters, browse results

### 📱 **Responsive Design**
- **Location**: `client/src/user/`, `client/src/admin/`
- **Workflow**:
  1. Mobile-first responsive design
  2. Material-UI components
  3. Adaptive layouts for all devices
  4. Touch-friendly interactions
- **Usage**: Access platform from any device with optimal experience

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js, Google OAuth
- **Payment**: Stripe API
- **File Storage**: Cloudinary
- **Validation**: Joi
- **Testing**: Jest, Supertest
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, Presentation layers)

### Frontend
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation
- **Build Tool**: Vite
- **Styling**: Emotion, CSS-in-JS

### DevOps & Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Environment**: dotenv configuration

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd BuyNest

# Install dependencies
npm install

# Environment configuration
cp env.example .env
# Edit .env with your configuration:
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - CLOUDINARY credentials
# - Google OAuth credentials

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

### Database Setup
```bash
# Ensure MongoDB is running
# The application will automatically create collections on first run
# Or run mock data generation:
npm run generate-mock-data
```

## Usage Guide

### For Users

#### Shopping Experience
1. **Browse Products**: Navigate categories or use search functionality
2. **Product Details**: View images, descriptions, pricing, and reviews
3. **Add to Cart**: Select quantity and add items to shopping cart
4. **Cart Management**: Review items, apply coupons, update quantities
5. **Checkout**: Provide delivery address and payment information
6. **Order Tracking**: Monitor order status and delivery progress

#### Account Management
1. **Registration**: Create account with email verification
2. **Profile**: Manage personal information and addresses
3. **Orders**: View order history and track current orders
4. **Wishlist**: Save favorite products for later purchase

### For Administrators

#### Product Management
1. **Add Products**: Upload images, set pricing, configure inventory
2. **Edit Products**: Update information, manage stock levels
3. **Category Management**: Organize products into categories
4. **Product Visibility**: Control which products are listed

#### Order Management
1. **Order Processing**: Review and confirm new orders
2. **Status Updates**: Track order progress through fulfillment
3. **Inventory Control**: Monitor stock levels and reorder points

#### Analytics & Reporting
1. **Sales Dashboard**: View revenue and order metrics
2. **Product Performance**: Analyze top-selling items
3. **Customer Insights**: Monitor user behavior and preferences

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Token refresh
- `GET /api/v1/auth/google-login` - Google OAuth

#### Products
- `GET /api/v1/product` - List products
- `GET /api/v1/product/:id` - Get product details
- `POST /api/v1/product` - Create product (admin)
- `PUT /api/v1/product/:id` - Update product (admin)
- `GET /api/v1/product/search` - Search products

#### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove/:productId` - Remove item
- `POST /api/v1/cart/coupon/apply` - Apply coupon

#### Orders
- `POST /api/v1/order` - Create order
- `GET /api/v1/order` - Get user orders
- `GET /api/v1/order/:id` - Get order details
- `PUT /api/v1/order/:orderId` - Update order status

## Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript and ESLint configurations
2. **Architecture**: Maintain clean architecture principles
3. **Testing**: Write unit and integration tests for new features
4. **Documentation**: Update documentation for API changes
5. **Git Workflow**: Use feature branches and descriptive commit messages

### Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api
npm run test:unit
npm run test:integration

# Run with coverage
npm run test:coverage

# E2E testing with Cypress
npm run test:e2e
```

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Type checking
npm run typecheck
```

## Project Structure

```
BuyNest/
├── src/                          # Backend source code
│   ├── application/              # Business logic services
│   ├── domain/                   # Entities and interfaces
│   ├── infrastructure/           # Database and external services
│   └── presentation/             # Controllers and routes
├── client/                       # Frontend React application
│   ├── src/
│   │   ├── admin/               # Admin panel components
│   │   ├── user/                # User interface components
│   │   ├── store/               # Redux state management
│   │   └── services/            # API integration
│   └── public/                  # Static assets
├── tests/                        # Test files
└── docs/                         # Documentation
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/buynest

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Deployment

### Production Build
```bash
# Backend
npm run build
npm start

# Frontend
cd client
npm run build
# Serve dist/ folder with your web server
```

### Docker Deployment
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## License

This project is licensed under the ISC License.

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Review the documentation and API reference

---

**BuyNest** - Building the future of e-commerce, one feature at a time.
