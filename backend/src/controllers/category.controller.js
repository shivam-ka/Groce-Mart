import CategoryModel from "../model/category.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js"

const uploadCategory = async (req, res) => {
    try {

        const { name } = req.body
        const image = req.file

        console.log(image.path)

        if (!name || !image) {
            return res
                .status(400)
                .json(new ApiError(400, "name and image are required"))
        }

        const uploadedImage = await uploadOnCloudinary(image?.path)

        if (!uploadedImage.secure_url) {
            return res
                .status(500)
                .ApiError(500, "something went wrong while uploading image on server")
        }

        const addCategory = new CategoryModel({ name, image: uploadedImage.secure_url })

        const saveCategory = await addCategory.save();


        return res
            .status(201)
            .json(new ApiResponse(
                200,
                saveCategory,
                "Category Added Successfully"
            ))


    } catch (error) {
        console.log("Upload Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Upload Category Error"))
    }
}

export { uploadCategory }