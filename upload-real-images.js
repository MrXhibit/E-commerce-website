// Script to upload products with real image files
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadProductWithRealImages() {
  try {
    console.log('📤 Uploading product with real images...');

    // First, get a category ID
    const categoriesResponse = await fetch('http://localhost:5000/api/v1/category');
    const categoriesData = await categoriesResponse.json();
    const electronicsCategory = categoriesData.data.find(cat => cat.name === 'Electronics');
    
    if (!electronicsCategory) {
      throw new Error('Electronics category not found');
    }

    // Create form data
    const formData = new FormData();
    
    // Add product data
    formData.append('name', 'Custom Gaming Mouse');
    formData.append('description', 'High-precision gaming mouse with RGB lighting');
    formData.append('price', '79.99');
    formData.append('brandName', 'Gaming Pro');
    formData.append('modelName', 'RGB Pro X');
    formData.append('stock', '45');
    formData.append('category', electronicsCategory.id);

    // Add image files (you need to have these files in your project)
    const imageFiles = [
      'sample-image-1.jpg',
      'sample-image-2.jpg',
      'sample-image-3.jpg'
    ];

    for (const imageFile of imageFiles) {
      const imagePath = path.join(__dirname, 'images', imageFile);
      
      if (fs.existsSync(imagePath)) {
        const imageStream = fs.createReadStream(imagePath);
        formData.append('images', imageStream, imageFile);
        console.log(`📸 Added image: ${imageFile}`);
      } else {
        console.log(`⚠️ Image not found: ${imagePath}`);
      }
    }

    // If no real images, use placeholder
    if (imageFiles.every(file => !fs.existsSync(path.join(__dirname, 'images', file)))) {
      console.log('📸 No real images found, using URL-based images instead...');
      
      // Create a simple product with URL images using direct MongoDB insertion
      const mongoose = require('mongoose');
      
      // You would need to import your models here
      // This is just an example structure
      const productData = {
        name: 'Custom Gaming Mouse',
        description: 'High-precision gaming mouse with RGB lighting',
        price: '79.99',
        brandName: 'Gaming Pro',
        modelName: 'RGB Pro X',
        stock: 45,
        category: electronicsCategory.id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
            id: 'gaming_mouse_1'
          },
          {
            url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
            id: 'gaming_mouse_2'
          },
          {
            url: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500',
            id: 'gaming_mouse_3'
          }
        ],
        isListed: true
      };

      console.log('✅ Product data prepared:', productData);
      return productData;
    }

    // Send request to API (requires admin authentication)
    const response = await fetch('http://localhost:5000/api/v1/product', {
      method: 'POST',
      body: formData,
      headers: {
        // You need to add admin authentication cookie here
        // 'Cookie': 'access_token_admin=your-admin-token'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Product uploaded successfully!');
      console.log('   - Product ID:', result.product.id);
      console.log('   - Images uploaded:', result.product.images?.length || 0);
    } else {
      const error = await response.text();
      console.error('❌ Upload failed:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Alternative: Direct database insertion with image URLs
async function addProductWithImageUrls() {
  console.log('📝 Adding product with image URLs directly to database...');
  
  // This would require your MongoDB models
  // See the add-custom-products.ts file for the complete implementation
  
  const productData = {
    name: 'Wireless Gaming Headset',
    description: 'Premium wireless gaming headset with 7.1 surround sound',
    price: '149.99',
    brandName: 'Audio Pro',
    modelName: 'Wireless Pro 7.1',
    stock: 35,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        id: 'gaming_headset_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        id: 'gaming_headset_2'
      },
      {
        url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500',
        id: 'gaming_headset_3'
      }
    ]
  };

  console.log('✅ Product data ready for database insertion:', productData);
  return productData;
}

// Run the functions
console.log('🚀 Starting product upload process...\n');
uploadProductWithRealImages()
  .then(() => addProductWithImageUrls())
  .then(() => console.log('\n🎉 Process completed!'));