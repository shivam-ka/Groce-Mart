import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartItemList, AddressManagement, ButtonLoading } from "../components/index";
import { loadStripe } from '@stripe/stripe-js';


// Icons
import { FiCheckCircle, FiShoppingBag, } from "react-icons/fi";
import { HiCash } from "react-icons/hi";
import { FaCreditCard } from "react-icons/fa";
import Axios from "../Utils/Axios";
import summarApi from "../common/SummaryApi";
import { errorToast, infoToast, successToast } from "../Utils/ShowToast";


const CheckOutPage = () => {

  const {
    cartItem,
    getPriceAfterDiscount,
    cartTotalAmount,
    cartTotalAmountNoDis,
    increaseQnty,
    decreaseQnty,
    selectedAddress,
  } = useGlobalContext();


  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [updatingItemId, setUpdatingItemId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStripeLoading, setIsStripeLoading] = useState(false)

  // Calculate charges
  const deliveryFee = 25
  const handlingCharge = 10
  const grossTotalBeforeDiscount = cartTotalAmountNoDis + deliveryFee + handlingCharge
  const savings = grossTotalBeforeDiscount - cartTotalAmount


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

  const handleCashOrder = async () => {

    if (!selectedAddress) {
      return infoToast('Select Address To Place Order')
    }

    setIsLoading(true)

    try {

      const response = await Axios({
        ...summarApi.order.cashOrder,
        data: {
          itemList: cartItem,
          grossTotal: grossTotalBeforeDiscount,
          cartTotalAmount: cartTotalAmount,
          deliveryAddressId: selectedAddress
        }
      })

      if (response.data.success) {
        successToast(response)
        navigate('/dashboard/orders')
      }

    } catch (error) {
      console.log(error)
      errorToast(error)
    }

    setIsLoading(false)
  }

  const handleStripePayment = async () => {

    return infoToast('online payment is not available')

    if (!selectedAddress) {
      return infoToast('Select Address To Place Order')
    }
    setIsStripeLoading(true)
    try {

      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...summarApi.order.stripePayment,
        data: {
          itemList: cartItem,
          grossTotal: grossTotalBeforeDiscount,
          cartTotalAmount: cartTotalAmountNoDis,
          deliveryAddressId: selectedAddress
        }
      })


      stripePromise.redirectToCheckout({ sessionId: response.data.id })

    } catch (error) {
      console.log(error)
      // errorToast(error)
    }

    setIsStripeLoading(false)
  }


  return (
    <>
      {cartItem[0]
        ?
        <div className="min-h-screen bg-gray-50">
          <main className="mx-auto px-2 py-4 md:px-4 md:py-8">
            <div className="flex flex-col lg:grid grid-cols-2 gap-4">
              {/* Left Section - Checkout Steps */}
              <AddressManagement data />

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
                      <div className="px-2 space-y-1.5 sm:space-y-3 pt-4">
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
                    <button
                      disabled={isStripeLoading}
                      onClick={() => handleStripePayment()}
                      className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 flex items-center justify-center shadow-md hover:shadow-lg">

                      {isStripeLoading ?
                        <>
                          <ButtonLoading />
                          Please wait...
                        </>
                        :
                        <>
                          <FaCreditCard className="mr-2" />
                          Pay Online
                        </>
                      }

                    </button>
                    <button
                      disabled={isLoading}
                      onClick={(e) => handleCashOrder()}
                      className="cursor-pointer w-full bg-white hover:bg-purple-100 text-purple-600 border font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-3 flex items-center justify-center shadow-md hover:shadow-lg">
                      {isLoading ?
                        <>
                          <ButtonLoading />
                          Please wait...
                        </>
                        :
                        <>

                          <HiCash className="mr-2" />
                          Cash On Delivery
                        </>
                      }

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


        </div> :
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
      }

    </>
  );
};

export default CheckOutPage;