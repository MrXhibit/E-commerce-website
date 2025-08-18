import mongoose from "mongoose";
import ProductModel from "@/infrastructure/model/product.model";
import CategoryModel from "@/infrastructure/model/category.model";
import { env } from "@/infrastructure/config/environment";

// Custom products with images
const customProducts = [
  {
    name: "Gaming Laptop RTX 4080",
    description: "High-performance gaming laptop with RTX 4080 graphics card",
    price: "2499.99",
    brandName: "ASUS",
    modelName: "ROG Strix G18",
    stock: 15,
    categoryName: "Electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
        id: "gaming_laptop_1",
      },
      {
        url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
        id: "gaming_laptop_2",
      },
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        id: "gaming_laptop_3",
      },
    ],
  },
  {
    name: "Wireless Bluetooth Earbuds",
    description: "Premium wireless earbuds with active noise cancellation",
    price: "199.99",
    brandName: "Sony",
    modelName: "WF-1000XM4",
    stock: 80,
    categoryName: "Electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        id: "earbuds_1",
      },
      {
        url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
        id: "earbuds_2",
      },
    ],
  },
  {
    name: "Designer Leather Jacket",
    description: "Premium genuine leather jacket with modern styling",
    price: "299.99",
    brandName: "Hugo Boss",
    modelName: "Classic Leather",
    stock: 30,
    categoryName: "Clothing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        id: "leather_jacket_1",
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        id: "leather_jacket_2",
      },
    ],
  },
];

async function addCustomProducts() {
  try {
    // Connect to database
    await mongoose.connect(env.DB_URL!);
    console.log("Connected to database...");

    // Get all categories
    const categories = await CategoryModel.find({});
    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat.name, cat._id);
    });

    // Add products
    for (const productData of customProducts) {
      const categoryId = categoryMap.get(productData.categoryName);

      if (!categoryId) {
        console.log(`Category ${productData.categoryName} not found, skipping product ${productData.name}`);
        continue;
      }

      // Check if product already exists
      const existingProduct = await ProductModel.findOne({
        name: productData.name,
        brandName: productData.brandName,
        modelName: productData.modelName,
      });

      if (existingProduct) {
        console.log(`Product ${productData.name} already exists, skipping...`);
        continue;
      }

      // Create product
      const product = await ProductModel.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        brandName: productData.brandName,
        modelName: productData.modelName,
        stock: productData.stock,
        category: categoryId,
        images: productData.images,
        isListed: true,
      });

      console.log(`✅ Created product: ${product.name}`);
    }

    console.log("\n🎉 Custom products added successfully!");

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
}

// Run the function
addCustomProducts();
