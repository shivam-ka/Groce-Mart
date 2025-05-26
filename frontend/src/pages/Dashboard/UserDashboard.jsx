import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiShoppingBag, FiStar, FiClock } from 'react-icons/fi';
import { useSelector } from "react-redux"

const UserDashboard = () => {
  const primaryColor = '#6945c5';
  const primaryLight = '#e2dcf8';

  const userData = useSelector((state) => state.user)

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(userData.name, userData.email);
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120
      }
    }
  };

  const handleEdit = () => {
    setTempData({ ...userData });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmiting(true);


    setTimeout(() => {
      setEditMode(false);
      setIsSubmiting(false);
      setSuccessMessage('Profile updated successfully!');
      const data = { name: tempData.name, phone: tempData.phone }

      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-9 px-3 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dashboard Header */}
          <div
            className="p-6 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex justify-between items-start">
              <div>
                <motion.h1
                  className="text-3xl font-bold flex items-center"
                  variants={itemVariants}
                >
                  <FiUser className="mr-3" /> My Account
                </motion.h1>
                <motion.p
                  className="mt-2 opacity-90"
                  variants={itemVariants}
                >
                  Manage your profile and shopping preferences
                </motion.p>
              </div>
              <motion.div
                className="flex items-center space-x-2"
                variants={itemVariants}
              >
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <FiShoppingBag size={20} color={primaryColor} />
                </div>
                <span className="font-medium">{userData.name.split(' ')[0]}</span>
              </motion.div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 px-4 md:p-8">
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  className="mb-6 p-4 rounded-lg flex items-center"
                  style={{ backgroundColor: primaryLight }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: primaryColor }}>
                    <FiSave className="text-white" />
                  </div>
                  <span style={{ color: primaryColor }}>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User Info Section */}
              <motion.div
                className="md:col-span-2"
                variants={containerVariants}
              >
                <motion.h3
                  className="text-xl font-semibold mb-6 flex items-center"
                  variants={itemVariants}
                >
                  <span className="w-2 h-6 rounded-full mr-3" style={{ backgroundColor: primaryColor }}></span>
                  Personal Information
                </motion.h3>

                {!editMode ? (
                  <motion.div variants={containerVariants}>
                    <motion.div className="mb-6" variants={itemVariants}>
                      <div className="text-gray-500 text-sm mb-1">Full Name</div>
                      <div className="text-lg font-medium">{userData.name}</div>
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                      <div className="text-gray-500 text-sm mb-1">Email Address</div>
                      <div className="text-lg font-medium">{userData.email}</div>
                    </motion.div>

                    <motion.div className="mb-8" variants={itemVariants}>
                      <div className="text-gray-500 text-sm mb-1">Phone Number</div>
                      <div className="text-lg font-medium">{userData.phone}</div>
                    </motion.div>

                    <motion.button
                      onClick={handleEdit}
                      className="flex items-center px-5 py-3 rounded-xl hover:shadow-lg transition-all"
                      style={{ backgroundColor: primaryColor, color: 'white' }}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(105, 69, 197, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiEdit2 className="mr-2" /> Edit Profile
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form onSubmit={handleSubmit} variants={containerVariants}>
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label className="block text-gray-500 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={tempData.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ borderColor: primaryLight }}
                        required
                      />
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                      <label className="block text-gray-500 text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={tempData.email}
                        className="w-full p-3 border bg-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ borderColor: primaryLight }}
                        required
                      />
                    </motion.div>

                    <motion.div className="mb-8" variants={itemVariants}>
                      <label className="block text-gray-500 text-sm mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={tempData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ borderColor: primaryLight }}
                        required
                      />
                    </motion.div>

                    <motion.div className="flex space-x-4" variants={itemVariants}>
                      <button
                        type="submit"
                        className="flex items-center px-5 py-3 rounded-xl hover:shadow-lg transition-all flex-1 justify-center"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                        disabled={isSubmiting}
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(105, 69, 197, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmiting ?
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                          : (
                            <>
                              <FiSave className="mr-2" /> Save Changes
                            </>
                          )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center px-5 py-3 rounded-xl border hover:bg-gray-50 transition-all flex-1 justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiX className="mr-2" /> Cancel
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>

              {/* Grocery Stats Section */}
              <motion.div
                className="space-y-6"
                variants={containerVariants}
              >
                <motion.div
                  className="p-6 rounded-xl border relative"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: primaryLight }}>
                      <FiStar className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Loyalty Points</div>
                      <div className="text-2xl font-bold" style={{ color: primaryColor }}>Coming Soon</div>
                    </div>
                  </div>
                  <button className="text-sm w-full py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition">
                    Redeem points
                  </button>
                  <span className='absolute top-[-4px] right-[-4px] text-white px-2.5 py-0.5 rounded-md bg-linear-to-br from-blue-600 to-purple-600' >Soon</span>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl border"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: primaryLight }}>
                      <FiClock className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Last Order</div>
                      <div className="text-xl font-medium">{userData.lastOrder}</div>
                    </div>
                  </div>
                  <button className="text-sm w-full py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition">
                    View order history
                  </button>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-r from-purple-200 to-indigo-200"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-medium mb-3">Weekly Special</h4>
                  <p className="text-sm text-gray-600 mb-4">Organic avocados 30% off for loyalty members</p>
                  <button
                    className="text-sm w-full py-2 rounded-lg text-white font-medium transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Shop Now
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;