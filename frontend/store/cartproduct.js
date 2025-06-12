import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    initialState,
    name: 'cartItem',
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload]
        }
    }
})

export const { handleAddItemCart } = cartSlice.actions
export default cartSlice.reducer