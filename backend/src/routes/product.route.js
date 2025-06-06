import { Router } from "express"
import { addProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.post(
    '/add-product',
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
    ]),
    addProduct
)

export default productRouter