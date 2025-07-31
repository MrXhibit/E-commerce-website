export interface createProductRequest {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  model: string;
  stock: number;
}
export interface editProductReuest {
  name?: string;
  description?: string;
  price?: string;
  brand?: string;
  model?: string;
  stock?: number;
}
