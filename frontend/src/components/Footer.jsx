import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingBag, FaLeaf, FaHeadset } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-purple-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <FaShoppingBag className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Groce<span className="text-purple-400">Mart</span></h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Fresh groceries delivered to your doorstep in minutes. Quality you can taste, service you can trust.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2.5 bg-gray-800 rounded-full text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-gray-800 rounded-full text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-gray-800 rounded-full text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <FaLeaf className="mr-2 text-purple-500" />
              Quick Links
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <FaHeadset className="mr-2 text-purple-500" />
              Customer Care
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  24/7 Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
            <p className="text-gray-400">
              Subscribe for exclusive offers and weekly recipes
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-purple-900/30"
              >
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GroceMart. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer