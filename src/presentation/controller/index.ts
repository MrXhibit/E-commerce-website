export * from "./auth/auth.controller";
export * from "./auth/passport.controller";
export * from "./category/category.controller";
export {
  createProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProductImage,
  uploadProductImages,
  searchProducts, // Add this export
  deleteProduct,
} from "./product/product.controller";
export * from "./admin/admin.controller"
export * from "./cart/cart.controller";
export * from "./wishlist/wishlist.controller";
export * from "./admin/admin.controller";
