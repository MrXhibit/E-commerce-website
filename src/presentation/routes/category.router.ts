import { authenticateAdmin } from "@/presentation/middleware/auth.middleware";
import { Router } from 'express';
import { uploadCategoryImage } from '@/presentation/controller/category/category.controller';
import { createCategory, updateCategory, listCategory } from '@/presentation/controller/category/category.controller';


const router = Router();

router.post("/upload-image/:id", authenticateAdmin, uploadCategoryImage);
router.post("/", authenticateAdmin, createCategory);
router.put("/:id", authenticateAdmin, updateCategory);
router.patch("/:id", authenticateAdmin, listCategory);