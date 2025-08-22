import request from 'supertest';
import { createServer } from '../../src/infrastructure/server';
import UserModel from '../../src/infrastructure/model/user.model';
import ProductModel from '../../src/infrastructure/model/product.model';
import CategoryModel from '../../src/infrastructure/model/category.model';
import CartModel from '../../src/infrastructure/model/cart.model';
import OrderModel from '../../src/infrastructure/model/order.model';
import CouponModel from '../../src/infrastructure/model/coupon.model';
import bcrypt from 'bcrypt';

const app = createServer();

describe('🛒 Cart & Order API Tests', () => {
  let testUser: any;
  let testProduct: any;
  let testCategory: any;
  let testCart: any;
  let testOrder: any;
  let testCoupon: any;
  let userAccessToken: string;

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('userpass123', 10);
    testUser = await UserModel.create({
      userName: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      isEmailVerified: true
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

    // Create test cart
    testCart = await CartModel.create({
      user: testUser._id,
      items: [{
        product: testProduct._id,
        quantity: 2,
        price: 99.99
      }],
      total: 199.98
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
  });

  describe('🛒 Cart Operations', () => {
    describe('POST /api/v1/cart/add', () => {
      it('✅ Should add product to cart successfully', async () => {
        const cartItem = {
          productId: testProduct._id,
          quantity: 2
        };

        const response = await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(cartItem)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(1);
        expect(response.body.data.items[0].productId).toBe(testProduct._id.toString());
        expect(response.body.data.items[0].quantity).toBe(2);
        expect(response.body.data.total).toBe(testProduct.price * 2);
      });

      it('✅ Should update quantity if product already in cart', async () => {
        // First add product
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        // Add same product again
        const response = await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 2
          });

        expect(response.body.success).toBe(true);
        expect(response.body.data.items[0].quantity).toBe(3);
        expect(response.body.data.total).toBe(testProduct.price * 3);
      });

      it('❌ Should fail with invalid product ID', async () => {
        const cartItem = {
          productId: 'invalid-id',
          quantity: 1
        };

        const response = await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(cartItem)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('❌ Should fail without authentication', async () => {
        const cartItem = {
          productId: testProduct._id,
          quantity: 1
        };

        const response = await request(app)
          .post('/api/v1/cart/add')
          .send(cartItem)
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/v1/cart/update', () => {
      it('✅ Should update cart item quantity successfully', async () => {
        // First add product to cart
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        // Update quantity
        const updateData = {
          productId: testProduct._id,
          quantity: 5
        };

        const response = await request(app)
          .put('/api/v1/cart/update')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items[0].quantity).toBe(5);
        expect(response.body.data.total).toBe(testProduct.price * 5);
      });
    });

    describe('DELETE /api/v1/cart/remove', () => {
      it('✅ Should remove product from cart successfully', async () => {
        // First add product to cart
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        // Remove product
        const response = await request(app)
          .delete('/api/v1/cart/remove')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(0);
        expect(response.body.data.total).toBe(0);
      });
    });

    describe('GET /api/v1/cart', () => {
      it('✅ Should get user cart successfully', async () => {
        // Add product to cart first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 2
          });

        const response = await request(app)
          .get('/api/v1/cart')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(1);
        expect(response.body.data.total).toBe(testProduct.price * 2);
      });
    });

    describe('DELETE /api/v1/cart/clear', () => {
      it('✅ Should clear cart successfully', async () => {
        // Add product to cart first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        const response = await request(app)
          .delete('/api/v1/cart/clear')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(0);
        expect(response.body.data.total).toBe(0);
      });
    });
  });

  describe('🎫 Coupon Application', () => {
    describe('POST /api/v1/coupons/apply', () => {
      it('✅ Should apply valid coupon successfully', async () => {
        // Add product to cart first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        const couponData = {
          code: 'TEST20'
        };

        const response = await request(app)
          .post('/api/v1/coupons/apply')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(couponData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.discount).toBeDefined();
        expect(response.body.data.finalTotal).toBeLessThan(testProduct.price);
      });

      it('❌ Should fail with invalid coupon code', async () => {
        const couponData = {
          code: 'INVALID'
        };

        const response = await request(app)
          .post('/api/v1/coupons/apply')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(couponData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('❌ Should fail with expired coupon', async () => {
        // Create expired coupon
        const expiredCoupon = await CouponModel.create({
          code: 'EXPIRED',
          discount: 10,
          type: 'percentage',
          validFrom: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          validUntil: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          minPurchase: 0,
          maxDiscount: 50,
          usageLimit: 100,
          usedCount: 0
        });

        const couponData = {
          code: 'EXPIRED'
        };

        const response = await request(app)
          .post('/api/v1/coupons/apply')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(couponData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('📦 Order Management', () => {
    describe('POST /api/v1/orders/create', () => {
      it('✅ Should create order successfully (COD)', async () => {
        // Add product to cart first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 2
          });

        const orderData = {
          paymentMethod: 'COD',
          shippingAddress: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
          },
          items: [
            {
              productId: testProduct._id,
              quantity: 2,
              price: testProduct.price
            }
          ]
        };

        const response = await request(app)
          .post('/api/v1/orders/create')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(orderData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.orderId).toBeDefined();
        expect(response.body.data.status).toBe('pending');
        expect(response.body.data.paymentMethod).toBe('COD');
      });

      it('✅ Should create order with Stripe payment', async () => {
        // Add product to cart first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        const orderData = {
          paymentMethod: 'stripe',
          paymentIntentId: 'pi_test_123456789',
          shippingAddress: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
          },
          items: [
            {
              productId: testProduct._id,
              quantity: 1,
              price: testProduct.price
            }
          ]
        };

        const response = await request(app)
          .post('/api/v1/orders/create')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(orderData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.paymentMethod).toBe('stripe');
      });
    });

    describe('GET /api/v1/orders', () => {
      it('✅ Should get user orders successfully', async () => {
        // Create an order first
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            productId: testProduct._id,
            quantity: 1
          });

        await request(app)
          .post('/api/v1/orders/create')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            paymentMethod: 'COD',
            shippingAddress: {
              street: '123 Test Street',
              city: 'Test City',
              state: 'Test State',
              zipCode: '12345',
              country: 'Test Country'
            },
            items: [
              {
                productId: testProduct._id,
                quantity: 1,
                price: testProduct.price
              }
            ]
          });

        const response = await request(app)
          .get('/api/v1/orders')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
      });
    });

    describe('GET /api/v1/orders/:id', () => {
      it('✅ Should get specific order details', async () => {
        // Create an order first
        const orderResponse = await request(app)
          .post('/api/v1/orders/create')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            paymentMethod: 'COD',
            shippingAddress: {
              street: '123 Test Street',
              city: 'Test City',
              state: 'Test State',
              zipCode: '12345',
              country: 'Test Country'
            },
            items: [
              {
                productId: testProduct._id,
                quantity: 1,
                price: testProduct.price
              }
            ]
          });

        const orderId = orderResponse.body.data.orderId;

        const response = await request(app)
          .get(`/api/v1/orders/${orderId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(orderId);
        expect(response.body.data.items).toHaveLength(1);
      });
    });

    describe('PATCH /api/v1/orders/:id/status', () => {
      it('✅ Should update order status successfully', async () => {
        // Create an order first
        const orderResponse = await request(app)
          .post('/api/v1/orders/create')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            paymentMethod: 'COD',
            shippingAddress: {
              street: '123 Test Street',
              city: 'Test City',
              state: 'Test State',
              zipCode: '12345',
              country: 'Test Country'
            },
            items: [
              {
                productId: testProduct._id,
                quantity: 1,
                price: testProduct.price
              }
            ]
          });

        const orderId = orderResponse.body.data.orderId;

        const response = await request(app)
          .patch(`/api/v1/orders/${orderId}/status`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            status: 'shipped'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('shipped');
      });
    });
  });
});
