import { Category, Product } from "@/domain/entities";
import CategoryModel from "../model/category.model";
import ProductModel from "../model/product.model";

export const seedData = async () => {
  try {
    // Comment out or remove all seeding logic
    console.log("Auto-seeding disabled. Use npm run generate-mock-data instead.");
    return;

    // Check if data already exists
    const existingCategories = await CategoryModel.find();
    const existingProducts = await ProductModel.find();

    if (existingCategories.length === 0) {
      console.log("Seeding categories...");

      // Create sample categories
      const categories = [
        {
          name: "Electronics",
          image: { url: "https://via.placeholder.com/300x200?text=Electronics", id: "electronics-img" },
        },
        {
          name: "Clothing",
          image: { url: "https://via.placeholder.com/300x200?text=Clothing", id: "clothing-img" },
        },
        {
          name: "Books",
          image: { url: "https://via.placeholder.com/300x200?text=Books", id: "books-img" },
        },
        {
          name: "Home & Garden",
          image: { url: "https://via.placeholder.com/300x200?text=Home+Garden", id: "home-img" },
        },
        {
          name: "Sports",
          image: { url: "https://via.placeholder.com/300x200?text=Sports", id: "sports-img" },
        },
      ];

      for (const categoryData of categories) {
        const category = new CategoryModel({
          name: categoryData.name,
          image: categoryData.image,
          isListed: true,
        });
        await category.save();
      }
      console.log("Categories seeded successfully!");
    }

    if (existingProducts.length === 0) {
      console.log("Seeding products...");

      // Get categories for product assignment
      // Get categories for product assignment
      const categories = await CategoryModel.find();
      const electronicsCategory = categories.find((cat) => cat.name === "Electronics"); // Keep as is
      const clothingCategory = categories.find((cat) => cat.name === "Fashion"); // Changed from "Clothing"
      const booksCategory = categories.find((cat) => cat.name === "Media"); // Changed from "Books"
      const homeCategory = categories.find((cat) => cat.name === "Home"); // Changed from "Home & Garden"
      const sportsCategory = categories.find((cat) => cat.name === "Sports"); // Keep as is
      const healthCategory = categories.find((cat) => cat.name === "Health"); // Add this new category

      // Create sample products
      const products = [
        {
          name: "iPhone 15 Pro",
          images: [
            { url: "https://via.placeholder.com/400x400?text=iPhone+15+Pro", id: "iphone-img-1" },
            { url: "https://via.placeholder.com/400x400?text=iPhone+15+Pro+Back", id: "iphone-img-2" },
          ],
          description: "Latest iPhone with advanced features and powerful performance.",
          price: "999.99",
          category: electronicsCategory?._id || "",
          brandName: "Apple",
          modelName: "iPhone 15 Pro",
          stock: 50,
          isListed: true,
        },
        {
          name: "Samsung Galaxy S24",
          images: [
            { url: "https://via.placeholder.com/400x400?text=Galaxy+S24", id: "samsung-img-1" },
            { url: "https://via.placeholder.com/400x400?text=Galaxy+S24+Back", id: "samsung-img-2" },
          ],
          description: "Premium Android smartphone with excellent camera and display.",
          price: "899.99",
          category: electronicsCategory?._id || "",
          brandName: "Samsung",
          modelName: "Galaxy S24",
          stock: 30,
          isListed: true,
        },
        {
          name: "MacBook Air M3",
          images: [{ url: "https://via.placeholder.com/400x400?text=MacBook+Air+M3", id: "macbook-img-1" }],
          description: "Lightweight laptop with M3 chip for exceptional performance.",
          price: "1299.99",
          category: electronicsCategory?._id || "",
          brandName: "Apple",
          modelName: "MacBook Air M3",
          stock: 25,
          isListed: true,
        },
        {
          name: "Nike Air Max 270",
          images: [{ url: "https://via.placeholder.com/400x400?text=Nike+Air+Max+270", id: "nike-img-1" }],
          description: "Comfortable running shoes with excellent cushioning.",
          price: "149.99",
          category: clothingCategory?._id || "",
          brandName: "Nike",
          modelName: "Air Max 270",
          stock: 100,
          isListed: true,
        },
        {
          name: "The Great Gatsby",
          images: [{ url: "https://via.placeholder.com/300x400?text=The+Great+Gatsby", id: "gatsby-img-1" }],
          description: "Classic American novel by F. Scott Fitzgerald.",
          price: "12.99",
          category: booksCategory?._id || "",
          brandName: "Scribner",
          modelName: "Classic Edition",
          stock: 200,
          isListed: true,
        },
        {
          name: "Wireless Headphones",
          images: [
            { url: "https://via.placeholder.com/400x400?text=Wireless+Headphones", id: "headphones-img-1" },
          ],
          description: "High-quality wireless headphones with noise cancellation.",
          price: "199.99",
          category: electronicsCategory?._id || "",
          brandName: "Sony",
          modelName: "WH-1000XM5",
          stock: 75,
          isListed: true,
        },
        {
          name: "Gaming Laptop",
          images: [{ url: "https://via.placeholder.com/400x400?text=Gaming+Laptop", id: "gaming-laptop-1" }],
          description: "High-performance gaming laptop with RTX graphics.",
          price: "1599.99",
          category: electronicsCategory?._id || "",
          brandName: "ASUS",
          modelName: "ROG Strix",
          stock: 15,
          isListed: true,
        },
        {
          name: "Coffee Maker",
          images: [{ url: "https://via.placeholder.com/400x400?text=Coffee+Maker", id: "coffee-maker-1" }],
          description: "Automatic drip coffee maker with programmable timer.",
          price: "89.99",
          category: homeCategory?._id || "",
          brandName: "Cuisinart",
          modelName: "DCC-3200",
          stock: 40,
          isListed: true,
        },
        {
          name: "Dining Table",
          images: [{ url: "https://via.placeholder.com/400x400?text=Dining+Table", id: "dining-table-1" }],
          description: "Modern wooden dining table for 6 people.",
          price: "599.99",
          category: homeCategory?._id || "",
          brandName: "West Elm",
          modelName: "Mid-Century",
          stock: 8,
          isListed: true,
        },
        {
          name: "Running Shoes",
          images: [{ url: "https://via.placeholder.com/400x400?text=Running+Shoes", id: "running-shoes-1" }],
          description: "Lightweight running shoes for daily training.",
          price: "129.99",
          category: sportsCategory?._id || "",
          brandName: "Adidas",
          modelName: "Ultraboost 22",
          stock: 60,
          isListed: true,
        },
        {
          name: "Yoga Mat",
          images: [{ url: "https://via.placeholder.com/400x400?text=Yoga+Mat", id: "yoga-mat-1" }],
          description: "Non-slip yoga mat for all types of yoga practice.",
          price: "39.99",
          category: sportsCategory?._id || "",
          brandName: "Manduka",
          modelName: "PRO",
          stock: 80,
          isListed: true,
        },
      ];

      for (const productData of products) {
        const product = new ProductModel({
          name: productData.name,
          images: productData.images,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          brandName: productData.brandName,
          modelName: productData.modelName,
          stock: productData.stock,
          isListed: productData.isListed,
        });
        await product.save();
      }
      console.log("Products seeded successfully!");
    }

    console.log("Data seeding completed!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
