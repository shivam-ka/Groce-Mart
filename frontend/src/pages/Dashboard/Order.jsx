import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Link } from "react-router-dom"

const Order = () => {
    const order = useSelector(state => state.order.order)
    console.log(order)

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

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
            <div className="max-w-2xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-bold text-gray-900 mb-4 "
                >
                    Your Orders
                </motion.h1>

                {order.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <p className="text-gray-500">No orders found</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        {order.map(el => (
                            <motion.div
                                key={el._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-3 flex items-start">
                                    <Link to={productUrl(el.product_details.name, el.productId)} className="flex-shrink-0 mr-4">
                                        <img
                                            src={el.product_details.images[0]}
                                            alt={el.product_details.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {el.product_details.name}
                                        </h3>
                                        <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                            <div className="truncate">
                                                <p className="text-gray-500">Order ID</p>
                                                <p className="font-medium text-gray-900 truncate">{el.orderId}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Status</p>
                                                <p className={`font-medium ${el.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                                    }`}>
                                                    {el.payment_status}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500">Amount</p>
                                                <p className="font-medium text-gray-900">
                                                    ₹{el.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Order