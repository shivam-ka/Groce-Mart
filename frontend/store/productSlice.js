import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allCategory: [],
    allSubCategory: [],
    products: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload]
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = [...action.payload]
        }
    }
})

export const { setAllCategory, setAllSubCategory } = productSlice.actions

export default productSlice.reducer