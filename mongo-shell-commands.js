// MongoDB Shell Commands to Add Products with Images
// Run these commands in MongoDB shell (mongosh)

// 1. Connect to your database
use your_database_name;

// 2. Get a category ID first
const category = db.categories.findOne({name: "Electronics"});
console.log("Category ID:", category._id);

// 3. Insert a single product with images
db.products.insertOne({
  name: "MacBook Air M3",
  description: "Latest MacBook Air with M3 chip, 13-inch display",
  price: "1299.99",
  brandName: "Apple",
  modelName: "MacBook Air M3",
  stock: 20,
  category: category._id,
  images: [
    {
      url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      id: "macbook_air_m3_1"
    },
    {
      url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      id: "macbook_air_m3_2"
    },
    {
      url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      id: "macbook_air_m3_3"
    }
  ],
  isListed: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 4. Insert multiple products at once
const clothingCategory = db.categories.findOne({name: "Clothing"});

db.products.insertMany([
  {
    name: "Premium Cotton T-Shirt",
    description: "Soft, comfortable cotton t-shirt in multiple colors",
    price: "29.99",
    brandName: "Premium Basics",
    modelName: "Cotton Classic",
    stock: 100,
    category: clothingCategory._id,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        id: "cotton_tshirt_1"
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
        id: "cotton_tshirt_2"
      }
    ],
    isListed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Designer Jeans",
    description: "Premium denim jeans with perfect fit",
    price: "89.99",
    brandName: "Denim Co",
    modelName: "Slim Fit",
    stock: 75,
    category: clothingCategory._id,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        id: "designer_jeans_1"
      },
      {
        url: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500",
        id: "designer_jeans_2"
      }
    ],
    isListed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 5. Verify the products were added
console.log("Total products:", db.products.countDocuments());
console.log("Products with images:", db.products.countDocuments({"images.0": {$exists: true}}));

// 6. Find products by category
console.log("Electronics products:", db.products.find({category: category._id}).count());