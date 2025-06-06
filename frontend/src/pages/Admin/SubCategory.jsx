import React, { useEffect, useRef, useState } from 'react'
import { MdCategory } from 'react-icons/md'
import { AnimatePresence, motion } from "framer-motion";
import { FaBan, FaCheck, FaEdit, FaImage, FaPlus, FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import { ButtonLoading } from '../../components';
import toast from 'react-hot-toast';
import Axios from '../../Utils/Axios';
import summarApi from '../../common/SummaryApi';
import { useSelector } from 'react-redux';
import { FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MdEdit } from "react-icons/md";
import { PreSubCategory } from '../../components';

const SubCategory = () => {
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    id: '',
    name: '',
    image: null,
    preview: null,
    categories: []
  });
  const [showSubCategoryImage, setShowSubCategoryImage] = useState({
    name: '',
    url: null,
    x: 0,
    y: 0
  });
  const [subCategoryToDelete, setSubCategoryToDelete] = useState({
    id: '',
    name: '',
    image: null,
    preview: null,
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
    setNewSubCategory({ name: '', image: null, preview: null, categories: [] });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleSelect = (item) => {
    if (newSubCategory.categories?.find(cat => cat._id === item._id)) {
      handleRemoveCategory(item._id)
    }
    else {
      setNewSubCategory({ ...newSubCategory, categories: [...newSubCategory?.categories, item] })
    }

    setIsOpen(false)
  }

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

  const handleAddSubCategory = async (e) => {
    e.preventDefault()
    if (!newSubCategory.name || !newSubCategory.image) toast.error("Enter Name and Image");
    if (!newSubCategory.categories[0]) toast.error("Enter Name and Image");

    setIsLoading(true)
    const categoryId = newSubCategory.categories.map(cat => cat._id)
    const formData = new FormData
    formData.append('name', newSubCategory.name)
    formData.append('image', newSubCategory.image)
    categoryId.forEach(category => {
      formData.append('category', category);
    });

    try {
      const response = await Axios({
        ...summarApi.subCategory.addSubCategory, data: formData
      })
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

    setIsLoading(false)
    resetForm();
  };

  const handleEditCategory = async (subCategory) => {

    // get categories details
    const categories = []
    subCategory.category.map(item => {
      const response = handleGetCategoryDetails(item)
      categories.push(response)
    })

    setNewSubCategory({
      id: subCategory._id,
      name: subCategory.name,
      image: null,
      preview: subCategory.image,
      categories: categories
    })
    setIsEditMode(true);
    setIsModalOpen(true)
  }

  const handleUpdateCategory = async () => {

    if (!newSubCategory.name) toast.error("Enter Name and Image");
    if (!newSubCategory.categories[0]) toast.error("Enter Name and Image");

    setIsLoading(true)

    const categoryId = newSubCategory.categories.map(cat => cat._id)
    const formData = new FormData
    formData.append('_id', newSubCategory.id)
    formData.append('name', newSubCategory.name)
    formData.append('image', newSubCategory.image)
    categoryId.forEach(category => {
      formData.append('category', category);
    });

    try {
      const response = await Axios({
        ...summarApi.subCategory.updateSubCategory, data: formData
      })
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

    setIsLoading(false)
    resetForm();
  }

  const confirmDelete = (subCategory) => {
    setSubCategoryToDelete({
      id: subCategory._id,
      name: subCategory.name,
      preview: subCategory.image
    });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await Axios({
        ...summarApi.subCategory.removeSubCategory, data: ({ 'subCategoryId': subCategoryToDelete.id })
      })
      if (response) {
        console.log(response)
        toast.success(response.data.message)

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
    setShowDeleteConfirm(false);
    subCategoryToDelete(null);
  };

  const handleRemoveCategory = (id) => {
    const category = newSubCategory.categories.filter((item) => item._id !== id)
    setNewSubCategory({ ...newSubCategory, categories: category })
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    subCategoryToDelete(null);
  };

  const handleGetCategoryDetails = (id) => {
    const category = categories.find((item) => item._id === id)
    return category
  }

  const allCategory = useSelector(state => state.product.allCategory);

  useEffect(() => {
    setCategories(allCategory)
  }, [allCategory])

  const fetchAllSubCategory = async () => {
    try {
      const response = await Axios({
        ...summarApi.subCategory.getAllSubCategory
      })
      if (response.data.success) {
        setSubCategories([...response.data.data])
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllSubCategory()
  }, [subCategories])

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector('body').style.overflowY = 'hidden'
    } else {
      document.querySelector('body').style.overflowY = 'scroll'
    }
  }, [isModalOpen])


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* sub category add button  */}
      <div className=" mx-auto">
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

        {subCategories.length == 0 ?
          <PreSubCategory />
          :
          <div className="overflow-x-auto ">
            <table className="min-w-full  bg-white border border-gray-300 rounded-lg overflow-x-scroll">
              <thead className="bg-purple-200 border">
                <tr>
                  <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black w-40">Image</th>
                  <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black min-w-52">Name</th>
                  <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black min-w-60 flex flex-wrap">Categories</th>
                  <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black max-w-32 sm:min-w-60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {subCategories?.map((category) => (
                  <motion.tr
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border hover:bg-purple-50"
                  >
                    {/* Image Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            title={category.name}
                            src={category.image}
                            alt={category.name}
                            onMouseEnter={(e) => (console.log(e), setShowSubCategoryImage({ name: category.name, url: category.image, x: e.clientX, y: e.clientY }))}
                            onMouseLeave={() => setShowSubCategoryImage({ url: null })}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="py-4 px-4 text-base text-black font-medium">
                      {category.name}
                    </td>

                    {/* Categories Array Column */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {category?.category?.map((cat, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 border text-xs sm:text-sm bg-purple-100 text-purple-800 rounded-full"
                          >

                            {handleGetCategoryDetails(cat)?.name}
                          </span>
                        ))}
                      </div>
                    </td>


                    {/* Actions Column - Now with fixed width */}
                    <td className="py-4 px-4 w-24">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="cursor-pointer p-2.5 text-xl text-purple-800 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors border"
                          title="Edit Sub Category"
                        >
                          <MdEdit />
                        </button>

                        <button
                          onClick={() => confirmDelete(category)}
                          className="cursor-pointer p-3 text-base text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors border"
                          title="Remove Sub Category"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <AnimatePresence>
              {showSubCategoryImage.url && (
                <motion.img
                  style={{ top: showSubCategoryImage.y, x: showSubCategoryImage.x - 20 }}
                  className='z-99 w-40 fixed'
                  src={showSubCategoryImage.url}
                  alt={showSubCategoryImage.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { type: "spring", stiffness: 900, damping: 20 }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 }
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        }

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed  inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
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


                <div className='flex gap-2 flex-wrap py-2 max-h-20 overflow-y-scroll overflow-x-hidden'>
                  {newSubCategory.categories?.map((item) => (
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

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl border p-6 w-full max-w-md"
              >
                <div className="text-center">
                  <div className='py-3 border rounded-sm border-dashed' >
                    <img src={subCategoryToDelete.preview} className='w-32 m-auto' alt="" />
                    <p>{subCategoryToDelete.name}</p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 my-2">Delete Category</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this category? <span className='text-red-500'>This action cannot be undone.</span> </p>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={cancelDelete}
                      className="cursor-pointer px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <FaBan className="mr-2" />
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={handleDelete}
                      className="cursor-pointer px-6 py-2 rounded-lg text-white font-medium flex items-center bg-red-500 hover:bg-red-600"
                    >
                      {isLoading ?
                        <>
                          <ButtonLoading />
                          removing...
                        </>
                        :
                        <>
                          <FaTrash className="mr-2" />
                          Delete
                        </>}

                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>


    </div>
  )
}

export default SubCategory
