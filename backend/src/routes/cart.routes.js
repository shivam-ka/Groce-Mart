import { Router } from "express";
import { addToCart, deleteCartItem, getCartItem, updateCartItemQuantity } from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const cartRouter = Router()


cartRouter.post('/add-to-cart/:productId/:quantity', authUser, addToCart)
cartRouter.get('/get-cart', authUser, getCartItem)
cartRouter.put('/update-qty/:cartProductId/:quantity', authUser, updateCartItemQuantity)
cartRouter.delete('/remove-cart-product/:cartPorductId',authUser, deleteCartItem)

export default cartRouter