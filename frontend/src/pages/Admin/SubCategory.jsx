import React, { useEffect, useRef, useState } from 'react'
import { MdCategory } from 'react-icons/md'
import { AnimatePresence, motion, removeItem } from "framer-motion";
import { FaCheck, FaImage, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { ButtonLoading } from '../../components';
import toast from 'react-hot-toast';
import Axios from '../../Utils/Axios';
import summarApi from '../../common/SummaryApi';
import { useSelector } from 'react-redux';
import { FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SubCategory = () => {
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    id: '',
    name: '',
    image: null,
    preview: null,
    categories: []
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubCategory({
          ...newSubCategory,
          image: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewSubCategory({ name: '', image: null, preview: null, category: [] });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubCategory({
          ...newSubCategory,
          image: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubCategory = async () => {
    // if (!newSubCategory.name || !newSubCategory.image) toast.error("Enter Name and Image");


    const formData = new FormData
    formData.append('name', newSubCategory.name)
    formData.append('image', newSubCategory.image)


    setIsLoading(true)
    console.log(newSubCategory)
    setIsLoading(false)
    resetForm();
  };

  const handleSelect = (item) => {
    if (newSubCategory.categories?.find(cat => cat._id === item._id)) {
      handleRemoveCategory(item._id)
    }
    else {
      setNewSubCategory({ ...newSubCategory, categories: [...newSubCategory.categories, item] })
    }

    setIsOpen(false)
  }

  const handleRemoveCategory = (id) => {
    console.log(id)
    let newArray = newSubCategory.categories.filter((item) => item._id !== id)
    console.log(newArray)
    setNewSubCategory({ ...newSubCategory, categories: [...newArray] })
  }


  const allCategory = useSelector(state => state.product.allCategory);

  useEffect(() => {
    setCategories(allCategory)
    console.log(categories)
  }, [allCategory])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* sub category add button  */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className=" text-base md:text-2xl font-bold text-gray-800 flex items-center">
            <MdCategory className="mr-2" style={{ color: '#6945c5' }} />
            Product Sub Categories
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer flex items-center px-4 py-2 rounded-lg text-white text-xs md:text-sm font-medium"
            style={{ backgroundColor: '#6945c5' }}
          >
            <FaPlus className="mr-2" />
            Add Sub Category
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => resetForm()}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusBorderColor: '#6945c5', focusRingColor: '#6945c5' }}
                  placeholder="e.g. Fruits, Vegetables"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Category Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                    }`}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  {newSubCategory.preview ? (
                    <div className="relative">
                      <img
                        src={newSubCategory.preview}
                        alt="Preview"
                        className="mx-auto max-h-40 rounded-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewSubCategory({ ...newSubCategory, image: null, preview: null });
                        }}
                        className="cursor-pointer absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 -mt-2 -mr-2"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaImage
                        className="mx-auto text-gray-400 mb-2"
                        size={48}
                        style={{ color: isDragging ? '#6945c5' : '#9CA3AF' }}
                      />
                      <p className="text-gray-500">
                        {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>


              <div className=' flex gap-2 flex-wrap py-2'>
                {newSubCategory.categories?.map((item) => (
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    key={item._id}
                    className='relative'>
                    <p
                      className=' px-3 py-1 bg-purple-100 text-purple-800 border rounded-sm'
                    >
                      {item.name}
                    </p>
                    <button
                      onClick={() => handleRemoveCategory(item._id)}
                      className='cursor-pointer p-0.5 absolute top-[-6px] right-[-6px] text-white bg-red-600 rounded-full duration-200 '
                    >
                      <FaTimes />
                    </button>

                  </motion.div>
                ))}
              </div>


              {/* drop down  */}
              <div className="w-full max-w-md mb-6">
                <h1 className="text-xl font-semibold text-black mb-2">Select Category</h1>

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
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${newSubCategory.categories?.find(cat => cat.name === item.name)
                              ? 'bg-purple-200 text-purple-700'
                              : 'text-gray-800'
                              }`}
                            onClick={() => handleSelect(item)}
                            role="option"
                            aria-selected={newSubCategory.categories?.find(cat => cat.name === item.name)}
                          >
                            <div className="flex items-center">
                              {item.name}
                            </div>
                            {newSubCategory.categories?.find(cat => cat.name === item.name) && (
                              <FiCheck className="text-purple-600" />
                            )}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  <motion.button
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

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => resetForm()}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {!isEditMode ?
                  <button
                    onClick={handleAddSubCategory}
                    disabled={isLoading}
                    className='cursor-pointer px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-600  hover:bg-purple-700'
                    style={{ backgroundColor: '#6945c5' }}
                  >
                    {isLoading ?
                      <>
                        <ButtonLoading />
                        Uploading...
                      </>
                      :
                      <> <FaUpload className="mr-2" />
                        Upload Category
                      </>}
                  </button>
                  :
                  <button
                    onClick={handleUpdateCategory}
                    disabled={!newSubCategory.name}
                    className='cursor-pointer px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-600  hover:bg-purple-700'
                    style={{ backgroundColor: '#6945c5' }}>
                    {isLoading ?
                      <>
                        <ButtonLoading />
                        Updating...
                      </> :
                      <>
                        <FaCheck className="mr-2" />
                        Update Category
                      </>}

                  </button>
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default SubCategory
