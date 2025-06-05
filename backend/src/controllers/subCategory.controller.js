import SubCategoryModel from "../model/subCategory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";


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
                "SubCategory Added Successfully"
            ))

    } catch (error) {
        console.log("Upload Sub Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Upload Sub Category Error"))
    }
}

const getAllSubCategory = async (req, res) => {
    try {
        const allSubCategory = await SubCategoryModel.find()

        return res.json(
            new ApiResponse(
                200,
                allSubCategory,
                "All Sub Category Fetched Successfully"
            )
        )
    } catch (error) {
        console.log("get All SubCategory Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "get All SubCategory Error"))
    }
}

const updateSubCategory = async (req, res) => {
    try {

        const { _id, name, category } = req.body;
        const image = req.file;

        const subCategory = await SubCategoryModel.findById(_id)

        if (!subCategory) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "invalid Credentials"
                ))
        }

        if (image) {
            const publicId = subCategory.image.match(/\/upload\/(?:v\d+\/)?([^\.\/]+)(?=\.\w+$)/)[1]
            await deleteOnCloudinary(publicId)

            const uploadedImage = await uploadOnCloudinary(image.path)

            subCategory.name = name
            subCategory.category = category
            subCategory.image = uploadedImage.secure_url

            const updatedsubCategory = await subCategory.save({ validateBeforeSave: false })

            return res.json(new ApiResponse(
                200,
                updatedsubCategory,
                "Category Update Successfully"
            ))
        }

        subCategory.name = name
        subCategory.category = category

        const updatedsubCategory = await subCategory.save({ validateBeforeSave: false })

        return res.json(new ApiResponse(
            200,
            updatedsubCategory,
            "Category Update Successfully"
        ))


    } catch (error) {
        console.log("Update SubCategory Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Update SubCategory Error"))
    }
}

export { addSubCategory, getAllSubCategory, updateSubCategory }