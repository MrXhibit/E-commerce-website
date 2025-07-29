import { productProperties } from "@/domain/entities";

export interface ProductServiceInterface{
    createProduct(files:any,reqBody:any):Promise<Partial<productProperties>>
    getProducts():Promise<Partial<productProperties>[]>
    editProduct(reqBody:any):Promise<Partial<productProperties>>
    uploadImages(files:any):Promise<Partial<productProperties>>                     
    deletemage(image:{id:string,url:string}):Promise<Partial<productProperties>>
    changeListStaus(id:string,isListed:boolean):Promise<Partial<productProperties>>
    getSingleProduct(id:string):Promise<Partial<productProperties>>

}