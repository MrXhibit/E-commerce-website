import { Router } from "express"
import { createCategory,getCategory,getSubCategory,listCategory,updateCategory  } from "@/presentation/controller/category/category.controller"
import { uploadCategory } from "@/presentation/middleware/multer.uploader" 

const categoryRouter = Router()
categoryRouter.post('/',uploadCategory,createCategory)
categoryRouter.put('/',updateCategory)
categoryRouter.patch('/:isList',listCategory)
categoryRouter.get('/',getCategory)
categoryRouter.get('/:id',getSubCategory)

export default categoryRouter