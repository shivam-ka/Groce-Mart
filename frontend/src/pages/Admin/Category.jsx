import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaUpload, FaImage, FaTrash, FaEdit, FaCheck, FaBan } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import Axios from '../../Utils/Axios';
import summarApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import { ButtonLoading } from '../../components';

const Category = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    image: null,
    preview: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState({
    id: '',
    name: '',
    image: null,
    preview: null,
  });

  const fetchCategories = async () => {
    setIsPageLoading(true)
    try {
      const response = await Axios({
        ...summarApi.category.getAllCategory
      })
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsPageLoading(false)
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.image) toast.error("Enter Name and Image");

    const formData = new FormData
    formData.append('name', newCategory.name)
    formData.append('image', newCategory.image)

    setIsLoading(true)

    try {
      const response = await Axios({
        ...summarApi.category.addCategory, data: formData
      })
      if (response.data.success) {
        fetchCategories()
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
    resetForm();
  };

  const handleEditCategory = async (category) => {
    setIsEditMode(true);
    setNewCategory({
      id: category._id,
      name: category.name,
      image: null,
      preview: category.image
    });
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async () => {

    const formData = new FormData
    formData.append('name', newCategory.name)
    formData.append('image', newCategory.image)
    formData.append('categoryId', newCategory.id)
    setIsLoading(true)

    try {
      const response = await Axios({
        ...summarApi.category.updateCategory, data: formData
      })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCategories()
        setIsEditMode(false)
        setIsModalOpen(false)

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
  }

  const resetForm = () => {
    setNewCategory({ name: '', image: null, preview: null });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory({
          ...newCategory,
          image: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
        setNewCategory({
          ...newCategory,
          image: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete({
      id: category._id,
      name: category.name,
      preview: category.image
    });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await Axios({
        ...summarApi.category.deleteCategory, data: ({ 'categoryId': categoryToDelete.id })
      })
      if (response) {
        console.log(response)
        toast.success(response.data.message)
        fetchCategories()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  useEffect(() => {
    fetchCategories()
  }, [])


  return (
    isPageLoading ?
      <div className="min-h-[90vh] p-4 md:py-10 md:px-14 lg:px-30">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {Array(8).fill(null).map((index) => (
            <div className='flex flex-col gap-2 rounded-xl'>
              <div className='animate-pulse rounded-sm h-32 md:h-40 bg-gray-300'></div>
              <div className='animate-pulse rounded-sm h-4 md:h-5 bg-gray-300 w-1/2'></div>
              <div className='animate-pulse rounded-sm h-7 md:min-h-10 bg-gray-300'></div>
            </div>
          ))

          }
        </div>


      </div>

      :
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className=" text-base md:text-2xl font-bold text-gray-800 flex items-center">
              <MdCategory className="mr-2" style={{ color: '#6945c5' }} />
              Product Categories
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer flex items-center px-4 py-2 rounded-lg text-white text-xs md:text-sm font-medium"
              style={{ backgroundColor: '#6945c5' }}
            >
              <FaPlus className="mr-2" />
              Add Category
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white border border-gray-400 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="relative flex-grow h-40 overflow-hidden border-b border-gray-400 bg-linear-to-b from-white to-purple-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full m-auto object-cover w-auto duration-200 hover:scale-105"
                  />
                </div>
                <div className="px-2 md:px-2.5 py-3 flex flex-col gap-2">
                  <h3 className="ml-1 md:ml-2 text-[13px] md:text-lg font-semibold text-gray-800">{category.name}</h3>

                  <button
                    onClick={() => handleEditCategory(category)}
                    className='cursor-pointer text-[13px] w-full md:px-6 py-2 rounded-sm text-purple-800 font-medium flex items-center justify-center bg-purple-100 border border-purple-950 hover:bg-purple-200'
                    title="Edit category"
                  >
                    <FaEdit size={16} className='mr-1.5 ' />
                    Edit Category
                  </button>

                  <button
                    title='Remove Category'
                    onClick={() => confirmDelete(category)}
                    className="cursor-pointer absolute top-0 text-[13px] md:text-sm right-0 px-3 md:px-6 py-2 rounded-b-xs text-white font-medium flex items-center bg-red-500 hover:bg-red-600"
                  >
                    <FaTrash className='mr-1.5' />

                  </button>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Add/Edit Category Modal */}
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
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
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
                      {newCategory.preview ? (
                        <div className="relative">
                          <img
                            src={newCategory.preview}
                            alt="Preview"
                            className="mx-auto max-h-40 rounded-md"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewCategory({ ...newCategory, image: null, preview: null });
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

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => resetForm()}
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    {!isEditMode ?
                      <button
                        onClick={handleAddCategory}
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
                        disabled={!newCategory.name}
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
                      <img src={categoryToDelete.preview} className='w-32 m-auto' alt="" />
                      <p>{categoryToDelete.name}</p>
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
  );
};

export default Category;