import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./userSlice";
import productReduser from "./productSlice"
import cartReduser from './cartproduct'
import addressReduser from './addressSlice'
import orderReduser from './orderSlice'

export const sotre = configureStore({
    reducer: {
        user: userReduser,
        product: productReduser,
        cartItem: cartReduser,
        addresses: addressReduser,
        order: orderReduser
    },
})