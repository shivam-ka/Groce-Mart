import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post('/add-address', authUser, addAddress)
addressRouter.get('/get-address', authUser, getAddress)
addressRouter.put('/update-address', authUser, updateAddress)
addressRouter.delete('/delete/:addressId', authUser, deleteAddress)

export default addressRouter