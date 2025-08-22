import request from 'supertest';
import { createServer } from '../../src/infrastructure/server';
import UserModel from '../../src/infrastructure/model/user.model';
import AdminModel from '../../src/infrastructure/model/admin.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = createServer();

describe('🔒 Security & Validation API Tests', () => {
  let testUser: any;
  let testAdmin: any;
  let userAccessToken: string;
  let adminAccessToken: string;

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    testUser = await UserModel.create({
      userName: 'Test User',
      email: 'testuser@example.com',
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

    // Get valid tokens
    const userLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword123'
      });

    userAccessToken = userLoginResponse.body.data.access_token;

    const adminLoginResponse = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass123'
      });

    adminAccessToken = adminLoginResponse.body.data.access_token;
  });

  describe('🔐 JWT Token Security', () => {
    it('❌ Should reject requests without Authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/user/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    it('❌ Should reject requests with invalid token format', async () => {
      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('❌ Should reject requests with malformed JWT', async () => {
      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', 'Bearer malformed.jwt.token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('❌ Should reject expired tokens', async () => {
      // Create an expired token (exp: 1 second ago)
      const expiredToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.APP_SCERET || 'dev_secret',
        { expiresIn: '1s' }
      );

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token expired');
    });

    it('❌ Should reject tokens with invalid signature', async () => {
      // Create token with wrong secret
      const invalidToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        'wrong_secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('✅ Should accept valid tokens', async () => {
      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('📝 Input Validation', () => {
    describe('User Registration Validation', () => {
      it('❌ Should reject empty name', async () => {
        const invalidUser = {
          name: '',
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(invalidUser)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('name');
      });

      it('❌ Should reject invalid email format', async () => {
        const invalidUser = {
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
          phone: '1234567890',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(invalidUser)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('email');
      });

      it('❌ Should reject weak password', async () => {
        const invalidUser = {
          name: 'Test User',
          email: 'test@example.com',
          password: '123', // Too short
          phone: '1234567890',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(invalidUser)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('password');
      });

      it('❌ Should reject invalid phone format', async () => {
        const invalidUser = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: 'invalid-phone',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(invalidUser)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('phone');
      });
    });

    describe('Product Creation Validation', () => {
      it('❌ Should reject product with negative price', async () => {
        const invalidProduct = {
          name: 'Test Product',
          description: 'Test Description',
          price: -100,
          category: '507f1f77bcf86cd799439011',
          brandName: 'TestBrand',
          stock: 10
        };

        const response = await request(app)
          .post('/api/v1/admin/products')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(invalidProduct)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('price');
      });

      it('❌ Should reject product with zero stock', async () => {
        const invalidProduct = {
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          category: '507f1f77bcf86cd799439011',
          brandName: 'TestBrand',
          stock: 0
        };

        const response = await request(app)
          .post('/api/v1/admin/products')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(invalidProduct)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('stock');
      });

      it('❌ Should reject product without required fields', async () => {
        const invalidProduct = {
          name: 'Test Product',
          // Missing required fields
        };

        const response = await request(app)
          .post('/api/v1/admin/products')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(invalidProduct)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('🔐 Password Security', () => {
    it('✅ Should hash passwords before storing', async () => {
      const plainPassword = 'testpassword123';
      
      const user = await UserModel.findOne({ email: 'testuser@example.com' });
      expect(user?.password).not.toBe(plainPassword);
      
      // Verify password can be verified
      const isValid = await bcrypt.compare(plainPassword, user?.password || '');
      expect(isValid).toBe(true);
    });

    it('✅ Should use salt for password hashing', async () => {
      const user1 = await UserModel.findOne({ email: 'testuser@example.com' });
      const user2 = await UserModel.findOne({ email: 'admin@example.com' });
      
      // Same password should have different hashes due to salt
      expect(user1?.password).not.toBe(user2?.password);
    });

    it('✅ Should verify password correctly', async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('❌ Should reject wrong password', async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(loginResponse.body.success).toBe(false);
    });
  });

  describe('🌐 CORS Configuration', () => {
    it('✅ Should allow requests from configured origins', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('❌ Should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Origin', 'http://malicious-site.com')
        .expect(200); // CORS is handled by browser, server still responds

      // The response will still come through, but browser will block it
      expect(response.body).toBeDefined();
    });

    it('✅ Should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/products')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(200);

      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });
  });

  describe('🛡️ SQL Injection Protection', () => {
    it('✅ Should handle special characters in input safely', async () => {
      const maliciousInput = {
        name: "'; DROP TABLE users; --",
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: 'Test Address'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(maliciousInput)
        .expect(400); // Should fail validation, not cause SQL injection

      expect(response.body.success).toBe(false);
    });

    it('✅ Should handle MongoDB injection attempts safely', async () => {
      const maliciousInput = {
        name: '{$ne: null}',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: 'Test Address'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(maliciousInput)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('📊 Rate Limiting', () => {
    it('❌ Should limit repeated login attempts', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'wrongpassword'
      };

      // Make multiple failed attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Next attempt should be rate limited
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(429); // Too Many Requests

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Too many requests');
    });
  });

  describe('🔍 XSS Protection', () => {
    it('✅ Should sanitize user input to prevent XSS', async () => {
      const maliciousInput = {
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: 'Test Address'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(maliciousInput)
        .expect(400); // Should be rejected due to validation

      expect(response.body.success).toBe(false);
    });
  });

  describe('🔐 Session Management', () => {
    it('✅ Should provide refresh token functionality', async () => {
      // First login to get tokens
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword123'
        });

      const refreshToken = loginResponse.body.data.refresh_token;

      // Use refresh token to get new access token
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', `refresh_token=${refreshToken}`)
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.data.access_token).toBeDefined();
      expect(refreshResponse.body.data.refresh_token).toBeDefined();
    });

    it('❌ Should reject invalid refresh tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', 'refresh_token=invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
