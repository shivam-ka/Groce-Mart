import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaShippingFast, FaShoppingCart } from 'react-icons/fa';
import { FiChevronRight, FiChevronsRight, FiMinus, FiPlus,} from 'react-icons/fi';
import { IoIosArrowBack } from "react-icons/io";
import { useGlobalContext } from '../provider/GlobalProvider';

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItem,
    getPriceAfterDiscount,
    cartTotalAmount,
    tAmountNoDis,
    increaseQnty,
    decreaseQnty,
  } = useGlobalContext();

  // Calculate charges
  const deliveryFee = 25
  const handlingCharge = 10
  const totalAmountNoDis = tAmountNoDis + deliveryFee + handlingCharge
  const toatlAmount = cartTotalAmount
  const savings = totalAmountNoDis - toatlAmount

  // State for bill details visibility
  const [showBillDetails, setShowBillDetails] = useState(false)
  const [updatingItemId, setUpdatingItemId] = useState(null)

  const handleIncreaseQnty = async (e, item) => {
    setUpdatingItemId(item._id);
    try {
      await increaseQnty(e, item);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecreaseQnty = async (e, item) => {
    setUpdatingItemId(item._id);
    try {
      await decreaseQnty(e, item);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

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
                <IoIosArrowBack
                  onClick={onClose}
                  className="text-purple-600 text-xl cursor-pointer"
                />
                <h2 className="text-lg font-semibold">Your Cart</h2>

                {cartItem.length > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-xs ml-1 px-2 py-1 rounded-full">
                    {cartItem.length} items
                  </span>
                )}
              </div>
              <FaShoppingCart className="text-purple-600 text-xl" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-scroll scrollbar-hide px-2 py-4 md:p-4 relative">
              {cartItem.length === 0 ? (
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
                  {/* Delivery time message */}
                  <div className="flex items-center gap-3 border bg-purple-50 text-purple-800 p-3 px-4 rounded-lg text-base mb-4">
                    <FaShippingFast className='text-xl' />
                    Get delivery by 11 Min
                  </div>

                  <motion.div
                    className="bg-green-50 border border-green-400 rounded-lg p-3 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { type: 'spring', stiffness: 300 }
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.p
                      className="text-green-700 font-medium"
                    >
                      You're saving ₹{savings.toFixed(2)}!
                    </motion.p>
                    <motion.div
                      className="w-full bg-green-100 h-2 rounded-full mt-2 overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{
                        width: '100%',
                        transition: { delay: 0.3, duration: 1 }
                      }}
                    >
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: '100%',
                          transition: { delay: 0.6, duration: 1.5 }
                        }}
                      />
                    </motion.div>
                  </motion.div>
                  <div className='bg-purple-50 py-2 px-1.5'>
                    {cartItem.map(item => (
                      <div
                        key={item._id}
                        className="flex gap-3 items-center pt-1.5 pb-2.5 px-2 pr-3 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
                      >
                        {updatingItemId === item._id && (
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-600 rounded-full"
                              initial={{ x: '-100%' }}
                              animate={{
                                x: ['-100%', '100%', '-100%'],
                                transition: {
                                  repeat: Infinity,
                                  duration: 3,
                                  ease: "easeInOut"
                                }
                              }}
                            />
                          </div>
                        )}

                        {/* Product image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="w-14 h-14 object-contain rounded-md "
                          />
                        </div>

                        {/* Product info and quantity controls */}
                        <div className="flex-grow">
                          <p className="font-medium text-sm text-gray-800 line-clamp-2">
                            {item.productId.name}
                          </p>

                          <div className="flex items-center mt-2">
                            <button
                              onClick={(e) => handleDecreaseQnty(e, item)}
                              className={`cursor-pointer w-6 h-6 flex items-center justify-center border border-purple-300 rounded-full transition-colors duration-200 active:scale-95 ${updatingItemId
                                ? 'bg-gray-100 text-gray-400'
                                : 'hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700'
                                }`}
                              disabled={!!updatingItemId}
                              aria-label="Decrease quantity"
                            >
                              <FiMinus className="text-sm" />
                            </button>
                            <span className="mx-1.5 text-base font-medium text-gray-800 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => handleIncreaseQnty(e, item)}
                              className={`cursor-pointer w-6 h-6 flex items-center justify-center border border-purple-300 rounded-full transition-colors duration-200 active:scale-95 ${updatingItemId
                                ? 'bg-gray-100 text-gray-400'
                                : 'hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700'
                                }`}
                              disabled={!!updatingItemId}
                              aria-label="Increase quantity"
                            >
                              <FiPlus className="text-sm" />
                            </button>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm sm:text-base font-semibold text-black">
                            ₹{(getPriceAfterDiscount(item.productId.price, item.productId.discount) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600 line-through">
                            ₹{(item.productId.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with bill summary */}
            {cartItem.length > 0 && (
              <div className="border-t p-3 sm:p-4 space-y-3">
                {/* Bill summary toggle */}
                <button
                  onClick={() => setShowBillDetails(!showBillDetails)}
                  className="cursor-pointer flex items-center justify-between w-full text-left text-sm font-medium text-purple-700 hover:text-purple-900"
                >
                  <span>View Bill Details</span>
                  {showBillDetails ? <FiChevronRight className='rotate-90 w-5 h-5' /> : <FiChevronRight className='w-5 h-5' />}
                </button>

                {/* Bill details panel */}
                <AnimatePresence>
                  {showBillDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3 },
                          opacity: { duration: 0.1 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <p>
                            <span className='mr-2 text-gray-600 line-through'>₹{tAmountNoDis.toFixed(2)}</span>
                            <span>₹{cartTotalAmount.toFixed(2)}</span>
                          </p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery Fee</span>
                          <p>
                            <span className='mr-2 text-gray-600 line-through'>₹25</span>
                            <span>₹0</span>
                          </p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Handling Charge</span>
                          <p>
                            <span className='mr-2 text-gray-600 line-through'>₹10</span>
                            <span>₹0</span>
                          </p>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Total Savings</span>
                          <span>₹{savings.toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total amount */}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <p>
                      <span className='mr-2 text-gray-600 line-through'>₹{totalAmountNoDis.toFixed(2)}</span>
                      <span>₹{toatlAmount.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  className="cursor-pointer w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mt-4"
                  disabled={!!updatingItemId}
                >
                  <>
                    Proceed to Checkout
                    <motion.div
                      animate={{
                        x: [0, 4, 0],
                        opacity: [0.8, 1, 0.8],
                        transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                      }}
                    >
                      <FiChevronsRight className="h-6 w-6" />
                    </motion.div>
                  </>
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