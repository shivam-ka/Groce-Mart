import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { addAddress, getAddress } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post('/add-address', authUser, addAddress)
addressRouter.get('/get-address', authUser, getAddress)

export default addressRouter