import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from "../Utils/Axios"
import summarApi from '../common/SummaryApi';
import { motion, useAnimation } from 'framer-motion';
import { Helmet } from "react-helmet";

// icons
import { FiShoppingCart, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { FaFire, FaBolt } from 'react-icons/fa';


const ProductDisplayPage = () => {

  const param = useParams();
  const productId = param?.product?.split('-')?.slice(-1)[0];

  const [product, setProduct] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityControls, setShowQuantityControls] = useState(false);

  const controls = useAnimation();
  const sliderRef = useRef(null);

  const nextImage = () => {
    const nextIndex = currentImageIndex === (product?.images?.length ?? 1) - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    controls.start({ x: `-${nextIndex * 100}%` });
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? (product?.images?.length ?? 1) - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    controls.start({ x: `-${prevIndex * 100}%` });
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock ?? 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setShowQuantityControls(true);
    // Here you would typically also add the product to cart
  };

  const fetchProduct = async () => {
    try {
      const response = await Axios({
        url: `${summarApi.product.getProductDetails.url}/${productId}`,
        method: summarApi.product.getProductDetails.method
      })

      if (response.data.success) {
        setProduct(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [param])

  return (
    <>
      <Helmet>
        <title>{product?.name}</title>
        <meta name="description" content={product?.description} />
      </Helmet>

      <div className="min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1 py-2 md:p-8">
              {/* Image Slider - Made smaller with max-w-md */}
              <div className="relative max-w-md mx-auto w-full">
                {/* Discount Tag on Image */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                    <FaFire className="mr-1" size={10} />
                    {product.discount}% OFF
                  </div>
                )}

                <div
                  ref={sliderRef}
                  className="overflow-hidden rounded-2xl bg-purple-50 relative h-80 md:h-96"
                >
                  <motion.div
                    drag="x"
                    dragConstraints={sliderRef}
                    animate={controls}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex h-full"
                    style={{ x: `-${currentImageIndex * 100}%` }}
                  >
                    {product.images?.map((img, index) => (
                      <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                        <motion.img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-contain p-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-purple-700 hover:bg-white transition-all hover:scale-110"
                    >
                      <FiChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-purple-700 hover:bg-white transition-all hover:scale-110"
                    >
                      <FiChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Thumbnails & Indicators */}
                <div className="mt-6">
                  <div className="flex justify-center space-x-2">
                    {product.images?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          controls.start({ x: `-${index * 100}%` });
                        }}
                        className={`cursor-pointer w-3 h-3 rounded-full transition-all ${currentImageIndex === index ? 'bg-purple-600 w-6' : 'bg-purple-200'}`}
                      />
                    ))}
                  </div>

                  {product.images && (
                    <div className="flex mt-4 space-x-3">
                      {product.images?.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            controls.start({ x: `-${index * 100}%` });
                          }}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-purple-600 scale-105' : 'border-gray-200 hover:border-purple-300'}`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-black">
                    {product?.name || "Product Name"}
                  </h1>
                  <div className="text-lg text-gray-700">
                    {product?.unit_quantity} {product?.unit}
                  </div>
                </motion.div>

                <div className="flex items-center space-x-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(24 reviews)</span>
                  <span className="text-green-600 text-sm font-medium">In Stock</span>
                </div>

                {/* Fast Delivery Badge */}
                <div className="flex items-center bg-green-100 text-green-700 border border-green-400 px-3 py-2 rounded-lg w-max">
                  <FaBolt className="mr-2" />
                  <span className="text-sm font-medium">Get delivery in <span className='font-bold'>11 Min</span> </span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </div>
                    {product.discount > 0 && (
                      <div className="text-lg text-gray-500 line-through">
                        ₹{product.price}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-purple-600">
                    (₹{(product?.price / parseInt(product?.unit_quantity || "405")).toFixed(2)} per {product?.unit || "GM"})
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 leading-relaxed"
                >
                  {product?.description || "Premium quality product description"}
                </motion.p>

                <div className="border-t border-b border-purple-100 py-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    {showQuantityControls ? (
                      <div className="flex items-center border border-purple-200 rounded-full bg-white">
                        <button
                          onClick={decreaseQuantity}
                          className="px-3 py-1 text-purple-700 hover:bg-purple-50 rounded-l-full transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-center min-w-[40px]">{quantity}</span>
                        <button
                          onClick={increaseQuantity}
                          className="px-3 py-1 text-purple-700 hover:bg-purple-50 rounded-r-full transition-colors"
                          disabled={quantity >= (product?.stock || 0)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="px-4 py-1">{quantity}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Free shipping on orders over ₹200</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {!showQuantityControls ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full font-medium flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <FiShoppingCart />
                      <span>Add to Cart</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-medium flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <FiShoppingCart />
                      <span>Added to Cart ({quantity})</span>
                    </motion.button>
                  )}
                </div>

                <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    Product Details
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Weight: {product?.unit_quantity || "405"}{product?.unit || "GM"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Premium quality products with no additives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Rich in nutrients and antioxidants</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Vacuum sealed for freshness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Perfect for gifting and daily consumption</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ProductDisplayPage