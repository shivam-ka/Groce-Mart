import { Router } from "express";
import { loginUser, registerUser, verifyEmail } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)


export default userRouter