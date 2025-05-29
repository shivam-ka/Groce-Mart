import CategoryModel from "../model/category.model.js"
import ProductModel from "../model/product.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js"

const addCategory = async (req, res) => {
    try {

        const { name } = req.body;
        const image = req.file;

        if (!name || !image) {
            return res
                .status(400)
                .json(new ApiError(400, "name and image are required"))
        }

        const uploadedImage = await uploadOnCloudinary(image?.path);

        if (!uploadedImage.secure_url) {
            return res
                .status(500)
                .ApiError(500, "something went wrong while uploading image on server")
        }

        const addCategory = new CategoryModel({ name, image: uploadedImage.secure_url });
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

const getAllCategory = async (_, res) => {
    try {
        const category = await CategoryModel.find()

        return res.json(
            new ApiResponse(
                200,
                category,
                "All Category Fetched Successfully"
            )
        )

    } catch (error) {
        console.log("Get All Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Get All Category Error"))
    }
}

const updateCategory = async (req, res) => {
    try {

        const { categoryId, name } = req.body;
        const image = req.file;

        if (!categoryId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "invalid Credentials"
                ))
        }

        const category = await CategoryModel.findById(categoryId);

        if (image) {
            const publicId = category.image.match(/\/upload\/(?:v\d+\/)?([^\.\/]+)(?=\.\w+$)/)[1]
            await deleteOnCloudinary(publicId)

            const uploadedImage = await uploadOnCloudinary(image.path)

            category.name = name
            category.image = uploadedImage.secure_url

            const updatedCategory = await category.save({ validateBeforeSave: false })

            return res.json(new ApiResponse(
                200,
                updatedCategory,
                "Category Update Successfully"
            ))
        }

        category.name = name
        const updatedCategory = await category.save({ validateBeforeSave: false })

        return res.json(new ApiResponse(
            200,
            updatedCategory,
            "Category Update Successfully"
        ))


    } catch (error) {
        console.log("Update Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Update Category Error"))
    }
}

const removeCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "invalid Credentials"
                ))
        }

        // Checking category is available in subcategory or not
        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [{ _id: categoryId }]
            }
        }).countDocuments();

        // Checking category is available in product or not
        const checkProduct = await ProductModel.find({
            category: {
                "$in": [{ _id: categoryId }]
            }
        }).countDocuments();

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res
                .status(500)
                .json(new ApiError(500, "This category already in use you can't delete"))
        }

        const category = await CategoryModel.findById(categoryId)

        const publicId = category.image.match(/\/upload\/(?:v\d+\/)?([^\.\/]+)(?=\.\w+$)/)[1]
        await deleteOnCloudinary(publicId)

        await CategoryModel.findByIdAndDelete(category._id)

        return res.json(new ApiResponse(
            200,
            {},
            "Category Remove Successfully"
        ))

    } catch (error) {
        console.log("Update Remove Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Update Remove Error"))
    }
}

export { addCategory, getAllCategory, updateCategory, removeCategory }