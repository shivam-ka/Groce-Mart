import { Router } from "express";
import { addCategory, getAllCategory, removeCategory, updateCategory } from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post('/add-category', authUser, upload.single('image'), addCategory)
categoryRouter.get('/get-all-category', getAllCategory)
categoryRouter.put('/update-category', authUser, upload.single('image'), updateCategory)
categoryRouter.delete('/remove-category', authUser, removeCategory)

export default categoryRouter