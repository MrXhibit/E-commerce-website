// Script to add products with images directly to MongoDB
import mongoose from "mongoose";
import ProductModel from "./src/infrastructure/model/product.model.js";
import CategoryModel from "./src/infrastructure/model/category.model.js";

// Database connection
const DB_URL = "your-mongodb-connection-string";

async function addProductWithImages() {
  try {
    // Connect to database
    await mongoose.connect(DB_URL);
    console.log("Connected to database...");

    // First, get a category ID (or create one)
    let category = await CategoryModel.findOne({ name: "Electronics" });
    if (!category) {
      category = await CategoryModel.create({
        name: "Electronics",
        image: {
          url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
          id: "electronics_category",
        },
        isListed: true,
      });
    }

    // Create product with images
    const productData = {
      name: "Samsung Galaxy S24",
      description: "Latest Samsung flagship smartphone with AI features",
      price: "899.99",
      brandName: "Samsung",
      modelName: "Galaxy S24",
      stock: 25,
      category: category._id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
          id: "samsung_s24_front",
        },
        {
          url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
          id: "samsung_s24_back",
        },
        {
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
          id: "samsung_s24_side",
        },
      ],
      isListed: true,
    };

    const product = await ProductModel.create(productData);
    console.log("Product created successfully:", product);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the function
addProductWithImages();
