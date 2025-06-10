import React from 'react'
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { FaFire, FaMotorcycle, } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"


const ProductContainer = ({ product }) => {

    const fetchUrl = (product) => {
        const url = `/product/${product.name}-${product._id}`.replaceAll(" ", "-")
        return url.replaceAll(",", "")
    }

    return (
        <Link
            className='h-fit m-0'
            key={product._id}
            to={fetchUrl(product)}>

            <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                whileHover={{ boxShadow: "0 10px 15px -3px rgba(147, 51, 234, 0.2)" }}
                className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden border border-purple-300 hover:border-purple-400 transition-all duration-200"
            >
                {/* Product Image - Uncropped */}
                <div className="relative h-40 w-full border-b border-purple-300 flex items-center justify-center bg-purple-50 ">
                    <img
                        src={product.images[0]}
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
                    <div className="flex items-center justify-between">
                        <div>
                            {product.discount > 0 ? (
                                <div className="flex items-baseline">
                                    <span className="font-bold text-black text-sm">
                                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="ml-1 text-xs text-gray-600 line-through">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-bold text-black text-sm">
                                    ₹{product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-[13px] px-3 py-1.5 rounded-lg flex items-center transition-colors"
                        >
                            <FiShoppingCart className="mr-1" size={12} />
                            Add
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default ProductContainer
