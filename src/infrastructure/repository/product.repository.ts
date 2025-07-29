import { Product } from "@/domain/entities";
import { productRepositoryInterface } from "@/domain/interfaces/repository";

export class productRepository implements productRepositoryInterface{
    saveProduct(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    getProducts(limit: number, skip: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    editProduct(Product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    getSingleProduct(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    mapToProduct(productDb: unknown): Product {
        throw new Error("Method not implemented.");
    }
    
}