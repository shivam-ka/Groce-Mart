import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Link } from "react-router-dom"
import { FiShoppingBag } from "react-icons/fi";

const Order = () => {
    const orders = useSelector(state => state.order.order) // Changed from 'order' to 'orders' for clarity


    // Compact animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    }

    const productUrl = (productName, productId) => {
        const url = `/product/${productName}-${productId}`.replaceAll(" ", "-")
        return url.replaceAll(",", "")
    }

    // Calculate total items in an order
    const getTotalItems = (order) => {
        return order.product_details.reduce((total, product) => total + (product.quantity || 1), 0)
    }

    return (
        <>
            {orders && orders.length > 0 ? (
                <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
                    <div className="max-w-2xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xl font-bold text-gray-900 mb-4"
                        >
                            Your Orders
                        </motion.h1>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {orders.map(order => (
                                <motion.div
                                    key={order._id}
                                    variants={itemVariants}
                                    className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="p-4 border-b">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-500">Order ID</p>
                                                <p className="font-medium text-gray-900">{order.orderId}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {order.payment_status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Items</p>
                                                <p className="font-medium">{getTotalItems(order)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total</p>
                                                <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y">
                                        {order.product_details.map((product, index) => (
                                            <div key={index} className="p-3 flex items-start">
                                                <Link
                                                    to={productUrl(product.name, product.productId?._id || product.productId)}
                                                    className="flex-shrink-0 mr-4"
                                                >
                                                    <img
                                                        src={product.images?.[0] || product.productId?.images?.[0]}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {product.name || product.productId?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        ₹{product.price || product.productId?.price}
                                                    </p>
                                                    {product.quantity && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Qty: {product.quantity}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col h-[80vh] items-center justify-center gap-4 p-8 text-center bg-white rounded-xl shadow-sm"
                >
                    <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="p-4 bg-purple-50 rounded-full"
                    >
                        <FiShoppingBag className="w-12 h-12 text-purple-600" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-purple-900">
                        No Orders Found
                    </h3>

                    <p className="text-purple-700 max-w-md">
                        Your order history is empty. Start shopping to fill it with amazing products!
                    </p>

                    <Link to='/'>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer px-8 py-3 mt-4 text-white font-medium bg-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            Explore Products
                        </motion.button>
                    </Link>
                </motion.div>
            )}
        </>
    )
}

export default Order