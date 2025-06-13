import { createContext, useContext, useEffect } from "react";
import Axios from "../Utils/Axios";
import summarApi from "../common/SummaryApi";
import { handleAddItemCart } from "../../store/cartproduct";
import { useDispatch } from "react-redux";
import { errorToast } from "../Utils/ShowToast";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {

    const dispatch = useDispatch()

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...summarApi.cart.getCartItem
            })
            if (response.data.success) {
                dispatch(handleAddItemCart(response.data.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateCartQty = async (cartProductId, qty) => {
        try {
            const respone = await Axios({
                url: `${summarApi.cart.updateQty}/${cartProductId}/${qty}`,
                method: summarApi.cart.updateQty.method
            })
            if (respone.data.success) {
                fetchCartItem()
            }
        } catch (error) {
            errorToast(error)
        }
    }

    useEffect(() => {
        fetchCartItem()
    }, [])


    const value = {
        fetchCartItem,
        updateCartQty
    }

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider