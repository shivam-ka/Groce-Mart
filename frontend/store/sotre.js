import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./userSlice";
import productReduser from "./productSlice"

export const sotre = configureStore({
    reducer: {
        user: userReduser,
        product: productReduser
    },
})