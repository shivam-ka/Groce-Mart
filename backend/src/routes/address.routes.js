import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { addAddress, getAddress, updateAddress } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post('/add-address', authUser, addAddress)
addressRouter.get('/get-address', authUser, getAddress)
addressRouter.put('/update-address', authUser, updateAddress)

export default addressRouter