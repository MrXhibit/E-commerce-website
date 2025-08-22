import { Product } from "@/domain/entities";
import { ProductSearchFilters, ProductSearchResult } from "@/domain/types/product.request.type";

export interface productRepositoryInterface {
  saveProduct(product: Product): Promise<Product>;
  getProducts(limit: number, skip: number, category?: string): Promise<Product[]>;
  searchProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
    limit?: number,
    skip?: number,
    sortBy?: string,
    sortOrder?: string,
    inStock?: boolean
  ): Promise<Product[]>;
  countProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    brand?: string,
    model?: string,
    inStock?: boolean
  ): Promise<number>;
  editProduct(Product: Product): Promise<Product>;
  getSingleProduct(id: string): Promise<Product>;
  getUniqueProduct(name: string, brand: string, model: string): Promise<Product | null>;
  deleteProduct(id: string): Promise<void>;
  mapToProduct(productDb: unknown): Product;
}
