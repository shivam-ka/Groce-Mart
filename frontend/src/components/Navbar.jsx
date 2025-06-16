import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { asstes } from '../assets/assets';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Axios from '../Utils/Axios';
import summarApi from '../common/SummaryApi';

// Icons
import { FiSearch, FiUser, FiLogIn, FiLogOut, FiChevronsRight } from 'react-icons/fi';
import { FaUser, FaMapMarkerAlt, FaClipboardList, FaSignOutAlt, FaShoppingCart, FaLayerGroup, FaBox, FaUpload } from 'react-icons/fa';
import { BiSolidCategory } from "react-icons/bi";
import { Cart } from '../components/index';

const Nav = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [cartQuantity, setCartQuantity] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const user = useSelector(state => state.user);
  const cartItem = useSelector(state => state.cartItem.cart);
  const location = useLocation();
  const query = location.search.split('=').slice(-1).toLocaleString().replaceAll('+', ' ')

  const handleSearchInput = async (e) => {
    setSearchQuery(e.target.value)
  }

  const handleNavigateSearch = async () => {
    const query = searchQuery.replaceAll(' ', '+')
    if (query) {
      navigate(`/search?query=${query}`)
    }
  }

  const handleLogout = async (navigateTo) => {
    try {
      setIsProfileMenuOpen(false);
      const response = await Axios({
        ...summarApi.logOut
      });

      if (response.data.success) {
        window.location.href = navigateTo;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const profileMenuHandler = (navigateTo) => {
    setIsProfileMenuOpen(false);
    navigate(navigateTo);
  };

  useEffect(() => {
    const qty = cartItem.reduce((prev, item) => {
      return prev + item.quantity
    }, 0)
    setCartQuantity(qty)
  }, [cartItem])

  useEffect(() => {
    setSearchQuery(query)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.querySelector('body').style.overflowY = 'hidden'
    } else {
      document.querySelector('body').style.overflowY = 'scroll'
    }
  }, [isCartOpen])


  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b border-purple-400">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to='/' className='flex items-center gap-3'>
            <img className='w-12 h-12' src={asstes.logo} alt="Groce Mart Logo" />
            <div className="flex items-center">
              <h1 className='hidden lg:block text-2xl font-bold text-gray-900'>Groce Mart</h1>
              {user.role === "ADMIN" && (
                <span className="hidden sm:block ml-2 px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  ADMIN
                </span>
              )}
            </div>
          </Link>


          {/* Search Bar - Responsive sizing */}
          <div className="flex-1 mx-2 sm:mx-6 lg:max-w-2xl">
            <div className="relative w-full">
              <div className="flex items-center">
                <input
                  onClick={() => location.pathname !== '/search' && navigate('/search')}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e)}
                  title="Search for Products"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 md:py-3 pl-5 pr-12 text-sm md:text-base text-black placeholder-gray-700 bg-gray-50 rounded-lg border-2 border-gray-600 focus:border-purple-600 outline-none"
                />
                <button
                  onClick={() => handleNavigateSearch()}
                  title="Search"
                  className="cursor-pointer absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop - Right side bottom */}
          <AnimatePresence>
            {windowWidth >= 640 && location.pathname != '/checkout' && cartQuantity > 0 && (
              <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key="desktop-cart"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 text-white font-medium py-3 px-6 rounded-full shadow-lg ${cartQuantity > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  onClick={() => setIsCartOpen(true)}
                >
                  <motion.div
                    animate={cartQuantity > 0 ? {
                      rotate: [-5, 5, -5],
                      transition: { repeat: Infinity, duration: 2 }
                    } : {}}
                  >
                    <FaShoppingCart className="h-4 w-4" />
                  </motion.div>
                  <span className="font-semibold text-sm">View Cart</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 bg-white text-purple-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartQuantity}
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile - Center bottom */}
          <AnimatePresence>
            {windowWidth < 640 && location.pathname != '/checkout' && cartQuantity > 0 && (
              <motion.div
                className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key="mobile-cart"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 text-white font-medium py-3 px-6 rounded-full shadow-lg ${cartQuantity > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  onClick={() => setIsCartOpen(true)}
                >
                  <motion.div
                    animate={cartQuantity > 0 ? {
                      rotate: [-5, 5, -5],
                      transition: { repeat: Infinity, duration: 2 }
                    } : {}}
                  >
                    <FaShoppingCart className="h-5 w-5" />
                  </motion.div>
                  <span className="font-semibold text-sm">View Cart</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 bg-white text-purple-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartQuantity}
                  </motion.span>
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                      opacity: [0.8, 1, 0.8],
                      transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                    }}
                    className="ml-2"
                  >
                    <FiChevronsRight className="h-6 w-6" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {isCartOpen &&
            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          }

          {/* Enhanced Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="cursor-pointer flex items-center justify-center p-1 rounded-full focus:outline-none transition-all"
              aria-label="User menu"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white transition-all ${isProfileMenuOpen ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                <FiUser className="h-5 w-5" />
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-1 z-50 border border-gray-600 font-semibold"
                >
                  {user._id ?
                    (user.role === "ADMIN" ?
                      <>
                        <li onClick={() => profileMenuHandler('/dashboard/category')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <BiSolidCategory className='mr-3' />
                          <p className='tracking-wide' >Category</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/dashboard/sub-category')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaLayerGroup className='mr-3' />
                          <p className='tracking-wide' >Sub category</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/dashboard/upload-product')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaUpload className='mr-3' />
                          <p className='tracking-wide' >Upload Product</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/dashboard/product')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaBox className='mr-3' />
                          <p className='tracking-wide' >Product</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/dashboard/orders')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaClipboardList className='mr-3' />
                          <p className='tracking-wide' >My Orders</p>
                        </li>

                        <hr className='mx-1.5 my-1 text-gray-500' />

                        <li onClick={() => handleLogout('/login')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaSignOutAlt className='mr-3' />
                          <p className='tracking-wide' >Logout</p>
                        </li>
                      </>
                      :
                      <>
                        <li onClick={() => profileMenuHandler('/dashboard')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaUser className='mr-3' />
                          <p className='tracking-wide' >My Profile</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/register')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaMapMarkerAlt className='mr-3' />
                          <p className='tracking-wide' >Address</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/register')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaClipboardList className='mr-3' />
                          <p className='tracking-wide' >Orders</p>
                        </li>
                        <li onClick={() => profileMenuHandler('/register')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          < FaShoppingCart className='mr-3' />
                          <p className='tracking-wide' >Go To Cart</p>
                        </li>

                        <hr className='mx-1.5 my-1 text-gray-500' />

                        <li onClick={() => handleLogout('/login')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                          <FaSignOutAlt className='mr-3' />
                          <p className='tracking-wide' >Logout</p>
                        </li>
                      </>)
                    :
                    <>
                      <li onClick={() => profileMenuHandler('/register')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                        <FiLogIn className='mr-3' />
                        <p className='tracking-wide' >Register</p>
                      </li>

                      <li onClick={() => profileMenuHandler('/login')} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c]'>
                        <FiLogOut className='mr-3' />
                        <p className='tracking-wide' >Login</p>
                      </li>
                    </>
                  }
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Nav;