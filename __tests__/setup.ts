import mongoose from 'mongoose';

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3001';
  process.env.DB_URL = 'mongodb://127.0.0.1:27017/buynest_test';
  process.env.APP_SECRET = 'test_secret_key_for_testing_only';
  process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
  process.env.CLOUDINARY_API_KEY = 'test_api_key';
  process.env.CLOUDINARY_API_SECRET = 'test_api_secret';
  process.env.GOOGLE_CLIENT_ID = 'test_google_client_id';
  process.env.GOOGLE_CLIENT_SECRET = 'test_google_client_secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock_secret';
  process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:3001';
  process.env.CORS_CREDENTIALS = 'true';
  process.env.HELMET_ENABLED = 'true';
  process.env.HTTPS_ENABLED = 'false';
  
  // Initialize test database connection
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.error('❌ Test database disconnection failed:', error);
  }
});

// Clean database between tests
afterEach(async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  }
});

// Global test timeout
jest.setTimeout(30000);

// Mock console methods in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
