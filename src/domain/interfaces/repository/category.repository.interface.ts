import { Category } from "@/domain/entities"

export interface categoryRepositoryInterface{
    createCategory(category:Category):Promise<Category>
    getCategory(limit:number,page:number):Promise<Category[]>
    getSubCategory(id:string):Promise<Category[]>
    editCategory(category:Category):Promise<Category>
    mapToCategory(categoryDb:unknown):Category
}