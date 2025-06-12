import CartPorductModel from "../model/cartproduct.model.js"
import userModel from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const addToCart = async (req, res) => {
    try {

        const productId = req.params?.productId;
        const quantity = req.params?.quantity || 1;

        if (!productId) {
            return res
                .status(402)
                .json(new ApiError(
                    402,
                    "Provide ProductId"
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
                    shoping_Cart: cartItem._id
                }
            }
        )

        return res.json(new ApiResponse(
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

export { addToCart }