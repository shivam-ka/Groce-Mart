import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    images: {
        type: Array,
        default: [],
        required: true
    },

    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],

    subCategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory'
        }
    ],
    unit: {
        type: String,
        default: "",
        required: true
    },
    unit_quantity: {
        type: String,
        default: "",
        required: true
    },

    stock: {
        type: Number,
        default: null,
        required: true
    },

    price: {
        type: Number,
        default: null,
        required: true
    },

    discount: {
        type: Number,
        default: null
    },

    description: {
        type: String,
        default: ""
    },

    publish: {
        type: Boolean,
        default: true,
        required: true
    }


}, { timestamps: true })

// Created Index
productSchema.index(
    {
        name: "text",
        description: "text"
    },
    {
        name: 10,
        description: 5
    }
)

const ProductModel = mongoose.model("Product", productSchema)

export default ProductModel