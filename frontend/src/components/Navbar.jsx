import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiSearch, FiMic, FiVideo, FiGrid, FiBell,
  FiUser, FiLogIn, FiLogOut, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { MdOutlineShoppingCart } from "react-icons/md";
import { asstes } from '../assets/assets';
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';

const Nav = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user)
  console.log(user);
  

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
    <nav className="bg-white  shadow-md sticky border border-gray-500 top-0 z-50">
      <div className="mx-auto lg:px-16 px-4 py-2">
        <div className="flex gap-2 justify-between items-center ">
          <Link title='Groce Mart Home' to='/' className='flex items-center gap-2'>
            <img className='w-12 md:w-16' src={asstes.logo} alt="" />
            <h1 className='hidden lg:block text-2xl font-bold' >Groce Mart</h1>
          </Link>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{
              width: windowWidth < 640 && !isSearchExpanded ? 0 : '100%',
              opacity: windowWidth < 640 && !isSearchExpanded ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`flex justify-center transition-all duration-200 ${windowWidth < 640 ? 'mx-2' : 'flex-1'}`}
          >
            <div className="relative flex items-center w-full max-w-xl">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                className="w-full py-2 px-4 placeholder:text-black border border-gray-700 rounded-l-full focus:outline-none focus:border-purple-700"
                onFocus={() => windowWidth < 640 && setIsSearchExpanded(true)}
                onBlur={() => windowWidth < 640 && !searchInputRef.current.value && setIsSearchExpanded(false)}
              />
              <button title='Search' className="cursor-pointer bg-[#6945c5] hover:bg-[#54389c] px-5 py-2.5 border border-l-0 border-gray-700 rounded-r-full">
                <FiSearch className="h-5 w-5 text-white" />
              </button>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3">
            {windowWidth < 640 && !isSearchExpanded && (
              <button onClick={toggleSearch} className="p-2 rounded-full hover:bg-yellow-400">
                <FiSearch className="h-5 w-5 text-black" />
              </button>
            )}

            {!isSearchExpanded && (
              <button title='Go To Cart' className="cursor-pointer p-2 relative">
                <MdOutlineShoppingCart className="h-7 w-7 text-black" />
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            )}

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="cursor-pointer flex items-center justify-center p-1.5 rounded-full bg-[#6945c5] text-white hover:bg-[#54389c]"
              >
                <FiUser className="h-6 w-6 text-white" />
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

                    <li onClick={() => (setIsProfileMenuOpen(false), navigate('/register'))} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c] '>
                      <FiLogIn className='mr-3' />
                      <p className='tracking-wide' >Register</p>
                    </li>

                    <li onClick={() => (setIsProfileMenuOpen(false), navigate('/login'))} className='cursor-pointer flex rounded-md items-center px-4 py-2 text-sm duration-200 text-black hover:bg-[#6945c5] hover:text-white active:bg-[#4b318c]'>
                      <FiLogOut className='mr-3' />
                      <p className='tracking-wide' >Login</p>
                    </li>

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
