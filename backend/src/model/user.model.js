import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name "]
    },

    email: {
        type: String,
        required: [true, "Please Enter Email "],
        uniqe: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Please Enter Password "]
    },

    avatar: {
        type: String,
        default: "https://res.cloudinary.com/shivamka/image/upload/v1737995362/vkhojkj5rpgt2bjuko9g.png"
    },

    mobile: {
        type: Number,
        default: null
    },

    refreshToken: {
        type: String,
        default: ""
    },

    verify_email: {
        type: Boolean,
        default: false
    },

    last_login_date: {
        type: Date,
        default: ""
    },

    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },

    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "address"
        }
    ],

    shopin_Cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartProduct"
        }
    ],

    order_history: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "order"
        }
    ],

    forgot_password_otp: {
        type: String,
        default: null,
    },

    forgot_password_expiry: {
        type: Date,
        default: "",
    },

    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const userModel = mongoose.model("User", userSchema)

export default userModel