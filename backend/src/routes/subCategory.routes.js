import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { addSubCategory, getAllSubCategory } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post('/add-subcategory', authUser, upload.single('image'), addSubCategory)
subCategoryRouter.post('/get-allsubcategory', authUser, getAllSubCategory)

export default subCategoryRouter