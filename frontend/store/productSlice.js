import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allCategory: [],
    subCategory: [],
    products: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload]
        }
    }
})

export const { setAllCategory } = productSlice.actions

export default productSlice.reducer