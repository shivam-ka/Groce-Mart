import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { cashPayment } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post('/cash-payment', authUser, cashPayment)

export default orderRouter