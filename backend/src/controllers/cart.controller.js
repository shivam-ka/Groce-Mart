import CartPorductModel from "../model/cartproduct.model.js"
import ProductModel from "../model/product.model.js"
import userModel from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const addToCart = async (req, res) => {
    try {

        const productId = req.params?.productId;
        const quantity = req.params?.quantity || 1;

        if (!productId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "Provide ProductId"
                ))
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "Iinvalid Credentials"
                ))
        }

        const productInCart = await CartPorductModel.findOne(
            {
                userId: req.user._id,
                productId
            }
        )

        if (productInCart) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "Product Already Exist in Cart"
                ))
        }

        const newCartItem = new CartPorductModel({
            quantity,
            productId,
            userId: req.user._id
        })

        const cartItem = await newCartItem.save();

        await userModel.updateOne(
            {
                _id: req.user._id
            },
            {
                $push: {
                    shoping_Cart: cartItem
                }
            }
        )

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                cartItem,
                "Item Added Successfully"
            ))

    } catch (error) {
        console.log("Add to Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Add To Error"))
    }
}

const getCartItem = async (req, res) => {
    try {

        const cartItem = await CartPorductModel
            .find({ userId: req.user._id })
            .populate({
                path: 'productId',
                model: 'Product'
            })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                cartItem,
                "Cart Fetched Successfully"
            ))

    } catch (error) {
        console.log("Get Cart Item Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Get Cart Item Error"))
    }
}

const updateCartItemQuantity = async (req, res) => {
    try {

        const cartProductId = req.params?.cartProductId
        const quantity = req.params?.quantity || 1

        if (!cartProductId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "Provide cartProductId"
                ))
        }

        const updateQuantity = await CartPorductModel.updateOne(
            {
                _id: cartProductId
            },
            {
                quantity
            }
        )

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Item Quantity Updated"
            ))

    } catch (error) {
        console.log("update CartItem Quantity Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "update CartItem Quantity Error"))
    }
}

const deleteCartItem = async (req, res) => {
    try {

        const cartPorductId = req.params?.cartPorductId

        if (!cartPorductId) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "Provide Cart Product ID"
                ))
        }

        await CartPorductModel.findByIdAndDelete(cartPorductId)

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Item Remove Successfully"
            ))

    } catch (error) {
        console.log("delete CartItem error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "delete CartItem Error"))
    }
}

export { addToCart, getCartItem, updateCartItemQuantity, deleteCartItem }