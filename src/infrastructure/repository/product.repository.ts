import { APIError, Product, productProperties, ValidationError } from "@/domain/entities";
import { productRepositoryInterface } from "@/domain/interfaces/repository";
import ProductModel, { IProduct } from "../model/product.model";

export class productRepository implements productRepositoryInterface {
  async getUniqueProduct(name: string, brand: string, model: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findOne({
        name: name,
        brandName: brand,
        modelName: model,
      });
      if (!product) return null;
      return this.mapToProduct(product);
    } catch (error) {
      throw new APIError();
    }
  }
  async saveProduct(product: Product): Promise<Product> {
    try {
      const productDb = new ProductModel({
        name: product.name,
        images: product.images,
        description: product.description,
        price: product.price,
        category: product.category,
        brandName: product.brandName,
        modelName: product.modelName,
        stock: product.stock,
      });
      await productDb.save();
      return this.mapToProduct(productDb);
    } catch (error) {
      throw new APIError();
    }
  }
  async getProducts(limit: number, skip: number, category?: string): Promise<Product[]> {
    try {
      const query: any = { isListed: true };
      if (category) {
        query.category = category;
      }
      const products = await ProductModel.find(query).limit(limit).skip(skip);
      return products.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw new APIError();
    }
  }
  async editProduct(product: Product): Promise<Product> {
    try {
      const modifiedFields = product.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<productProperties, "id">, any> = {} as Record<
        keyof Omit<productProperties, "id">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<productProperties, "id">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = product[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await ProductModel.findByIdAndUpdate(product.id, updatedFields);
      product.clearModifiedFields;
      const updatedProduct = await this.getSingleProduct(product.id);
      return updatedProduct;
    } catch (error) {
      throw new APIError();
    }
  }
  async getSingleProduct(id: string): Promise<Product> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) throw new ValidationError("product id didnt exist");
      return this.mapToProduct(product);
    } catch (error) {
      throw new APIError();
    }
  }
  mapToProduct(productDb: IProduct): Product {
    const product = new Product(
      productDb.id,
      productDb.name,
      productDb.images,
      productDb.description,
      productDb.price,
      productDb.category.toString(),
      productDb.brandName,
      productDb.modelName,
      productDb.stock,
    );
    product.isListed = productDb.isListed;
    product.createdAt = productDb.createdAt;
    product.updatedAt = productDb.updatedAt;
    return product;
  }
}
