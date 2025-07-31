import {
  AuthorizeError,
  Category,
  categoryProperties,
  productProperties,
  ValidationError,
} from "@/domain/entities";
import { categoryRepositoryInterface } from "@/domain/interfaces/repository";
import { categoryServiceInterface } from "@/domain/interfaces/services";
import { cloudUtillsInterface } from "@/domain/interfaces/utills";
import { categoryUtillsInterface } from "@/domain/interfaces/utills/category.utills.interface";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utills/token.validation.utills.interface";

export class categoryService implements categoryServiceInterface {
  constructor(
    private categoryRepo: categoryRepositoryInterface,
    private cloudUtils: cloudUtillsInterface,
    private tokenUtils: tokenValidationUtillsInterface,
    private categoryUtils: categoryUtillsInterface,
  ) {}
  async getSingleCategory(id: string): Promise<Partial<categoryProperties>> {
    const category = await this.categoryRepo.getCategoryById(id);
    return category.sanitizeCategory();
  }
  async createCategory(file: any, body: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!file) throw new ValidationError("category image not found");
    const categoryProperties = this.categoryUtils.validateCreateCategoryRequest(body);
    const isExistCategory = await this.categoryRepo.getCategoryByName(categoryProperties.name);
    if (isExistCategory) throw new ValidationError("category name allredy exist");
    const image = await this.cloudUtils.uploadSingleFile(file);
    const category = new Category("", categoryProperties.name, image, categoryProperties.parentId);
    const savedCategory = await this.categoryRepo.createCategory(category);
    return savedCategory.sanitizeCategory();
  }

  async getCategory(limit: number, page: number): Promise<Partial<categoryProperties>[]> {
    const skip = (page - 1) * limit;
    const categorys = await this.categoryRepo.getCategory(limit, skip);
    return categorys.map((category) => category.sanitizeCategory());
  }
  async getSubCategory(id: string): Promise<Partial<categoryProperties>[]> {
    const subCategorys = await this.categoryRepo.getSubCategory(id);
    return subCategorys.map((subCategory) => subCategory.sanitizeCategory());
  }
  async editCategory(id: string, reqBody: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const category = await this.categoryRepo.getCategoryById(id);
    const categoryProperties = this.categoryUtils.validateEditCategoryRequest(reqBody);
    if (categoryProperties.name && category.name !== categoryProperties.name) {
      const isExistCategory = await this.categoryRepo.getCategoryByName(categoryProperties.name);
      if (isExistCategory) throw new ValidationError("name allredy exist");
      category.setName(categoryProperties.name);
      const updatedCategory = await this.categoryRepo.editCategory(category);
      return updatedCategory.sanitizeCategory();
    }
    throw new ValidationError("name is not valid or allredy exist");
  }
  async changeListStatus(
    id: string,
    isListed: boolean,
    adminToken: string,
  ): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const category = await this.categoryRepo.getCategoryById(id);
    category.setIsListed(isListed);
    const updatedCategory = await this.categoryRepo.editCategory(category);
    return updatedCategory.sanitizeCategory();
  }

  async editCategoryImage(id: string, file: any, adminToken: string): Promise<Partial<categoryProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!file) throw new ValidationError("image not found");
    const category = await this.categoryRepo.getCategoryById(id);
    const image = await this.cloudUtils.uploadSingleFile(file);
    await this.cloudUtils.deleteImage(category.image.id);
    category.setImage(image);
    const updatedCategory = await this.categoryRepo.editCategory(category);
    return updatedCategory.sanitizeCategory();
  }
}
