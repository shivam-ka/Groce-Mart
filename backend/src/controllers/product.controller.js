import ProductModel from "../model/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";


const addProduct = async (req, res) => {
    try {
        const { name, category, subCategory, unit, stock, price, discount, description, } = req.body;

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const imagesArray = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (!imagesArray[0]) {
            return res
                .status(400)
                .json(new ApiError(400, "Product image Required"))
        }

        let images = await Promise.all(
            imagesArray.map(async (item) => {
                let result = await uploadOnCloudinary(item.path)
                return result.secure_url
            })
        )

        const product = new ProductModel({
            name,
            images,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
        })

        const saveProduct = await product.save()


        return res.json(new ApiResponse(
            200,
            saveProduct,
            "Product Addded Successfully"
        ))
    } catch (error) {
        console.log("add Product Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Add Product Error"))
    }
}

export { addProduct }