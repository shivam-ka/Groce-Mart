import { Router } from "express";
import { uploadCategory } from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post('/add-category', authUser, upload.single('image'), uploadCategory)

export default categoryRouter