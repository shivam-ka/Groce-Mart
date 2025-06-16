import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../Utils/Axios";
import summarApi from "../common/SummaryApi";
import { handleAddItemCart } from "../../store/cartproduct";
import { useDispatch, useSelector } from "react-redux";
import { errorToast } from "../Utils/ShowToast";
import { handleAddAddress } from "../../store/addressSlice";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {

    const cartItem = useSelector(state => state.cartItem.cart);
    const dispatch = useDispatch()

    const [cartTotalAmount, setCartTotalAmount] = useState(0)
    const [cartTotalAmountNoDis, setCartTotalAmountNoDis] = useState(0)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const getPriceAfterDiscount = (ogPrice, discount) => {
        const discountAmount = ogPrice * (discount / 100);
        const finalPrice = ogPrice - discountAmount;
        return finalPrice.toFixed(2);
    }

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

    const increaseQnty = async (e, cartItemDetails) => {
        e.stopPropagation();
        e.preventDefault()

        const qnty = cartItemDetails?.quantity + 1

        try {
            const response = await Axios({
                url: `${summarApi.cart.updateQty.url}/${cartItemDetails?._id}/${qnty}`,
                method: summarApi.cart.updateQty.method
            })
            console.log(response)
            if (response.data.success) {
                fetchCartItem()
            }
        } catch (error) {
            errorToast(error)
        }
    }

    const decreaseQnty = async (e, cartItemDetails) => {
        e.stopPropagation();
        e.preventDefault();

        const qnty = cartItemDetails?.quantity - 1

        try {
            if (qnty == 0) {
                const response = await Axios({
                    url: `${summarApi.cart.removeCartItem.url}/${cartItemDetails?._id}`,
                    method: summarApi.cart.removeCartItem.method
                })
                if (response.data.success) {
                    fetchCartItem()
                }
            } else {
                const response = await Axios({
                    url: `${summarApi.cart.updateQty.url}/${cartItemDetails?._id}/${qnty}`,
                    method: summarApi.cart.updateQty.method
                })

                if (response.data.success) {
                    fetchCartItem()
                }
            }

        } catch (error) {
            errorToast(error)
        }
    }

    const fetchAddress = async () => {
        try {

            const response = await Axios({
                ...summarApi.address.getAddress
            })

            if (response.data.success) {
                dispatch(handleAddAddress(response.data.data))
            }

        } catch (error) {
            errorToast(error)
        }
    }

    useEffect(() => {
        const toatlAmount = cartItem?.reduce((prev, item) => {
            const price = getPriceAfterDiscount(item?.productId?.price, item?.productId?.discount)

            return prev + (item.quantity * price)
        }, 0)

        setCartTotalAmount(toatlAmount);

        const totalAmountWithDis = cartItem?.reduce((prev, item) => {
            return prev + (item.quantity * item?.productId?.price)
        }, 0)
        setCartTotalAmountNoDis(totalAmountWithDis)

    }, [cartItem])

    useEffect(() => {
        fetchCartItem()
        fetchAddress()
    }, [])


    const value = {
        cartItem,
        fetchCartItem,
        increaseQnty,
        decreaseQnty,
        getPriceAfterDiscount,
        cartTotalAmount,
        cartTotalAmountNoDis,
        isCartOpen,
        setIsCartOpen,
        fetchAddress

    }

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider