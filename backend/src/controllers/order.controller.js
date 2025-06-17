import OrderModel from "../model/order.model.js";
import userModel from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const cashPayment = (req, res) => {
    try {

        const { itemList, grossTotal, cartTotalAmount, deliveryAddressId, } = req.body;


    } catch (error) {
        console.log("cashPayment Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "cashPayment Error"))
    }
}

export { cashPayment }