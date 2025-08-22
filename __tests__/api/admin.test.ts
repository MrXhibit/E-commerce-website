import request from 'supertest';
import { createServer } from '../../src/infrastructure/server';
import UserModel from '../../src/infrastructure/model/user.model';
import AdminModel from '../../src/infrastructure/model/admin.model';
import ProductModel from '../../src/infrastructure/model/product.model';
import CategoryModel from '../../src/infrastructure/model/category.model';
import OrderModel from '../../src/infrastructure/model/order.model';
import CouponModel from '../../src/infrastructure/model/coupon.model';
import bcrypt from 'bcrypt';

const app = createServer();

describe('👑 Admin API Tests', () => {
  let testUser: any;
  let testAdmin: any;
  let adminAccessToken: string;
  let testCategory: any;
  let testProduct: any;
  let testOrder: any;
  let testCoupon: any;

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('userpass123', 10);
    testUser = await UserModel.create({
      userName: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      isEmailVerified: true
    });

    // Create test admin
    const adminHashedPassword = await bcrypt.hash('adminpass123', 10);
    testAdmin = await AdminModel.create({
      userName: 'Test Admin',
      email: 'admin@example.com',
      password: adminHashedPassword
    });

    // Create test category
    testCategory = await CategoryModel.create({
      name: 'Test Category',
      description: 'Test category description',
      image: 'test-image.jpg'
    });

    // Create test product
    testProduct = await ProductModel.create({
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      category: testCategory._id,
      stock: 100,
      images: ['product1.jpg', 'product2.jpg']
    });

    // Create test order
    testOrder = await OrderModel.create({
      user: testUser._id,
      items: [{
        product: testProduct._id,
        quantity: 2,
        price: 99.99
      }],
      totalAmount: 199.98,
      status: 'pending',
      paymentMethod: 'COD'
    });

    // Create test coupon
    testCoupon = await CouponModel.create({
      code: 'TEST20',
      discount: 20,
      type: 'percentage',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      minPurchase: 100,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 0
    });

    // Login admin to get token
    const adminLoginResponse = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass123'
      });

    adminAccessToken = adminLoginResponse.body.data.access_token;
  });

  describe('🔐 Admin Authentication', () => {
    it('✅ Should allow admin access to protected routes', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('❌ Should deny non-admin access to admin routes', async () => {
      // Login as regular user
      const userLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpass123'
        });

      const userToken = userLoginResponse.body.data.access_token;

      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('👥 User Management', () => {
    describe('GET /api/v1/admin/users', () => {
      it('✅ Should get all users (Admin)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

      it('❌ Should fail without admin authentication', async () => {
        const response = await request(app)
          .get('/api/v1/admin/users')
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PATCH /api/v1/admin/users/:id/block', () => {
      it('✅ Should block user successfully (Admin)', async () => {
        const response = await request(app)
          .patch(`/api/v1/admin/users/${testUser._id}/block`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ isBlocked: true })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.isBlocked).toBe(true);
      });

      it('✅ Should unblock user successfully (Admin)', async () => {
        // First block the user
        await request(app)
          .patch(`/api/v1/admin/users/${testUser._id}/block`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ isBlocked: true });

        // Then unblock
        const response = await request(app)
          .patch(`/api/v1/admin/users/${testUser._id}/block`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ isBlocked: false })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.isBlocked).toBe(false);
      });
    });

    describe('DELETE /api/v1/admin/users/:id', () => {
      it('✅ Should delete user successfully (Admin)', async () => {
        const response = await request(app)
          .delete(`/api/v1/admin/users/${testUser._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('deleted successfully');

        // Verify user is deleted
        const deletedUser = await UserModel.findById(testUser._id);
        expect(deletedUser).toBeNull();
      });
    });
  });

  describe('📊 Admin Dashboard', () => {
    describe('GET /api/v1/admin/dashboard', () => {
      it('✅ Should get dashboard statistics (Admin)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/dashboard')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('totalUsers');
        expect(response.body.data).toHaveProperty('totalProducts');
        expect(response.body.data).toHaveProperty('totalOrders');
        expect(response.body.data).toHaveProperty('totalRevenue');
      });
    });

    describe('GET /api/v1/admin/analytics', () => {
      it('✅ Should get analytics data (Admin)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/analytics')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('📈 Sales Reports', () => {
    describe('GET /api/v1/admin/reports/sales', () => {
      it('✅ Should generate sales report (JSON)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/reports/sales?format=json')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      });

      it('✅ Should generate sales report (CSV)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/reports/sales?format=csv')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.headers['content-type']).toContain('text/csv');
        expect(response.text).toContain('Order ID,Date,Amount,Status');
      });
    });

    describe('GET /api/v1/admin/reports/products', () => {
      it('✅ Should generate product performance report', async () => {
        const response = await request(app)
          .get('/api/v1/admin/reports/products')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('🏷️ Coupon Management', () => {
    describe('POST /api/v1/admin/coupons', () => {
      it('✅ Should create coupon successfully (Admin)', async () => {
        const newCoupon = {
          code: 'NEW20',
          discountType: 'percentage',
          discountValue: 20,
          minPurchase: 100,
          maxDiscount: 200,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          usageLimit: 500,
          isActive: true
        };

        const response = await request(app)
          .post('/api/v1/admin/coupons')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newCoupon)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.code).toBe(newCoupon.code);
        expect(response.body.data.discountValue).toBe(newCoupon.discountValue);
      });
    });

    describe('PUT /api/v1/admin/coupons/:id', () => {
      it('✅ Should update coupon successfully (Admin)', async () => {
        const updateData = {
          discountValue: 25,
          maxDiscount: 250
        };

        const response = await request(app)
          .put(`/api/v1/admin/coupons/${testCoupon._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.discountValue).toBe(updateData.discountValue);
        expect(response.body.data.maxDiscount).toBe(updateData.maxDiscount);
      });
    });

    describe('DELETE /api/v1/admin/coupons/:id', () => {
      it('✅ Should delete coupon successfully (Admin)', async () => {
        const response = await request(app)
          .delete(`/api/v1/admin/coupons/${testCoupon._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('deleted successfully');
      });
    });
  });

  describe('📦 Order Management (Admin)', () => {
    describe('GET /api/v1/admin/orders', () => {
      it('✅ Should get all orders (Admin)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/orders')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
      });
    });

    describe('PATCH /api/v1/admin/orders/:id/status', () => {
      it('✅ Should update order status (Admin)', async () => {
        const updateData = {
          status: 'shipped',
          trackingNumber: 'TRK123456789'
        };

        const response = await request(app)
          .patch(`/api/v1/admin/orders/${testOrder._id}/status`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe(updateData.status);
        expect(response.body.data.trackingNumber).toBe(updateData.trackingNumber);
      });
    });
  });

  describe('🏠 Banner Management', () => {
    describe('POST /api/v1/admin/banners', () => {
      it('✅ Should create banner successfully (Admin)', async () => {
        const newBanner = {
          title: 'Summer Sale',
          description: 'Get up to 50% off on summer collection',
          imageUrl: 'https://example.com/banner1.jpg',
          link: '/summer-sale',
          isActive: true,
          order: 1
        };

        const response = await request(app)
          .post('/api/v1/admin/banners')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newBanner)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(newBanner.title);
        expect(response.body.data.imageUrl).toBe(newBanner.imageUrl);
      });
    });

    describe('GET /api/v1/admin/banners', () => {
      it('✅ Should get all banners (Admin)', async () => {
        const response = await request(app)
          .get('/api/v1/admin/banners')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
      });
    });
  });

  describe('🔒 Role-Based Access Control', () => {
    it('❌ Should deny access to admin routes for regular users', async () => {
      // Create another regular user
      const anotherUserPassword = await bcrypt.hash('anotherpass123', 10);
      const anotherUser = await UserModel.create({
        userName: 'Another User',
        email: 'anotheruser@example.com',
        password: anotherUserPassword,
        isEmailVerified: true
      });

      // Login as regular user
      const userLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'anotheruser@example.com',
          password: 'anotherpass123'
        });

      const userToken = userLoginResponse.body.data.access_token;

      // Try to access admin routes
      const adminRoutes = [
        '/api/v1/admin/dashboard',
        '/api/v1/admin/users',
        '/api/v1/admin/products',
        '/api/v1/admin/orders'
      ];

      for (const route of adminRoutes) {
        const response = await request(app)
          .get(route)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Access denied');
      }
    });

    it('✅ Should allow admin access to all admin routes', async () => {
      const adminRoutes = [
        '/api/v1/admin/dashboard',
        '/api/v1/admin/users',
        '/api/v1/admin/products',
        '/api/v1/admin/orders'
      ];

      for (const route of adminRoutes) {
        const response = await request(app)
          .get(route)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
      }
    });
  });
});
