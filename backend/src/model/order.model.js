import mongoose, { mongo } from "mongoose"

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true,
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'

    },

    product_details: {
        name: String,
        images: Array
    },

    paymentId: {
        type: String,
        default: ""
    },

    payment_status: {
        type: String,
        default: ""
    },

    address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },

    subTotal: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        default: 0
    },

    invoice_receipt: {
        type: String,
        default: ""
    }


}, { timestamps: true })


const OrderModel = mongoose.model("Order", orderSchema)

export default OrderModel