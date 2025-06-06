import { useState, useRef, useEffect } from "react";
import { AiFillProduct } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaImage, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSelector } from "react-redux";

const UploadProducts = () => {
  const primaryColor = '#6945c5'

  const dropdownRef = useRef(null);
  const subDropdownRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isSubOpen, setIsSubOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setallSubCategories] = useState([])
  const units = ["KG", "GM", "LTR", "ML", "PC", "PACKET", "BOX", "METER", "CM"];

  const [newProduct, setNewProduct] = useState({
    name: '',
    images: Array(4).fill({ file: null, preview: null }),
    category: [],
    subCategory: [],
    unit: '',
    stock: '',
    price: '',
    discount: '',
    description: "",
    publish: true
  });


  // All Form Handler 
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...newProduct.images];
        updatedImages[index] = {
          file: file,
          preview: reader.result
        };
        setNewProduct({ ...newProduct, images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...newProduct.images];
        updatedImages[index] = {
          file: file,
          preview: reader.result
        };
        setNewProduct({ ...newProduct, images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = { file: null, preview: null };
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      images: Array(4).fill({ file: null, preview: null }),
      category: [],
      subCategory: [],
      unit: [],
      stock: '',
      price: '',
      discount: '',
      description: "",
      publish: true
    });
    setIsModalOpen(false);
    setIsEditMode(false);
  };


  const handleSelect = (item) => {
    if (newProduct.category?.find(cat => cat._id === item._id)) {
      handleRemoveCategory(item._id)
    }
    else {
      setNewProduct({ ...newProduct, category: [...newProduct.category, item] })
    }

  }

  const handleSelectSub = (item) => {

    if (newProduct.subCategory?.find(cat => cat._id === item._id)) {
      handleRemoveSubCategory(item._id)
    }
    else {
      setNewProduct({ ...newProduct, subCategory: [...newProduct.subCategory, item] })
    }

  }

  const handleRemoveCategory = (id) => {
    const category = newProduct.category.filter((item) => item._id !== id)
    setNewProduct({ ...newProduct, category: category })
  };

  const handleRemoveSubCategory = (id) => {
    const subCategory = newProduct.subCategory.filter((item) => item._id !== id)
    setNewProduct({ ...newProduct, subCategory: subCategory })
  };


  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(newProduct)
    setTimeout(() => {
      setIsLoading(false);
      resetForm();
    }, 1500);
  };

  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  useEffect(() => {
    setCategories(allCategory)
  }, [allCategory])

  useEffect(() => {
    setallSubCategories(allSubCategory)
  }, [allSubCategory])

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector('body').style.overflowY = 'hidden'
    } else {
      document.querySelector('body').style.overflowY = 'scroll'
    }
  }, [isModalOpen])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
          <AiFillProduct className={`mr-2 text-[${primaryColor}]`} />
          Upload Product
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          style={{ background: primaryColor }}
          className="cursor-pointer flex items-center px-4 py-2 rounded-lg text-white hover:bg-purple-700"
        >
          <FaPlus className="mr-2" />
          Add Product
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>

              <form className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 mb-2">Product Name*</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Image Upload Sections */}
                <div>
                  <label className="block text-gray-700 mb-2">Product Images (Max 4)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer h-32 ${newProduct.images[index].preview
                          ? 'border-transparent'
                          : 'border-gray-300 hover:border-purple-400'
                          }`}
                        onClick={() => document.getElementById(`file-upload-${index}`).click()}
                      >
                        {newProduct.images[index].preview ? (
                          <div className="relative h-full">
                            <img
                              src={newProduct.images[index].preview}
                              alt={`Preview ${index}`}
                              className="h-full mx-auto object-cover rounded-md "
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <FaImage className="mb-2 text-2xl" />
                            <p className="text-sm">Click to upload or drag and drop</p>
                          </div>
                        )}
                        <input
                          id={`file-upload-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="w-full mb-6">
                  <h1 className="text-xl font-semibold text-black mb-2">Select Category</h1>
                  <div className='flex gap-2 flex-wrap py-2 max-h-20 overflow-y-scroll overflow-x-hidden'>
                    {newProduct.category?.map((item) => (
                      <motion.div
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, type: 'spring', bounce: 30 }}
                        key={item._id}
                        className='relative'>
                        <p
                          className=' px-3 py-1 bg-purple-100 text-purple-800 border rounded-sm'
                        >
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(item._id)}
                          className='cursor-pointer p-0.5 absolute top-[-6px] right-[-6px] text-white bg-red-600 rounded-full duration-200 '
                        >
                          <FaTimes />
                        </button>

                      </motion.div>
                    ))}
                  </div>
                  <div className="relative w-full mt-2" ref={dropdownRef}>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full max-h-60 overflow-y-scroll bottom-full mb-1 bg-white border border-purple-200 rounded-xl shadow-lg overflow-hidden py-1 focus:outline-none"
                          role="listbox"
                          tabIndex={-1}
                        >
                          {categories?.map((item) => (
                            <motion.li
                              key={item._id}
                              whileHover={{ backgroundColor: '#f3e8ff' }}
                              className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${newProduct.category?.find(cat => cat.name === item.name)
                                ? 'bg-purple-200 text-purple-700'
                                : 'text-gray-800'
                                }`}
                              onClick={() => handleSelect(item)}
                              role="option"
                              aria-selected={newProduct.category?.find(cat => cat.name === item.name)}
                            >
                              <div className="flex items-center">
                                {item.name}
                              </div>
                              {newProduct.category?.find(cat => cat.name === item.name) && (
                                <FiCheck className="text-purple-600" />
                              )}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-purple-600 bg-white border border-purple-700 rounded-lg shadow-sm hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      onClick={() => setIsOpen(!isOpen)}
                      aria-haspopup="listbox"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center">
                        <span>Select Category</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isOpen ? (
                          <FiChevronUp className="w-5 h-5 ml-2 text-purple-600" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 ml-2 text-purple-600" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* sub Category selection */}
                <div className="w-full mb-6">
                  <h1 className="text-xl font-semibold text-black mb-2">Select SubCategory</h1>
                  <div className='flex gap-2 flex-wrap py-2 max-h-20 overflow-y-scroll overflow-x-hidden'>
                    {newProduct.subCategory?.map((item) => (
                      <motion.div
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, type: 'spring', bounce: 30 }}
                        key={item._id}
                        className='relative'>
                        <p
                          className=' px-3 py-1 bg-purple-100 text-purple-800 border rounded-sm'
                        >
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubCategory(item._id)}
                          className='cursor-pointer p-0.5 absolute top-[-6px] right-[-6px] text-white bg-red-600 rounded-full duration-200 '
                        >
                          <FaTimes />
                        </button>

                      </motion.div>
                    ))}
                  </div>
                  <div className="relative w-full mt-2" ref={subDropdownRef}>
                    <AnimatePresence>
                      {isSubOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full max-h-60 overflow-y-scroll bottom-full mb-1 bg-white border border-purple-200 rounded-xl shadow-lg overflow-hidden py-1 focus:outline-none"
                          role="listbox"
                          tabIndex={-1}
                        >
                          {allSubCategories?.map((item) => (
                            <motion.li
                              key={item._id}
                              whileHover={{ backgroundColor: '#f3e8ff' }}
                              className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${newProduct.category?.find(cat => cat.name === item.name)
                                ? 'bg-purple-200 text-purple-700'
                                : 'text-gray-800'
                                }`}
                              onClick={() => handleSelectSub(item)}
                              role="option"
                              aria-selected={newProduct.subCategory?.find(cat => cat.name === item.name)}
                            >
                              <div className="flex items-center">
                                {item.name}
                              </div>
                              {newProduct.subCategory?.find(cat => cat.name === item.name) && (
                                <FiCheck className="text-purple-600" />
                              )}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-purple-600 bg-white border border-purple-700 rounded-lg shadow-sm hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      onClick={() => setIsSubOpen(!isSubOpen)}
                      aria-haspopup="listbox"
                      aria-expanded={isSubOpen}
                    >
                      <div className="flex items-center">
                        <span>Select Category</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isSubOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isSubOpen ? (
                          <FiChevronUp className="w-5 h-5 ml-2 text-purple-600" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 ml-2 text-purple-600" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>

                </div>


                {/* Unit Selection */}
                <div>
                  <h2 className="text-xl font-semibold text-black mb-2" >Select Unit</h2>
                  <div className="flex gap-2 flex-wrap">
                    {units.map((item, index) => (
                      <motion.span
                        key={item + index}
                        onClick={() => setNewProduct({ ...newProduct, unit: item })}
                        className='cursor-pointer flex gap-1 items-center border pl-2 pr-5 py-1 rounded-sm text-purple-600'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {item === newProduct.unit && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}

                          >
                            <FaCheck className={`bg-[${primaryColor}] text-white p-1 rounded-full`} />
                          </motion.span>
                        )}
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Stock, Price, Discount */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="₹0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Discount</label>
                    <input
                      type="number"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0%"
                      max="100"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Product description"
                    rows="3"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.publish}
                      onChange={(e) => setNewProduct({ ...newProduct, publish: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ms-3 text-gray-700">Publish Product</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddProduct}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-600 hover:bg-purple-700 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        {isEditMode ? 'Update' : 'Add Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadProducts;