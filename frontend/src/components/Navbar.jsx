import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { FaUser, FaMapMarkerAlt, FaClipboardList, FaSignOutAlt, FaShoppingCart, FaLayerGroup, FaBox, FaUpload } from 'react-icons/fa';
import { MdOutlineShoppingCart } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { asstes } from '../assets/assets';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Axios from '../Utils/Axios';
import summarApi from '../common/SummaryApi';

const Nav = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

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
      if (window.innerWidth > 768) {
        setIsSearchExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  };

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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{
              width: windowWidth < 640 && !isSearchExpanded ? 0 : '100%',
              opacity: windowWidth < 640 && !isSearchExpanded ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`flex justify-center ${windowWidth < 640 ? 'mx-2' : 'flex-1 max-w-2xl mx-6'}`}
          >
            <div className="relative w-full">
              <div className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 pl-5 pr-12 text-sm  text-black placeholder-gray-700 bg-gray-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onFocus={() => windowWidth < 640 && setIsSearchExpanded(true)}
                  onBlur={() => windowWidth < 640 && !searchInputRef.current.value && setIsSearchExpanded(false)}
                />
                <button className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-6">
            {windowWidth < 640 && !isSearchExpanded && (
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-800 hover:text-purple-600 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="h-6 w-6" />
              </button>
            )}

            {!isSearchExpanded && (
              <button
                className="cursor-pointer p-2 relative text-gray-800 hover:text-purple-600 transition-colors"
                aria-label="Cart"
              >
                <MdOutlineShoppingCart className="h-7 w-7" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  3
                </span>
              </button>
            )}

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
      </div>
    </nav>
  );
};

export default Nav;