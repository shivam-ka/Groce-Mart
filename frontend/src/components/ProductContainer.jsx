import React, { useEffect, useState } from 'react'
import { FiShoppingCart, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import { FaFire, FaMotorcycle, } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import { warningToast, errorToast, successToast, infoToast } from '../Utils/ShowToast';
import Axios from '../Utils/Axios';
import summarApi from '../common/SummaryApi';
import ButtonLoading from './ButtonLoading';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';

const ProductContainer = ({ product }) => {

    const cartItem = useSelector(state => state.cartItem.cart);
    const { fetchCartItem, increaseQnty, decreaseQnty, getPriceAfterDiscount } = useGlobalContext()
    const user = useSelector(state => state.user)

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [isAvailableInCart, setIsAvailableInCart] = useState(false)
    const [cartItemDetails, setCartItemDetails] = useState({})

    const fetchUrl = (product) => {
        const url = `/product/${product.name}-${product._id}`.replaceAll(" ", "-")
        return url.replaceAll(",", "")
    }

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user?._id) {
            window.scrollTo(0, 0)
            navigate('/login')
            return infoToast('Please log in to add items to your cart.')
        }
        setIsLoading(true)

        try {
            const response = await Axios({
                url: `${summarApi.cart.addToCart.url}/${product._id}/1`,
                method: summarApi.cart.addToCart.method
            })
            if (response.data.success) {
                fetchCartItem()
            }
        } catch (error) {
            console.log(error)
            errorToast(error)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        const checkingItem = cartItem.some((item) => item.productId._id === product._id)
        setIsAvailableInCart(checkingItem)

        const pro = cartItem.find(item => item.productId._id === product._id)
        setCartItemDetails(pro)

    }, [product, cartItem])


    return (
        <Link
            onClick={() => window.scrollTo(0, 0)}
            className='h-fit m-0 block'
            key={product._id}
            to={fetchUrl(product)}
        >
            <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                whileHover={{ boxShadow: "0 10px 15px -3px rgba(147, 51, 234, 0.2)" }}
                className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden border border-purple-300 hover:border-purple-400 transition-all duration-200"
            >
                {/* Product Image - Uncropped */}
                <div className="relative h-40 w-full border-b border-purple-300 flex items-center justify-center bg-purple-50">
                    <img
                        src={product?.images[0]}
                        alt={product.name}
                        className="h-full object-contain p-0.5"
                        style={{ maxWidth: "100%" }}
                    />
                    {product.discount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center"
                        >
                            <FaFire className="mr-1" size={10} />
                            {product.discount}% OFF
                        </motion.div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                    <h3 className="font-medium text-sm text-black mb-1 line-clamp-2 h-10">
                        {product.name}
                    </h3>
                    <p className="text-gray-900 text-xs mb-1">
                        {product.unit_quantity} {product.unit}
                    </p>

                    {/* Delivery Time */}
                    <div className="w-fit py-0.5 px-2 rounded-2xl flex items-center text-xs text-purple-600 border mb-2">
                        <FaMotorcycle className="mr-1" size={12} />
                        <span>Get in 11 min</span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex flex-col gap-2">
                        <div>
                            {product.discount > 0 ? (
                                <div className="flex items-baseline gap-1">
                                    <span className="font-bold text-black text-sm">
                                        ₹{getPriceAfterDiscount(product.price, product.discount)}
                                    </span>
                                    <span className="text-xs text-gray-600 line-through">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-bold text-black text-sm">
                                    ₹{product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {isAvailableInCart ? (
                            <div className="flex items-center justify-between rounded-xl border border-purple-700">
                                <motion.button
                                    onClick={(e) => decreaseQnty(e, cartItemDetails)}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer border rounded-l-xl w-8 h-8 flex items-center justify-center bg-purple-600  shadow-sm text-white hover:bg-purple-700 transition-colors"
                                >
                                    <FiMinus size={14} />
                                </motion.button>

                                <span className="text-sm sm:text-base font-medium text-gray-800 min-w-[24px] text-center">
                                    {cartItemDetails?.quantity}
                                </span>

                                <motion.button
                                    onClick={(e) => increaseQnty(e, cartItemDetails)}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer border rounded-r-xl w-8 h-8 flex items-center justify-center bg-purple-600  shadow-sm text-white hover:bg-purple-700 transition-colors"
                                >
                                    <FiPlus size={14} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                onClick={handleAddToCart}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <ButtonLoading /> Adding...
                                    </>
                                ) : (
                                    <>
                                        <FiShoppingCart size={14} />
                                        Add to Cart
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default ProductContainer