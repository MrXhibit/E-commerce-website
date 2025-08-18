# Buy Nest Backend - E-commerce Application

## Overview

Buy Nest Backend is a comprehensive e-commerce application built with Node.js, Express, TypeScript, and MongoDB. It follows Clean Architecture principles with clear separation of concerns across Domain, Application, Infrastructure, and Presentation layers.

## Architecture

The application follows a layered architecture:

- **Domain Layer**: Contains business entities, interfaces, and types
- **Application Layer**: Contains business logic and services
- **Infrastructure Layer**: Contains external concerns (database, utilities, configurations)
- **Presentation Layer**: Contains controllers, routes, and middleware

## Core Features

- User Authentication (Regular & Google OAuth)
- Admin Management
- Product Management
- Category Management
- Shopping Cart
- Wishlist
- Image Upload (Cloudinary)
- JWT Token Management

---

## Function Documentation

### 🔐 Authentication Functions

#### User Authentication (`src/presentation/controller/auth/auth.controller.ts`)

**`userLogin(req, res, next)`**

- **Purpose**: Authenticates user with email/password
- **Process**: Validates credentials, generates JWT tokens, sets HTTP-only cookies
- **Returns**: User data with access/refresh tokens
- **Cookies Set**: `access_token`, `refresh_token`

**`userRegister(req, res, next)`**

- **Purpose**: Registers new user account
- **Process**: Validates input, checks email uniqueness, hashes password, creates user
- **Returns**: User data with access/refresh tokens
- **Cookies Set**: `access_token`, `refresh_token`

**`userRefreshToken(req, res, next)`**

- **Purpose**: Refreshes expired access tokens
- **Process**: Validates refresh token, generates new tokens
- **Returns**: User data with new tokens
- **Cookies Updated**: `access_token`, `refresh_token`

**`adminLogin(req, res, next)`**

- **Purpose**: Authenticates admin users
- **Process**: Similar to user login but for admin accounts
- **Returns**: Admin data with tokens
- **Cookies Set**: `access_token_admin`, `refresh_token_admin`

**`adminRefreshToken(req, res, next)`**

- **Purpose**: Refreshes admin access tokens
- **Process**: Validates admin refresh token, generates new tokens
- **Returns**: Admin data with new tokens

**`googleLoginSucessController(req, res, next)`**

- **Purpose**: Handles successful Google OAuth login
- **Process**: Processes Google user data, generates tokens
- **Returns**: User data with tokens

#### Authentication Service (`src/application/services/user/user.service.ts`)

**`loginUser(requestBody)`**

- **Purpose**: Business logic for user login
- **Validation**: Checks email/password, handles Google users
- **Security**: Validates password with salt and hash
- **Returns**: Access token, refresh token, and sanitized user data

**`registerUser(requestBody)`**

- **Purpose**: Business logic for user registration
- **Validation**: Checks email uniqueness, validates input
- **Security**: Generates salt, hashes password
- **Returns**: Access token, refresh token, and sanitized user data

**`refreshToken(refreshToken)`**

- **Purpose**: Validates and refreshes user tokens
- **Security**: Verifies token signature and expiration
- **Returns**: New access/refresh tokens and user data

**`loginViaGoogle(email, googleId, name, profile)`**

- **Purpose**: Handles Google OAuth user creation/login
- **Process**: Creates new user or updates existing with Google data
- **Returns**: Sanitized user properties

**`googleSucessess(user)`**

- **Purpose**: Finalizes Google login process
- **Process**: Generates tokens for Google-authenticated user
- **Returns**: Complete authentication response

---

### 🛍️ Product Management Functions

#### Product Controller (`src/presentation/controller/product/product.controller.ts`)

**`createProduct(req, res, next)`**

- **Purpose**: Creates new product (Admin only)
- **Authentication**: Requires admin token
- **File Upload**: Handles multiple product images
- **Returns**: Created product data

**`getProducts(req, res, next)`**

- **Purpose**: Retrieves paginated product list
- **Parameters**: `limit` (default: 20), `skip` (default: 0)
- **Features**: Supports pagination, search, filter, sort (planned)
- **Returns**: Array of sanitized product data

**`getProductById(req, res, next)`**

- **Purpose**: Retrieves single product by ID
- **Parameters**: Product ID from URL params
- **Returns**: Single product data

**`editProduct(req, res, next)`**

- **Purpose**: Updates product information (Admin only)
- **Authentication**: Requires admin token
- **Validation**: Checks for duplicate name/brand/model combinations
- **Returns**: Updated product data

**`uploadProductImages(req, res, next)`**

- **Purpose**: Adds additional images to existing product (Admin only)
- **Authentication**: Requires admin token
- **File Upload**: Handles multiple image files
- **Returns**: Updated product with new images

**`deleteProductImage(req, res, next)`**

- **Purpose**: Removes specific image from product (Admin only)
- **Authentication**: Requires admin token
- **Cloud Storage**: Deletes image from Cloudinary
- **Returns**: Updated product data

#### Product Service (`src/application/services/product/product.service.ts`)

**`createProduct(files, reqBody, adminToken)`**

- **Purpose**: Business logic for product creation
- **Validation**: Validates admin token, product data, image files
- **Uniqueness**: Ensures unique name/brand/model combination
- **Cloud Upload**: Uploads images to Cloudinary
- **Returns**: Sanitized product data

**`getProducts(limit, skip)`**

- **Purpose**: Retrieves paginated products with business logic
- **Pagination**: Implements limit/skip pagination
- **Future**: Will include search, filter, sort functionality
- **Returns**: Array of sanitized products

**`editProduct(id, reqBody, adminToken)`**

- **Purpose**: Updates product with validation
- **Validation**: Checks admin authorization, uniqueness constraints
- **Selective Update**: Only updates changed fields
- **Returns**: Updated sanitized product

**`uploadImages(id, files, adminToken)`**

- **Purpose**: Adds images to existing product
- **Validation**: Admin authorization, file validation
- **Process**: Uploads to cloud, concatenates with existing images
- **Returns**: Updated product with all images

**`deletemage(id, image, adminToken)`**

- **Purpose**: Removes specific image from product
- **Validation**: Admin authorization, image existence
- **Cloud Cleanup**: Deletes from Cloudinary storage
- **Returns**: Updated product without deleted image

**`changeListStaus(id, isListed, adminToken)`**

- **Purpose**: Changes product visibility status
- **Authorization**: Admin only
- **Process**: Updates product listing status
- **Returns**: Updated product data

**`getSingleProduct(id)`**

- **Purpose**: Retrieves single product by ID
- **Returns**: Sanitized product data

---

### 📂 Category Management Functions

#### Category Controller (`src/presentation/controller/category/category.controller.ts`)

**`createCategory(req, res, next)`**

- **Purpose**: Creates new product category (Admin only)
- **Authentication**: Requires admin token
- **File Upload**: Handles category image upload
- **Returns**: Created category data

**`updateCategory(req, res, next)`**

- **Purpose**: Updates category information (Admin only)
- **Authentication**: Requires admin token
- **Returns**: Updated category data

**`listCategory(req, res, next)`**

- **Purpose**: Changes category listing status (Admin only)
- **Authentication**: Requires admin token
- **Process**: Enables/disables category visibility
- **Returns**: Updated category data

**`getCategory(req, res, next)`**

- **Purpose**: Retrieves paginated categories
- **Parameters**: `limit` (default: 10), `page` (default: 1)
- **Returns**: Array of categories with pagination

**`getCategoryById(req, res, next)`**

- **Purpose**: Retrieves single category by ID
- **Returns**: Single category data

**`uploadCategoryImage(req, res, next)`**

- **Purpose**: Updates category image (Admin only)
- **Authentication**: Requires admin token
- **File Upload**: Handles single image file
- **Returns**: Updated category with new image

**`getSubCategory(req, res, next)`**

- **Purpose**: Retrieves subcategories of a parent category
- **Parameters**: Parent category ID
- **Returns**: Array of subcategories

---

### 🛒 Shopping Cart Functions

#### Cart Service (`src/application/services/cart/cart.service.ts`)

**`addToCart(userId, productId, quantity)`**

- **Purpose**: Adds product to user's shopping cart
- **Validation**: Checks product existence
- **Logic**: Creates new cart if none exists, updates existing cart
- **Returns**: Updated cart object

**`getCart(userId)`**

- **Purpose**: Retrieves user's shopping cart
- **Fallback**: Returns empty cart if none exists
- **Returns**: User's cart with all items

**`updateCartItem(userId, productId, quantity)`**

- **Purpose**: Updates quantity of specific cart item
- **Validation**: Ensures cart exists
- **Returns**: Updated cart object

**`removeFromCart(userId, productId)`**

- **Purpose**: Removes specific product from cart
- **Validation**: Ensures cart exists
- **Returns**: Updated cart without removed item

**`clearCart(userId)`**

- **Purpose**: Removes all items from user's cart
- **Validation**: Ensures cart exists
- **Returns**: Empty cart object

---

### ❤️ Wishlist Functions

#### Wishlist Controller (`src/presentation/controller/wishlist/wishlist.controller.ts`)

**`addToWishlist(req, res)`**

- **Purpose**: Adds product to user's wishlist
- **Authentication**: Requires user authentication
- **Validation**: Checks product ID presence
- **Returns**: Updated wishlist data

**`getWishlist(req, res)`**

- **Purpose**: Retrieves user's complete wishlist
- **Authentication**: Requires user authentication
- **Returns**: Sanitized wishlist data

**`removeFromWishlist(req, res)`**

- **Purpose**: Removes specific product from wishlist
- **Authentication**: Requires user authentication
- **Parameters**: Product ID from URL params
- **Returns**: Updated wishlist without removed item

**`clearWishlist(req, res)`**

- **Purpose**: Removes all items from user's wishlist
- **Authentication**: Requires user authentication
- **Returns**: Empty wishlist confirmation

---

### 🔧 Utility Functions

#### Authentication Utils (`src/infrastructure/utills/auth.utils.ts`)

**`getSalt()`**

- **Purpose**: Generates cryptographic salt for password hashing
- **Returns**: Random salt string

**`getHashedPassword(password, salt)`**

- **Purpose**: Creates hashed password using bcrypt
- **Security**: Uses provided salt for consistent hashing
- **Returns**: Hashed password string

**`validatePassword(enteredPassword, savedPassword, salt)`**

- **Purpose**: Validates user password against stored hash
- **Process**: Hashes entered password and compares
- **Returns**: Boolean indicating password validity

**`generateAcessToken(email, id)`**

- **Purpose**: Creates JWT access token
- **Expiration**: 15 minutes
- **Payload**: User ID and email
- **Returns**: Signed JWT token

**`generateRefreshToken(id)`**

- **Purpose**: Creates JWT refresh token
- **Expiration**: 1 day
- **Payload**: User ID only
- **Returns**: Signed JWT token

**`validateUserLoginInput(reqBody)`**

- **Purpose**: Validates user login request data
- **Validation**: Uses Joi schema validation
- **Returns**: Validated email/password object

**`validateUserRegisterInput(reqBody)`**

- **Purpose**: Validates user registration request data
- **Validation**: Uses Joi schema validation
- **Returns**: Validated registration data object

**`validateAdminLoginInput(reqBody)`**

- **Purpose**: Validates admin login request data
- **Validation**: Uses Joi schema validation
- **Returns**: Validated admin credentials

---

### 🚀 Application Bootstrap Functions

#### Bootstrap (`src/infrastructure/config/index.ts`)

**`bootstrap()`**

- **Purpose**: Initializes the entire application
- **Process**:
  1. Connects to MongoDB database
  2. Creates default admin account
  3. Seeds initial data
- **Returns**: Promise that resolves when initialization complete

#### Server Creation (`src/infrastructure/server/index.ts`)

**`createServer()`**

- **Purpose**: Creates and configures Express server
- **Configuration**: Sets up middleware, routes, error handling
- **Returns**: Configured Express application instance

#### Main Application (`src/index.ts`)

**`start()`**

- **Purpose**: Main application entry point
- **Process**:
  1. Runs bootstrap initialization
  2. Creates server instance
  3. Starts listening on specified port
- **Error Handling**: Exits process on startup failure

---

## API Endpoints Structure

### Authentication Routes (`/api/v1/auth`)

- `POST /login` - User login
- `POST /register` - User registration
- `POST /refresh` - Token refresh
- `POST /admin/login` - Admin login
- `POST /admin/refresh` - Admin token refresh
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback

### Product Routes (`/api/v1/product`)

- `GET /` - Get all products (paginated)
- `GET /:id` - Get single product
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `POST /:id/images` - Upload product images (Admin)
- `DELETE /:id/images` - Delete product image (Admin)

### Category Routes (`/api/v1/category`)

- `GET /` - Get all categories (paginated)
- `GET /:id` - Get single category
- `GET /:id/subcategories` - Get subcategories
- `POST /` - Create category (Admin)
- `PUT /:id` - Update category (Admin)
- `POST /:id/image` - Upload category image (Admin)
- `PUT /:id/list` - Change listing status (Admin)

### Cart Routes (`/api/v1/cart`)

- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /update` - Update cart item
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Wishlist Routes (`/api/v1/wishlist`)

- `GET /` - Get user wishlist
- `POST /add` - Add item to wishlist
- `DELETE /remove/:productId` - Remove item from wishlist
- `DELETE /clear` - Clear entire wishlist

---

## Security Features

### Authentication & Authorization

- JWT-based authentication with access/refresh token pattern
- HTTP-only cookies for token storage
- Admin-specific token validation
- Google OAuth integration
- Password hashing with bcrypt and salt

### Data Validation

- Joi schema validation for all inputs
- File upload validation
- Unique constraint validation
- Authorization checks for admin operations

### Error Handling

- Custom error classes (ValidationError, AuthorizeError)
- Centralized error middleware
- Proper HTTP status codes
- Sanitized error responses

---

## Database Models

### User Model

- Authentication data (email, password, salt)
- Google OAuth data (googleId, profile)
- Refresh token storage
- User preferences and profile data

### Product Model

- Product information (name, description, price)
- Brand and model data
- Image storage (Cloudinary URLs)
- Category association
- Stock management
- Listing status

### Category Model

- Category hierarchy (parent/child relationships)
- Category images
- Listing status
- SEO-friendly slugs

### Cart Model

- User association
- Product items with quantities
- Automatic total calculations
- Timestamp tracking

### Wishlist Model

- User association
- Product references
- Timestamp tracking

---

## Environment Configuration

The application uses environment variables for configuration:

- `PORT` - Server port (default: 3000)
- `APP_SECRET` - JWT signing secret
- `MONGODB_URI` - Database connection string
- `CLOUDINARY_*` - Image upload service credentials
- `GOOGLE_*` - OAuth configuration

---

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run format` - Format code with Prettier
- `npm run generate-mock-data` - Generate sample data for development

---

## Error Handling

The application implements comprehensive error handling:

### Custom Error Types

- **ValidationError**: Input validation failures
- **AuthorizeError**: Authentication/authorization failures
- **NotFoundError**: Resource not found errors

### Error Middleware

- Centralized error processing
- Appropriate HTTP status codes
- Sanitized error messages
- Development vs production error details

---

## File Upload System

### Image Upload Features

- Cloudinary integration for cloud storage
- Multiple file upload support
- Image optimization and transformation
- Secure file validation
- Automatic cleanup on deletion

### Supported Operations

- Product image galleries
- Category thumbnails
- User profile pictures
- Bulk image operations

---

This README provides a comprehensive overview of all functions and their purposes within the Buy Nest Backend application. Each function is documented with its purpose, parameters, validation logic, and return values to help developers understand and maintain the codebase effectively.
