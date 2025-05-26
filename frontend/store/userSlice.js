import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email: "",
    mobile: "",
    veryify_email: "",
    status: "",
    status: "",
    address_details: [],
    shopping_cart: [],
    orderHistory: [],
    role: "",
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.mobile = action.payload?.mobile
            state.veryify_email = action.payload?.veryify_email
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role

        },
    }
})

export const { setUserDetails } = userSlice.actions

export default userSlice.reducer