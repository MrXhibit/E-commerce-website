// Test script for image upload functionality
import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";

async function testImageUpload() {
  try {
    console.log("🧪 Testing Image Upload...");

    // Create form data
    const formData = new FormData();

    // Add product data
    formData.append("name", "Test Product with Images");
    formData.append("description", "This is a test product created via API");
    formData.append("price", "99.99");
    formData.append("brandName", "Test Brand");
    formData.append("modelName", "Test Model");
    formData.append("stock", "10");
    formData.append("category", "6507f1f130c2f2ef4ecdbe22"); // Replace with actual category ID

    // For testing, you can use a sample image file
    // Make sure to have a test image in your project directory
    const imagePath = path.join(process.cwd(), "test-image.jpg");

    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      formData.append("images", imageBuffer, {
        filename: "test-image.jpg",
        contentType: "image/jpeg",
      });
      console.log("📸 Image file added to form data");
    } else {
      console.log("⚠️ No test image found, creating product without images");
    }

    // Send request to your API
    const response = await fetch("http://localhost:5000/api/v1/product", {
      method: "POST",
      body: formData,
      headers: {
        // Add admin authentication headers if needed
        Cookie: "access_token_admin=your-admin-token",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Product created successfully:");
      console.log("   - ID:", result.product.id);
      console.log("   - Name:", result.product.name);
      console.log("   - Images:", result.product.images?.length || 0);

      if (result.product.images && result.product.images.length > 0) {
        console.log("   - First Image URL:", result.product.images[0].url);
      }
    } else {
      const error = await response.text();
      console.error("❌ Error creating product:", error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Alternative: Test with direct MongoDB insertion
async function testDirectInsertion() {
  console.log("🧪 Testing Direct MongoDB Insertion...");

  // This would require importing your models and connecting to DB
  // See the add-custom-products.ts example above
}

// Run tests
console.log("🚀 Starting Image Upload Tests...\n");
testImageUpload();
