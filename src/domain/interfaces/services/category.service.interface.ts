import { categoryProperties, productProperties } from "@/domain/entities";

export interface categoryServiceInterface{
    createCategory(files:any,body:any):Promise<Partial<categoryProperties>>
    getCategory(limit:number,page:number):Promise<Partial<categoryProperties>[]>
    getSubCategory(id:string):Promise<Partial<categoryProperties>[]>
    editCategory(id:string):Promise<Partial<categoryProperties>>
    changeListStatus(id:string,isListed:boolean):Promise<Partial<productProperties>>
}