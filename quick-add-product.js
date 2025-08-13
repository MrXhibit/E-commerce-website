// Quick script to add a product with images to your database
const mongoose = require('mongoose');
require('dotenv').config();

// Simple product model (matching your schema)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    id: { type: String, required: true }
  }],
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brandName: { type: String, required: true },
  modelName: { type: String, required: true },
  stock: { type: Number, required: true },
  isListed: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    id: { type: String, required: true }
  },
  isListed: { type: Boolean, default: true }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

async function quickAddProduct() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to database');

    // Get Electronics category
    const category = await Category.findOne({ name: 'Electronics' });
    if (!category) {
      console.log('❌ Electronics category not found');
      return;
    }

    console.log('📦 Found category:', category.name, 'ID:', category._id);

    // Create new product
    const newProduct = new Product({
      name: 'Bluetooth Wireless Speaker',
      description: 'Portable Bluetooth speaker with premium sound quality and 12-hour battery life',
      price: '59.99',
      brandName: 'SoundTech',
      modelName: 'Portable Pro',
      stock: 60,
      category: category._id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
          id: 'bluetooth_speaker_1'
        },
        {
          url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
          id: 'bluetooth_speaker_2'
        },
        {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          id: 'bluetooth_speaker_3'
        }
      ],
      isListed: true
    });

    const savedProduct = await newProduct.save();
    
    console.log('🎉 Product added successfully!');
    console.log('   - ID:', savedProduct._id);
    console.log('   - Name:', savedProduct.name);
    console.log('   - Price:', savedProduct.price);
    console.log('   - Images:', savedProduct.images.length);
    console.log('   - First Image:', savedProduct.images[0].url);

    // Verify by counting total products
    const totalProducts = await Product.countDocuments();
    console.log('📊 Total products in database:', totalProducts);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the function
quickAddProduct();