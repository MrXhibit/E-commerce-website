import { Router } from "express";
import {
  getProductById,
  editProduct,
  getProducts,
  createProduct,
  deleteProductImage,
  uploadProductImages,
  searchProducts, // Add this import
  deleteProduct,
} from "@/presentation/controller";
import { uploadProduct } from "@/presentation/middleware/multer.uploader";
import { authenticateAdmin } from "@/presentation/middleware/auth.middleware";

const productRouter = Router();

productRouter.post("/", authenticateAdmin, uploadProduct, createProduct);
productRouter.put("/upload-image/:id", authenticateAdmin, uploadProduct, uploadProductImages);
productRouter.put("/:id", authenticateAdmin, editProduct);
productRouter.get("/search", searchProducts); // Add search route before /:id
productRouter.get("/:id", getProductById);
productRouter.get("/", getProducts);
productRouter.delete("/delete-image/:id", authenticateAdmin, deleteProductImage);
productRouter.delete("/:id", authenticateAdmin, deleteProduct);

export default productRouter;
