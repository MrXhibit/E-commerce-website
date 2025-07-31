import { productProperties } from "@/domain/entities";

export interface ProductServiceInterface {
  createProduct(files: any, reqBody: any, adminToken: string): Promise<Partial<productProperties>>;
  getProducts(): Promise<Partial<productProperties>[]>;
  editProduct(id: string, reqBody: any, adminToken: string): Promise<Partial<productProperties>>;
  uploadImages(id: string, files: any, adminToken: string): Promise<Partial<productProperties>>;
  deletemage(
    id: string,
    image: { id: string; url: string },
    adminToken: string,
  ): Promise<Partial<productProperties>>;
  changeListStaus(id: string, isListed: boolean, adminToken: string): Promise<Partial<productProperties>>;
  getSingleProduct(id: string): Promise<Partial<productProperties>>;
}
