import userModel from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new Error("Something went wrong while generating referesh and access token")
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (
            [email, name, password].some((field) => field?.trim() === "")
        ) {
            return res.json(ApiError(400, "All fields are required"))
        }

        const existedUser = await userModel.findOne({ email })

        if (existedUser) {
            return res
                .status(409)
                .json(new ApiError(409, "User with email already exists"))
        }

        const user = await userModel.create({
            name,
            email,
            password,
        })

        const createdUser = await userModel.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            return res
                .status(500)
                .json(new ApiError(500, "Something went wrong while registering the user"))
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )


    } catch (error) {
        console.log("Register User Error:", error)
        return res
            .status(500)
            .json(
                new ApiError(500, error.message || "Register user Error")
            )
    }
}

// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email) {
//         return res.status(400).json(new ApiError(400, "Enter Username Or E-mail"))
//     }

//     if (!password) {
//         return res
//             .status(400)
//             .json(new ApiError(400, "Enter Password"))
//     }

//     const user = await userModel.findOne({
//         email
//     })

//     if (!user) {
//         return res
//             .status(404)
//             .json(new ApiError(404, "User not Foud"))
//     }

//     const isPasswordCorrect = await user.isPasswordCorrect(password)

//     if (!isPasswordCorrect) {
//         return res
//             .status(401)
//             .json(new ApiError(401, "Enter Correct Password"))
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

//     const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     loggedInUser,
//                     accessToken,
//                     refreshToken
//                 },
//                 "Loggin Successfully"
//             )
//         )

// });

export { registerUser }