import { Router } from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const cartRouter = Router()


cartRouter.post('/add-to-cart/:productId/:quantity', authUser, addToCart)

export default cartRouter