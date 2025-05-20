import { Router } from "express";
import { loginUser, logoutUser, registerUser, verifyEmail } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.get('/logout', authUser, logoutUser)


export default userRouter