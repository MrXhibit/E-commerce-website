import { productService } from "@/application/services";
import { productRepository } from "@/infrastructure/repository";
import { cloudUtills } from "@/infrastructure/utills/cloud.utils";
import { productUtills } from "@/infrastructure/utills/product.utils";
import { tokenUtils } from "@/infrastructure/utills/token.utils";
import { ResponseUtils } from "@/infrastructure/utills/response.utils";
import { Request, Response, NextFunction } from "express";

const productRepo = new productRepository();
const productServ = new productService(productRepo, productUtills, tokenUtils, cloudUtills);

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const product = await productServ.createProduct(req.files, req.body, token);
    return res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;
    const category = req.query.category as string;
    const products = await productServ.getProducts(limit, skip, category);
    return res.status(200).json(ResponseUtils.success(products, 'Products fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// Add new search endpoint
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query,
      category,
      brand,
      model,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      skip = 0
    } = req.query;

    const searchFilters = {
      query: query as string,
      category: category as string,
      brand: brand as string,
      model: model as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'rating',
      sortOrder: sortOrder as 'asc' | 'desc',
      limit: parseInt(limit as string),
      skip: parseInt(skip as string)
    };

    const result = await productServ.searchProducts(searchFilters);
    return res.status(200).json(ResponseUtils.success(result, 'Products searched successfully'));
  } catch (error) {
    next(error);
  }
};
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const product = await productServ.getSingleProduct(id);
    return res.status(200).json(ResponseUtils.success(product, 'Product fetched successfully'));
  } catch (error) {
    next(error);
  }
};
export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const image = req.body.image;
    const id = req.params.id;
    const product = await productServ.deletemage(id, image, token);
    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const id = req.params.id;
    const product = await productServ.editProduct(id, req.body, token);
    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const id = req.params.id;
    const product = await productServ.uploadImages(id, req.files, token);
    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
