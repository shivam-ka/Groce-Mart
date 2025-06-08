import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allCategory: [],
    allSubCategory: [],
    products: [],
    isCategoryLoading: false
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
        },
        setIsCategoryLoading: (state, action) => {
            state.isCategoryLoading = action.payload
        }
    }
})

export const { setAllCategory, setAllSubCategory, setIsCategoryLoading } = productSlice.actions

export default productSlice.reducer