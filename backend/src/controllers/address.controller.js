import AddressModel from "../model/address.model.js"
import userModel from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const addAddress = async (req, res) => {
    try {

        const { address_line, city, state, pincode, mobile } = req.body;

        if ([address_line, city, state, pincode, mobile].some(field => field.trim() === '')) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "All Field Are Required",
                ))
        }

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            mobile,
            userId: req.user?._id
        })

        const saveAddress = await createAddress.save()

        const addUserAddressId = await userModel.findByIdAndUpdate(req.user?._id, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                saveAddress
            ))

    } catch (error) {
        console.log("delete CartItem error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "delete CartItem Error"))
    }
}

export { addAddress }