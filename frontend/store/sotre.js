import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./userSlice";

export const sotre = configureStore({
    reducer: {
        user: userReduser
    },
})