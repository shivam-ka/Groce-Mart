import mongoose from "mongoose";
import OrderModel from "../model/order.model.js";
import userModel from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import CartPorductModel from "../model/cartproduct.model.js";
import Stripe from "../config/stripe.js";

const getPriceAfterDiscount = (ogPrice, discount) => {
    const discountAmount = ogPrice * (discount / 100);
    const finalPrice = ogPrice - discountAmount;
    return finalPrice.toFixed(2);
}

const cashPayment = async (req, res) => {

    try {

        const { itemList, grossTotal, cartTotalAmount, deliveryAddressId } = req.body;


        const payLoad = itemList.map(el => {
            return ({
                userId: req.user?._id,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    images: el.productId.images
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                address: deliveryAddressId,
                subTotal: grossTotal,
                totalAmount: cartTotalAmount,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payLoad);

        await CartPorductModel.deleteMany({ userId: req.user?._id })
        await userModel.updateOne({ _id: req.user?._id }, { shoping_Cart: [] })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                generatedOrder,
                "Order Placed"
            ))


    } catch (error) {
        console.log("cashPayment Error: ", error)
        return res
            .status(500)
            .json(new ApiError(500, error.message || "cashPayment Error"))
    }
}

const stripePayment = async (req, res) => {
    try {
        const { itemList, deliveryAddressId } = req.body;

        const line_items = itemList.map(el => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: el.productId.name,
                        images: el.productId.images,
                        metadata: {
                            productId: el.productId._id
                        }
                    },
                    unit_amount: getPriceAfterDiscount(el.productId.price, el.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: el.quantity
            }
        });

        // Create the session directly (no need to create params first)
        const session = await Stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: req.user?.email?.toString(),
            metadata: {
                userId: req.user?._id?.toString(),
                addressId: deliveryAddressId,
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            shipping_address_collection: {
                allowed_countries: ['IN']
            }
        });

        return res.status(200).json({ id: session.id });

    } catch (error) {
        console.log("stripePayment Error: ", error);
        return res.status(500).json(new ApiError(500, error.message || "stripePayment Error"));
    }
};

const getOrderProductItem = async (lineItems, userId, addressId, paymentId, payment_status) => {
    const productList = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)

            const payLoad = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    images: product.images
                },
                paymentId: paymentId,
                payment_status: payment_status,
                address: addressId,
                subTotal: Number(item.amount_total / 100),
                totalAmount: Number(item.amount_total / 100),
            }
            productList.push(payLoad)
        }
    }

    return productList
}

const webHookStripe = async (req, res) => {
    const event = req.body
    const endPointScesret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRECT

    switch (event.type) {
        case 'checkout.session.completed':

            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)

            const user_id = session.metadata.userId
            const orderProduct = await getOrderProductItem(
                lineItems,
                user_id,
                session.metadata.addressId,
                session.payment_intent,
                session.payment_status
            )

            const order = await OrderModel.insertMany(orderProduct)

            if (order[0]) {
                await userModel.findByIdAndUpdate(user_id, {
                    shoping_Cart: []
                })
                await CartPorductModel.deleteMany({ userId: user_id })
            }

            break;
        default: console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true })

}


export { cashPayment, stripePayment, webHookStripe }