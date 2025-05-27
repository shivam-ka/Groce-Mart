import { Router } from "express";
import { uploadCategory } from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";

const categoryRouter = Router()

categoryRouter.post('/upload-category', upload.single('image'), uploadCategory)

export default categoryRouter