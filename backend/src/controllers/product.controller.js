import ProductModel from "../model/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";


const addProduct = async (req, res) => {
    try {
        const { name, category, subCategory, unit, unit_quantity, stock, price, discount, description, } = req.body;

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        if ([name, category[0], subCategory[0], unit, unit_quantity, stock, price, discount, description].some((field) => field === '')) {
            return res
                .status(400)
                .json(new ApiError(
                    500,
                    "All Field Are Required"
                ))
        }

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
            unit_quantity,
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

const getProduct = async (req, res) => {
    try {

        const search = req.body?.search;
        const page = req.query?.page || 1;
        const limit = req.query?.limit || 10;

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit;

        const [productData, totalProductCount] = await Promise.all([
            ProductModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments(query)

        ])

        return res.json(new ApiResponse(
            200,
            {
                totalProductCount,
                totalPages: Math.ceil(totalProductCount / limit),
                productData
            },
            "Product Fetched Successfully"
        ))

    } catch (error) {
        console.log("get all Product Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "get all Product Error"))
    }
}

const updateProduct = async (req, res) => {
    try {

        const { productId, name, category, subCategory, unit, unit_quantity, stock, price, discount, description, } = req.body;

        if (!productId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "invalid Credentials"
                ))
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res
                .status(404)
                .json(new ApiError(
                    404,
                    "Porduct not Found"
                ))
        }

        if ([name, category[0], subCategory[0], unit, unit_quantity, stock, price, discount, description].some((field) => field === '')) {
            return res
                .status(400)
                .json(new ApiError(
                    500,
                    "All Field Are Required"
                ))
        }

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const imagesArray = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (imagesArray[0]) {

            await Promise.all(
                product.images?.map(async (item) => {
                    const publicId = item.match(/\/upload\/(?:v\d+\/)?([^\.\/]+)(?=\.\w+$)/)[1]
                    await deleteOnCloudinary(publicId)
                })
            )

            let images = await Promise.all(
                imagesArray.map(async (item) => {
                    let result = await uploadOnCloudinary(item.path)
                    return result.secure_url
                })
            )

            const updatedProduct = await ProductModel.findByIdAndUpdate(
                product._id,
                {
                    $set: {
                        name,
                        images,
                        category,
                        subCategory,
                        unit,
                        unit_quantity,
                        stock,
                        price,
                        discount,
                        description,
                    }
                },
                {
                    new: true
                }
            )

            return res.jons(
                new ApiResponse(
                    200,
                    updatedProduct,
                    "Product Updated SuccessFully"
                )
            )
        } else {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                product._id,
                {
                    $set: {
                        name,
                        category,
                        subCategory,
                        unit,
                        unit_quantity,
                        stock,
                        price,
                        discount,
                        description,
                    }
                },
                {
                    new: true
                }
            )

            return res.jons(
                new ApiResponse(
                    200,
                    updatedProduct,
                    "Product Updated SuccessFully"
                )
            )
        }



    } catch (error) {
        console.log("Update Product Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Update Product Error"))
    }
}

const getProductByCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;

        if (!categoryId) {
            return res
                .status(400)
                .json(new ApiError(400, "Category Id Is Missing"))
        }

        const product = await ProductModel.find({
            category: { $in: categoryId }
        }).limit(15)

        return res.json(new ApiResponse(
            200,
            product,
            "Product by Category fetched Successfully"
        ))

    } catch (error) {
        console.log("get Product By Category Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "get Product By Category Error:"))
    }
}


export { addProduct, getProduct, updateProduct, getProductByCategory }