import { Product } from "@/domain/entities"

export interface productRepositoryInterface{
    saveProduct(product:Product):Promise<Product>
    getProducts(limit:number,skip:number):Promise<Product[]>
    editProduct(Product:Product):Promise<Product>
    getSingleProduct(id:string):Promise<Product>
    mapToProduct(productDb:unknown):Product
}