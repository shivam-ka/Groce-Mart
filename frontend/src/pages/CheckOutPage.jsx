import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHome, FiCreditCard, FiCheckCircle, FiMinus, FiPlus, FiTruck, FiDollarSign, FiX, FiEdit2 } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckOutPage = () => {
  const [activeTab, setActiveTab] = useState("address");
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedPayment, setSelectedPayment] = useState("online");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: "home",
      type: "home",
      name: "John Doe",
      street: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "(123) 456-7890",
      isDefault: true
    },
    {
      id: "work",
      type: "work",
      name: "John Doe",
      street: "456 Business Ave, Floor 12",
      city: "New York",
      state: "NY",
      zip: "10005",
      phone: "(123) 456-7890",
      isDefault: false
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: false
  });

  const {
    cartItem,
    getPriceAfterDiscount,
    cartTotalAmount,
    cartTotalAmountNoDis,
    increaseQnty,
    decreaseQnty,
  } = useGlobalContext();

  const navigate = useNavigate()
  const user = useSelector(state => state.user)

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

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setNewAddress({
      type: "home",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      isDefault: false
    });
  };

  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip || !newAddress.phone) {
      alert("Please fill all required fields");
      return;
    }

    const updatedAddresses = newAddress.isDefault
      ? addresses.map(addr => ({ ...addr, isDefault: false }))
      : [...addresses];

    const newAddr = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };

    setAddresses([...updatedAddresses, newAddr]);
    setSelectedAddress(newAddr.id);
    setShowAddressForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Checkout Steps */}
          <motion.div
            className="lg:w-2/3"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Checkout Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                  <span className="mr-2 font-medium">Checkout</span>
                  <span className="text-gray-300 mx-2">→</span>
                  <span className="bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {/* Address Section */}
              <motion.div
                className="mb-8"
                variants={itemVariants}
              >
                <div
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => setActiveTab(activeTab === "address" ? "" : "address")}
                >
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-medium">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Delivery Address</h3>
                  </div>
                  <FiChevronDown className={`transition-transform ${activeTab === "address" ? "transform rotate-180" : ""}`} />
                </div>

                {activeTab === "address" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="ml-11"
                  >
                    {showAddressForm ? (
                      <div className="bg-gray-50 p-6 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">Add New Address</h4>
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiX />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                            <select
                              name="type"
                              value={newAddress.type}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={newAddress.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                          <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={newAddress.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                            <input
                              type="text"
                              name="state"
                              value={newAddress.state}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                            <input
                              type="text"
                              name="zip"
                              value={newAddress.zip}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="text"
                            name="phone"
                            value={newAddress.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            required
                          />
                        </div>

                        <div className="flex items-center mb-6">
                          <input
                            type="checkbox"
                            id="defaultAddress"
                            name="isDefault"
                            checked={newAddress.isDefault}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                            Set as default address
                          </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveAddress}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Save Address
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map(address => (
                            <div
                              key={address.id}
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === address.id ? "border-purple-500 bg-purple-50 shadow-sm" : "border-gray-200 hover:border-purple-300"}`}
                              onClick={() => setSelectedAddress(address.id)}
                            >
                              <div className="flex items-start">
                                <div className={`p-2 rounded-full mr-3 ${selectedAddress === address.id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                                  <FiHome />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-gray-800 capitalize">{address.type}</h4>
                                      {address.isDefault && (
                                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Default</span>
                                      )}
                                    </div>
                                    <button
                                      className="text-gray-400 hover:text-purple-600 p-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewAddress(address);
                                        setShowAddressForm(true);
                                      }}
                                    >
                                      <FiEdit2 size={14} />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{address.name}</p>
                                  <p className="text-sm text-gray-600">{address.street}</p>
                                  <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                                  <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleAddAddress}
                          className="mt-4 text-purple-600 font-medium text-sm flex items-center hover:text-purple-800 transition-colors"
                        >
                          <FiPlus className="mr-1" /> Add New Address
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Payment Section */}
              <motion.div
                className="mb-8"
                variants={itemVariants}
              >
                <div
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => setActiveTab(activeTab === "payment" ? "" : "payment")}
                >
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-medium">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
                  </div>
                  <FiChevronDown className={`transition-transform ${activeTab === "payment" ? "transform rotate-180" : ""}`} />
                </div>

                {activeTab === "payment" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="ml-11"
                  >
                    <div className="space-y-4">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === "online" ? "border-purple-500 bg-purple-50 shadow-sm" : "border-gray-200 hover:border-purple-300"}`}
                        onClick={() => setSelectedPayment("online")}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${selectedPayment === "online" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                            <FiCreditCard />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">Online Payment</h4>
                            <p className="text-sm text-gray-600 mt-1">Pay securely with credit/debit card or UPI</p>
                          </div>
                          <div className="flex space-x-2">
                            <FaCcVisa className="text-blue-800 text-xl" />
                            <FaCcMastercard className="text-red-500 text-xl" />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === "cod" ? "border-purple-500 bg-purple-50 shadow-sm" : "border-gray-200 hover:border-purple-300"}`}
                        onClick={() => setSelectedPayment("cod")}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${selectedPayment === "cod" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                            <FiDollarSign />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                          </div>
                          <FiTruck className="text-gray-500 text-xl" />
                        </div>
                      </div>
                    </div>

                    {selectedPayment === "online" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 p-6 rounded-lg mt-6"
                      >
                        <h4 className="font-medium text-gray-800 mb-4">Enter Payment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Delivery Instructions */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="font-medium">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Delivery Instructions</h3>
                </div>
                <div className="ml-11">
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Any special instructions for delivery? (e.g., leave at front door, call before delivery, etc.)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all h-32"
                  ></textarea>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => setDeliveryInstructions("Leave at front door if I'm not home")}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                    >
                      Leave at front door
                    </button>
                    <button
                      onClick={() => setDeliveryInstructions("Call before delivery")}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                    >
                      Call before delivery
                    </button>
                    <button
                      onClick={() => setDeliveryInstructions("Deliver to security")}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                    >
                      Deliver to security
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Section - Order Summary */}
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>

              {/* Items List */}
              <div className='bg-gray-50 rounded-lg p-3'>
                {cartItem.map(item => (
                  <div
                    key={item._id}
                    className="flex gap-3 items-center pt-2 pb-3 px-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow relative mb-2"
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
                        className="w-14 h-14 object-contain rounded-md"
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

              {/* Bill Details */}
              <AnimatePresence>
                {(
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <p>
                          <span className='mr-2 text-gray-600 line-through'>₹{cartTotalAmountNoDis.toFixed(2)}</span>
                          <span className="font-medium">₹{cartTotalAmount.toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <p>
                          <span className='mr-2 text-gray-600 line-through'>₹25</span>
                          <span className="font-medium">₹0</span>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Handling Charge</span>
                        <p>
                          <span className='mr-2 text-gray-600 line-through'>₹10</span>
                          <span className="font-medium">₹0</span>
                        </p>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings</span>
                        <span className="font-medium">₹{savings.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>₹{cartTotalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Place Order Button */}
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 flex items-center justify-center shadow-md hover:shadow-lg">
                <FiCheckCircle className="mr-2" />
                {selectedPayment === "cod" ? "Place Order (Cash on Delivery)" : "Pay Now"}
              </button>

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