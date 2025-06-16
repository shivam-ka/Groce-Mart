import mongoose from "mongoose"
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
        console.log("add Address error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Add Address Error"))
    }
}

const getAddress = async (req, res) => {
    try {

        const address = await AddressModel.find({ userId: req.user?._id })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                address,
                "Address Fetched Successfully"
            ))

    } catch (error) {
        console.log("Get Address error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Get Address Error"))
    }
}

const updateAddress = async (req, res) => {
    try {
        const { addressId, address_line, city, state, pincode, mobile } = req.body;

        if ([addressId, address_line, city, state, pincode, mobile].some(field =>
            (field?.toString()?.trim() ?? '') === ''
        )) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "All fields are required",
                ))
        }

        const updateAddress = await AddressModel.findByIdAndUpdate(
            addressId,
            {
                $set: {
                    address_line,
                    city,
                    state,
                    pincode,
                    mobile
                }
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updateAddress,
                "Address Update Successfully"
            ))

    } catch (error) {
        console.log("update Address error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "update Address Error"))
    }
}

const deleteAddress = async (req, res) => {
    try {

        const addressId = req.params?.addressId

        await AddressModel.findByIdAndDelete(addressId)

        await userModel.findByIdAndUpdate(
            req.user?._id,
            {
                $pull: {
                    address_details: new mongoose.Types.ObjectId(addressId)
                }
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Address Delete Successfully"
            ))

    } catch (error) {
        console.log("delete Address error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "delete Address Error"))
    }
}

export { addAddress, getAddress, updateAddress, deleteAddress }