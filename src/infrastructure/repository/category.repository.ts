import { Category } from "@/domain/entities";
import { categoryRepositoryInterface } from "@/domain/interfaces/repository";
import CategoryModel, { Icategory } from "../model/category.model";

export class categoryRepository implements categoryRepositoryInterface{
   async createCategory(category: Category): Promise<Category> {
        try {
         const dbCategory =  new CategoryModel(
            {
                name : category.name,
                image : category.image,
                
            }
         )   
        } catch (error) {
            
        }
        throw new Error("Method not implemented.")
    }
    getCategory(limit: number, page: number): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    getSubCategory(id: string): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    editCategory(category: Category): Promise<Category> {
        throw new Error("Method not implemented.");
    }
    mapToCategory(categoryDb: Icategory): Category {
        throw new Error("Method not implemented.");
    }

}