import { Router } from "express"
import { addProduct, getProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";

const productRouter = Router();

productRouter.post(
    '/add-product',
    authUser,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
    ]),
    addProduct
)
productRouter.post('/get-product', authUser, getProduct)

export default productRouter