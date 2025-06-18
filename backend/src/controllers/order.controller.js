import mongoose from "mongoose";
import OrderModel from "../model/order.model.js";
import userModel from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import CartPorductModel from "../model/cartproduct.model.js";

const cashPayment = async (req, res) => {

    try {

        const { itemList, grossTotal, cartTotalAmount, deliveryAddressId } = req.body;

        // return (
        //     console.log(itemList.map(item=> item.productId.images)[0])
        // )

        const payLoad = itemList.map(el => {
            return ({
                userId: req.user?._id,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    images: el.productId.images
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                address: deliveryAddressId,
                subTotal: grossTotal,
                totalAmount: cartTotalAmount,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payLoad);

        await CartPorductModel.deleteMany({ userId: req.user?._id })
        await userModel.updateOne({ _id: req.user?._id }, { shoping_Cart: [] })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                generatedOrder,
                "Order Placed"
            ))


    } catch (error) {
        console.log("cashPayment Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "cashPayment Error"))
    }
}

export { cashPayment }