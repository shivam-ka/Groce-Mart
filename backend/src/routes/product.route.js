import { Router } from "express"
import { addProduct, getProduct, getProductByCategory, getProductByCategoryAndSubCategory, updateProduct } from "../controllers/product.controller.js";
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
productRouter.put(
    '/update-product',
    authUser,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
    ]),
    updateProduct
)

productRouter.post('/get-product', getProduct)
productRouter.get('/get-product-by-category/:categoryId', getProductByCategory)
productRouter.post('/get-product-by-cat-and-subcat', getProductByCategoryAndSubCategory)

export default productRouter