import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosArrowBack } from "react-icons/io";

const Cart = ({ isOpen, onClose, }) => {

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 19.99, quantity: 2, image: '/product1.jpg' },
    // ... other cart items
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 bg-opacity-50"
            onClick={onClose}
          />

          {/* Cart panel */}
          <motion.div
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col border-l border-purple-600"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-1">
                <IoIosArrowBack onClick={onClose} className="text-purple-600 text-xl" />
                <h2 className="text-lg font-semibold">Your Cart</h2>

                {cartItems.length > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-xs ml-1 px-2 py-1 rounded-full">
                    {cartItems.length} items
                  </span>
                )}
              </div>
              <FaShoppingCart className="text-purple-600 text-xl" />

            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <FaShoppingCart className="text-4xl mb-4 opacity-30" />
                  <p className="text-lg">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Left section - Product image and info */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      {/* Right section - Actions and pricing */}
                      <div className="flex items-center space-x-4">
                        {/* Remove button */}
                        <button className="p-1 text-red-500 hover:text-red-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Pricing */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              ${(item.originalPrice * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  Checkout <FiChevronRight />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;