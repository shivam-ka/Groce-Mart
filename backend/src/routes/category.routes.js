import { Router } from "express";
import { addCategory } from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post('/add-category', authUser, upload.single('image'), addCategory)

export default categoryRouter