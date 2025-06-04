import SubCategoryModel from "../model/subCategory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";



const addSubCategory = async (req, res) => {
    try {

        const { name, category } = req.body;
        const image = req.file;

        if (!name && !image && !category[0]) {
            return res
                .status(400)
                .json(new ApiError(400, "all field are required"))
        }

        const uploadedImage = await uploadOnCloudinary(image?.path);

        if (!uploadedImage.secure_url) {
            return res
                .status(500)
                .ApiError(500, "something went wrong while uploading image on server")
        }

        const addCategory = new SubCategoryModel({ name, image: uploadedImage.secure_url, category });
        const saveSubCategory = await addCategory.save();

        return res
            .status(201)
            .json(new ApiResponse(
                200,
                saveSubCategory,
                "Category Added Successfully"
            ))

    } catch (error) {
        console.log("Upload Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Upload Category Error"))
    }
}

export { addSubCategory }