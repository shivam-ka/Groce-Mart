import { Router } from "express";
import { addToCart, getCartItem } from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const cartRouter = Router()


cartRouter.post('/add-to-cart/:productId/:quantity', authUser, addToCart)
cartRouter.get('/get-cart', authUser, getCartItem)

export default cartRouter