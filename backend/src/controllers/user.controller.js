import { sendEmail } from "../config/sendEmail.js";
import userModel from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateOTP from "../utils/generateOtp.js";
import otpTemplate from "../utils/otpTemplate.js";
import { verifyEmailTemplate } from "../utils/verifyEmailTamplate.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new Error(
            "Something went wrong while generating referesh and access token",
            error
        );
    }
};

const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if ([email, name, password].some((field) => field?.trim() === "")) {
            return res.json(ApiError(400, "All fields are required"));
        }

        const existedUser = await userModel.findOne({ email });

        if (existedUser) {
            return res
                .status(409)
                .json(new ApiError(409, "User with email already exists"));
        }

        const user = await userModel.create({
            name,
            email,
            password,
        });

        const createdUser = await userModel
            .findById(user._id)
            .select("-password -refreshToken");

        if (!createdUser) {
            return res
                .status(500)
                .json(
                    new ApiError(500, "Something went wrong while registering the user")
                );
        }

        const verifyEmail = await sendEmail({
            name,
            sendTo: email,
            subject: "Verify Email | Groce Mart",
            html: verifyEmailTemplate({ name, url: "" }),
        });

        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered Successfully"));
    } catch (error) {
        console.log("Register User Error:", error);
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Register user Error"));
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiError(400, "Details Missing"));
        }

        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not Foud"));
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError(401, "Enter Correct Password"));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
            user._id
        );

        const loggedInUser = await userModel
            .findById(user._id)
            .select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "Loggin Successfully"
                )
            );
    } catch (error) {
        console.log("Login User Error: ", error);
        res.status(500).json(new ApiError(500, error.message || "Login Error "));
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(500).json(new ApiError(500, "invalid Credentials"));
        }

        user.verify_email = true;

        await user.save({ validateBeforeSave: false });

        return res.json(new ApiResponse(200, {}, "Email Verified Successfully"));
    } catch (error) {
        console.log("VerifyEmail Controller Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "Verify Email Error "));
    }
};

const logoutUser = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"));
    } catch (error) {
        console.log("Logout Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "Logout Error "));
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne(email)

        if (!user) {
            return res
                .status(404)
                .json(new ApiError(404, "Email does not exist"))
        }

        const otp = generateOTP();

        const expireTime = new Date() + 15 * 60 * 1000; // 15 Min

        await userModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: user.email,
            subject: "Forgot Password From Gro Mart",
            html: otpTemplate({ name: user.name, otp })
        })

        return res.json(new ApiResponse(
            200,
            {},
            "OTP Send Successfully"
        ))
    } catch (error) {
        console.log("forgot Password Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "forgot Password Error"));
    }
}

const verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;
        console.log(email, otp)
        const user = await userModel.findOne({ email })

        if (!user) {
            return res
                .status(404)
                .json(new ApiError(
                    404,
                    "invalid Credentials"
                ))
        }

        const currentTime = new Date().toISOString();

        if (user.forgot_password_expiry > currentTime) {
            return res
                .status(400)
                .json(new ApiError(400, "OTP is Expired"))
        }

        if (otp !== user.forgot_password_otp) {
            return res
                .status(400)
                .json(new ApiError(400, "Invailid Otp"))
        }

        await userModel.findByIdAndUpdate(user._id, {
            $unset: {
                forgot_password_expiry: 1,
                forgot_password_otp: 1
            }
        })

        return res.json(new ApiResponse(
            200,
            {},
            "OTP Veify Successfully"
        ))


    } catch (error) {
        console.log("Verif OTP Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "Verify OTP Error"));
    }
}

const resetPassword = async (req, res) => {
    try {

        const { email, newPassword } = req.body;

        const user = await userModel.findOne({email})

        if (!user) {
            return res
                .status(404)
                .json(new ApiError(
                    404,
                    "invalid Credentials"
                ))
        }

        if (!newPassword) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "Enter Password"
                ))
        }

        user.password = newPassword
        const newuser = await user.save();

        return res.json(new ApiResponse(
            200,
            newuser,
            "Password Reset Successfully"
        ))


    } catch (error) {
        console.log("Reset Password Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "Reset Password Error"));
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            return res
                .status(401)
                .json(new ApiError(
                    401,
                    "unauthorized request"
                ))
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET)

        const user = await userModel.findById(decodedToken?._id)

        if (!user) {
            return res
                .status(401)
                .json(new ApiError(
                    401,
                    "Invalid Refresh Token"
                ))
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res
                .status(401)
                .json(new ApiError(
                    401,
                    "Refresh token is expired or used"
                ))
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: refreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        console.log("Refresh Access Token Error: ", error);
        res
            .status(500)
            .json(new ApiError(500, error.message || "Refresh Access Token Error"));
    }
}

export { registerUser, loginUser, verifyEmail, logoutUser, forgotPassword, verifyOtp, resetPassword, refreshAccessToken };
