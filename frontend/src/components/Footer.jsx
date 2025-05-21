import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-yellow-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">


          <div>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Groce Mart</h2>
            <p>Your one-stop destination for fresh groceries delivered fast and fresh to your doorstep.</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-yellow-500">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-yellow-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-yellow-500">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>


          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-500">Home</a></li>
              <li><a href="#" className="hover:text-yellow-500">Shop</a></li>
              <li><a href="#" className="hover:text-yellow-500">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-500">Blog</a></li>
            </ul>
          </div>


          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-500">FAQs</a></li>
              <li><a href="#" className="hover:text-yellow-500">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-yellow-500">Order Tracking</a></li>
              <li><a href="#" className="hover:text-yellow-500">Contact Us</a></li>
            </ul>
          </div>


          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">Newsletter</h3>
            <p>Subscribe to get the latest offers and updates directly in your inbox.</p>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-yellow-500 text-gray-900 font-semibold py-2 rounded hover:bg-yellow-400 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>


        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Groce Mart. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
