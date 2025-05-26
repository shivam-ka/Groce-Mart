import { Router } from "express";
import { forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, updateProfile, verifyEmail, verifyOtp } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.get('/logout', authUser, logoutUser)
userRouter.put('/forgot-password', forgotPassword)
userRouter.put('/verify-otp', verifyOtp)
userRouter.put('/reset-password', resetPassword)
userRouter.get('/get-current-user', authUser, getCurrentUser)
userRouter.post('/refresh-access-token', refreshAccessToken)
userRouter.post('/update-profile', authUser, updateProfile)


export default userRouter