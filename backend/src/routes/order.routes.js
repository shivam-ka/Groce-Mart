import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { cashPayment, getOrderDetais, stripePayment, webHookStripe } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post('/cash-payment', authUser, cashPayment)
orderRouter.post('/stripe-payment', authUser, stripePayment)
orderRouter.post('/webhook', webHookStripe)
orderRouter.get('/get-order-list', authUser, getOrderDetais)

export default orderRouter