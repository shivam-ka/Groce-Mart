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

    product_details: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        name: String,
        images: Array,
        price: String
    }],

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