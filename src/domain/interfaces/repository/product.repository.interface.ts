import { Product } from "@/domain/entities";

export interface productRepositoryInterface {
  saveProduct(product: Product): Promise<Product>;
  getProducts(limit: number, skip: number, category?: string): Promise<Product[]>;
  editProduct(Product: Product): Promise<Product>;
  getSingleProduct(id: string): Promise<Product>;
  getUniqueProduct(name: string, brand: string, model: string): Promise<Product | null>;
  mapToProduct(productDb: unknown): Product;
}
