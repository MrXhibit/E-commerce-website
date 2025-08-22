import request from 'supertest';
import { createServer } from '../../src/infrastructure/server';
import ProductModel from '../../src/infrastructure/model/product.model';
import CategoryModel from '../../src/infrastructure/model/category.model';
import AdminModel from '../../src/infrastructure/model/admin.model';
import bcrypt from 'bcrypt';

const app = createServer();

describe('📦 Product API Tests', () => {
  let testProduct: any;
  let testCategory: any;
  let testAdmin: any;
  let adminAccessToken: string;

  beforeEach(async () => {
    // Create test category
    testCategory = await CategoryModel.create({
      name: 'Test Category',
      description: 'Test category description',
      image: 'test-image.jpg'
    });

    // Create test admin
    const adminHashedPassword = await bcrypt.hash('adminpass123', 10);
    testAdmin = await AdminModel.create({
      userName: 'Test Admin',
      email: 'admin@example.com',
      password: adminHashedPassword
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
  });

  describe('GET /api/v1/products', () => {
    it('✅ Should get all products with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/products?limit=10&skip=0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it('✅ Should filter products by category', async () => {
      const response = await request(app)
        .get(`/api/v1/products?category=${testCategory._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((product: any) => 
        product.category === testCategory._id.toString()
      )).toBe(true);
    });

    it('✅ Should search products by name', async () => {
      const response = await request(app)
        .get('/api/v1/products?search=laptop')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.some((product: any) => 
        product.name.toLowerCase().includes('laptop')
      )).toBe(true);
    });

    it('✅ Should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/v1/products?minPrice=500&maxPrice=1500')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((product: any) => 
        product.price >= 500 && product.price <= 1500
      )).toBe(true);
    });

    it('✅ Should sort products by price (ascending)', async () => {
      const response = await request(app)
        .get('/api/v1/products?sortBy=price&sortOrder=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      const prices = response.body.data.map((p: any) => p.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    it('✅ Should sort products by price (descending)', async () => {
      const response = await request(app)
        .get('/api/v1/products?sortBy=price&sortOrder=desc')
        .expect(200);

      expect(response.body.success).toBe(true);
      const prices = response.body.data.map((p: any) => p.price);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('✅ Should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${testProduct._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testProduct._id.toString());
      expect(response.body.data.name).toBe(testProduct.name);
      expect(response.body.data.images).toHaveLength(2);
    });

    it('❌ Should fail with invalid product ID', async () => {
      const response = await request(app)
        .get('/api/v1/products/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('❌ Should fail with non-existent product ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/products (Admin Only)', () => {
    it('✅ Should create product successfully (Admin)', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'A brand new product',
        price: 299.99,
        category: testCategory._id,
        stock: 25,
        images: ['new1.jpg']
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.price).toBe(newProduct.price);
    });

    it('❌ Should fail without admin authentication', async () => {
      const newProduct = {
        name: 'Unauthorized Product',
        description: 'This should fail',
        price: 199.99,
        category: testCategory._id,
        stock: 5
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .send(newProduct)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('❌ Should fail with invalid product data', async () => {
      const invalidProduct = {
        name: '', // Invalid: empty name
        price: -100, // Invalid: negative price
        category: 'invalid-category-id'
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(invalidProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/admin/products/:id (Admin Only)', () => {
    it('✅ Should update product successfully (Admin)', async () => {
      const updateData = {
        name: 'Updated Laptop',
        price: 1299.99,
        stock: 15
      };

      const response = await request(app)
        .put(`/api/v1/admin/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.stock).toBe(updateData.stock);
    });

    it('❌ Should fail updating non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'Fake Product' };

      const response = await request(app)
        .put(`/api/v1/admin/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/products/:id (Admin Only)', () => {
    it('✅ Should delete product successfully (Admin)', async () => {
      const response = await request(app)
        .delete(`/api/v1/admin/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify product is deleted
      const getResponse = await request(app)
        .get(`/api/v1/products/${testProduct._id}`)
        .expect(404);
    });

    it('❌ Should fail deleting non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/v1/admin/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/admin/products/:id/status (Admin Only)', () => {
    it('✅ Should toggle product status successfully (Admin)', async () => {
      const response = await request(app)
        .patch(`/api/v1/admin/products/${testProduct._id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(!testProduct.isActive);
    });
  });

  describe('GET /api/v1/products/featured', () => {
    it('✅ Should get featured products', async () => {
      // Create a featured product
      await ProductModel.create({
        name: 'Featured Product',
        description: 'A featured product',
        price: 499.99,
        category: testCategory._id,
        stock: 5,
        isFeatured: true,
        isActive: true
      });

      const response = await request(app)
        .get('/api/v1/products/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/products/category/:categoryId', () => {
    it('✅ Should get products by category ID', async () => {
      const response = await request(app)
        .get(`/api/v1/products/category/${testCategory._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.every((product: any) => 
        product.category === testCategory._id.toString()
      )).toBe(true);
    });
  });
});
