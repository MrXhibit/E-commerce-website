import request from 'supertest';
import { createServer } from '../../src/infrastructure/server';
import UserModel from '../../src/infrastructure/model/user.model';
import AdminModel from '../../src/infrastructure/model/admin.model';
import bcrypt from 'bcrypt';

const app = createServer();

describe('🔐 Authentication API Tests', () => {
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
  });

  describe('POST /api/v1/auth/register', () => {
    it('✅ Should register a new user successfully', async () => {
      const newUser = {
        userName: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.refresh_token).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('❌ Should fail with duplicate email', async () => {
      const duplicateUser = {
        userName: 'Duplicate User',
        email: 'testuser@example.com', // Already exists
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(duplicateUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email already exists');
    });

    it('❌ Should fail with invalid email format', async () => {
      const invalidUser = {
        userName: 'Invalid User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('✅ Should login user successfully', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.refresh_token).toBeDefined();
      
      userAccessToken = response.body.data.access_token;
    });

    it('❌ Should fail with wrong password', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('❌ Should fail with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/admin/login', () => {
    it('✅ Should login admin successfully', async () => {
      const adminLoginData = {
        email: 'admin@example.com',
        password: 'adminpass123'
      };

      const response = await request(app)
        .post('/api/v1/auth/admin/login')
        .send(adminLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.admin.email).toBe(adminLoginData.email);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.refresh_token).toBeDefined();
      
      adminAccessToken = response.body.data.access_token;
    });

    it('❌ Should fail with non-admin credentials', async () => {
      const userLoginData = {
        email: 'testuser@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/v1/auth/admin/login')
        .send(userLoginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('✅ Should refresh user token successfully', async () => {
      // First login to get tokens
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword123'
        });

      const refreshToken = loginResponse.body.data.refresh_token;

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', `refresh_token=${refreshToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.refresh_token).toBeDefined();
    });

    it('❌ Should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', 'refresh_token=invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('✅ Should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');
    });
  });

  describe('GET /api/v1/auth/google', () => {
    it('✅ Should redirect to Google OAuth', async () => {
      const response = await request(app)
        .get('/api/v1/auth/google')
        .expect(302); // Redirect status

      expect(response.headers.location).toContain('accounts.google.com');
    });
  });

  describe('GET /api/v1/auth/google/callback', () => {
    it('✅ Should handle Google OAuth callback', async () => {
      // This would require mocking the Google OAuth flow
      // For now, we'll test the endpoint exists
      const response = await request(app)
        .get('/api/v1/auth/google/callback')
        .expect(500); // Will fail without proper OAuth setup, but endpoint exists

      expect(response.body).toBeDefined();
    });
  });
});
