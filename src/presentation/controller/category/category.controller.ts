import { Request,Response,NextFunction } from 'express'

export const createCategory = (req:Request,res:Response,next:NextFunction)=>{
    try {
      console.log(req.file);
      console.log(req.files);
      console.log(req.body);
       
    } catch (error) {
       next(error) 
    }
} 
export const updateCategory = (req:Request,res:Response,next:NextFunction)=>{} 
export const listCategory = (req:Request,res:Response,next:NextFunction)=>{} 
export const getCategory = (req:Request,res:Response,next:NextFunction)=>{} 
export const getSubCategory = (req:Request,res:Response,next:NextFunction)=>{} 
