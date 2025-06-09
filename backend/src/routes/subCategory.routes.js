import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { addSubCategory, getAllSubCategory, removeSubCategory, updateSubCategory } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post('/add-subcategory', authUser, upload.single('image'), addSubCategory)
subCategoryRouter.post('/get-allsubcategory', getAllSubCategory)
subCategoryRouter.put('/update-subcategory', authUser, upload.single('image'), updateSubCategory)
subCategoryRouter.delete('/remove-subcategory', authUser, removeSubCategory)

export default subCategoryRouter