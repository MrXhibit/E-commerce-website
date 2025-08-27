# BuyNest - MERN Stack E-commerce Platform

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring TypeScript, Material-UI, Stripe payments, Google OAuth, and admin dashboard.

## 🚀 Features

### User Features
- **Authentication**: Email/password registration & login, Google OAuth
- **Product Browsing**: Product listings, search, filters, categories
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Checkout**: Stripe payment integration, order management
- **User Profile**: Profile management, order history, address management
- **Wishlist**: Save favorite products for later

### Admin Features
- **Product Management**: CRUD operations for products, categories, coupons
- **Order Management**: View, update, and manage customer orders
- **Sales Reports**: Generate sales reports in JSON and CSV formats
- **User Management**: View and manage user accounts
- **Dashboard**: Analytics and overview of platform performance

### Technical Features
- **TypeScript**: Full-stack TypeScript implementation
- **Responsive Design**: Material-UI components with mobile-first approach
- **Image Upload**: Cloudinary integration for product and profile images
- **Payment Processing**: Stripe integration for secure payments
- **Real-time Updates**: Redux state management with RTK Query
- **API Security**: JWT authentication, role-based access control

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Vite** for build tooling
- **Axios** for API calls

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Stripe** for payments
- **JWT** for token management

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google OAuth credentials
- Stripe account
- Cloudinary account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BuyNest
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables:**
```env
# Database
DB_URL=mongodb://localhost:27017/buynest

# Server
PORT=5000
APP_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string
```

### 5. Run the Application
```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
BuyNest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── admin/         # Admin dashboard components
│   │   ├── user/          # User-facing components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── contexts/      # React contexts
│   └── package.json
├── src/                    # Node.js backend
│   ├── application/        # Business logic services
│   ├── domain/            # Entities and interfaces
│   ├── infrastructure/    # Database, external services
│   └── presentation/      # Controllers, routes, middleware
├── package.json
└── README.md
```

## 🔧 Available Scripts

### Server
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint checking
npm run test         # Run tests
```

### Client
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint checking
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api
npm run test:unit
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🔒 Security Features

- JWT token authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920×1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔄 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `POST /api/orders/checkout` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/admin/orders` - Get all orders (Admin)

### Payments
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Stripe webhook handler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Shipping integration
- [ ] Customer reviews and ratings

---

**Note**: This is a production-ready e-commerce platform. Make sure to:
- Set up proper environment variables
- Configure your database connections
- Set up SSL certificates for production
- Configure proper CORS settings
- Set up monitoring and logging
- Implement proper error handling
- Set up backup strategies
