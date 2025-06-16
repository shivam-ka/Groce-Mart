import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { addAddress } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post('/add-address', authUser, addAddress)

export default addressRouter