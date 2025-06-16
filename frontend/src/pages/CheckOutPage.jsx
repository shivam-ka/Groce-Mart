import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartItemList, AddressManagement, ButtonLoading } from "../components/index";



// Icons
import { FiCheckCircle, } from "react-icons/fi";
import { HiCash } from "react-icons/hi";
import { FaCreditCard } from "react-icons/fa";


const CheckOutPage = () => {

  const {
    cartItem,
    getPriceAfterDiscount,
    cartTotalAmount,
    cartTotalAmountNoDis,
    increaseQnty,
    decreaseQnty,
  } = useGlobalContext();


  const user = useSelector(state => state.user)
  const navigate = useNavigate()



  // Calculate charges
  const deliveryFee = 25
  const handlingCharge = 10
  const grossTotalBeforeDiscount = cartTotalAmountNoDis + deliveryFee + handlingCharge
  const savings = grossTotalBeforeDiscount - cartTotalAmount

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
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto px-2 py-4 md:px-4 md:py-8">
        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
          {/* Left Section - Checkout Steps */}
          <AddressManagement />

          {/* Right Section - Order Summary */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm px-1 py-4 md:p-6 sticky top-8">
              <h3 className="text-lg md:text-xl ml-2 md:ml-0 mb-4 md:mb-6 font-semibold text-gray-800 ">Order Summary</h3>

              {/* Items List */}
              <CartItemList
                items={cartItem}
                updatingItemId={updatingItemId}
                onDecreaseQuantity={handleDecreaseQnty}
                onIncreaseQuantity={handleIncreaseQnty}
                getPriceAfterDiscount={getPriceAfterDiscount}
              />

              {/* Bill Details */}
              <AnimatePresence>
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
                  <div className="space-y-3 pt-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">Subtotal</span>
                      <p className="text-sm sm:text-base">
                        <span className='mr-2 text-gray-600 line-through'>₹{cartTotalAmountNoDis.toFixed(2)}</span>
                        <span className="font-medium">₹{cartTotalAmount.toFixed(2)}</span>
                      </p>
                    </div>

                    {/* Delivery Fee */}
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">Delivery Fee</span>
                      <p className="text-sm sm:text-base">
                        <span className='mr-2 text-gray-600 line-through'>₹25</span>
                        <span className="font-medium">₹0</span>
                      </p>
                    </div>

                    {/* Handling Charge */}
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">Handling Charge</span>
                      <p className="text-sm sm:text-base">
                        <span className='mr-2 text-gray-600 line-through'>₹10</span>
                        <span className="font-medium">₹0</span>
                      </p>
                    </div>

                    {/* Total Savings */}
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm sm:text-base">Total Savings</span>
                      <span className="text-sm sm:text-base font-medium">₹{savings.toFixed(2)}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Total */}
                    <div className="flex justify-between font-medium">
                      <span className="text-base sm:text-lg font-bold text-gray-800">Total</span>
                      <p>
                        <span className='mr-2 text-gray-600 line-through'>₹{grossTotalBeforeDiscount.toFixed(2)}</span>
                        <span className="text-base sm:text-lg font-bold text-gray-800">₹{cartTotalAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>


                </motion.div>
              </AnimatePresence>

              {/* Place Order Button */}
              <div >
                <button className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 flex items-center justify-center shadow-md hover:shadow-lg">
                  <FaCreditCard className="mr-2" />
                  Pay Online
                </button>
                <button className="cursor-pointer w-full bg-white hover:bg-purple-100 text-purple-600 border font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-3 flex items-center justify-center shadow-md hover:shadow-lg">
                  <HiCash className="mr-2" />
                  Cash On Delivery
                </button>
              </div>


              {/* Security Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="text-green-500 mr-2 mt-0.5">
                    <FiCheckCircle />
                  </div>
                  <p className="text-xs text-gray-600">
                    Your personal data will be used to process your order and support your experience throughout this website.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>


    </div>
  );
};

export default CheckOutPage;