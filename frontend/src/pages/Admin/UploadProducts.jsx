import { useState, useRef, useEffect } from "react";
import { AiFillProduct } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PreCategory } from "../../components";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../../Utils/Axios";
import summarApi from "../../common/SummaryApi";
import ButtonLoading from "../../components/ButtonLoading";
import CustomToast from "../../components/Toast/CustomToast";

// Icons
import { FiSearch } from 'react-icons/fi'
import { BiSolidCategory } from 'react-icons/bi'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropright } from "react-icons/io";
import { GiBroom } from "react-icons/gi";
import { MdSearchOff } from "react-icons/md"
import { FaCheck, FaImage, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";

const UploadProducts = () => {
  const primaryColor = '#6945c5'

  const dropdownRef = useRef(null);
  const subDropdownRef = useRef(null);

  const [productData, setProductData] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isSubOpen, setIsSubOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setallSubCategories] = useState([])
  const units = ["KG", "GM", "LTR", "ML", "PC", "PACKET", "BOX", "METER", "CM"];

  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    images: Array(4).fill({ file: null, preview: null }),
    category: [],
    subCategory: [],
    unit: '',
    unit_quantity: '',
    stock: '',
    price: '',
    discount: '',
    description: "",
    publish: true
  });

  const pageNumber = Number(searchParams.get('page') || 1)
  const urlSearchQuery = searchParams.get('query');

  const getFormData = () => {
    const formData = new FormData
    if (newProduct.id) {
      formData.append('productId', newProduct.id)
    }
    formData.append('name', newProduct.name)
    formData.append('unit', newProduct.unit)
    formData.append('unit_quantity', newProduct.unit_quantity)
    formData.append('stock', newProduct.stock)
    formData.append('price', newProduct.price)
    formData.append('discount', newProduct.discount)
    formData.append('description', newProduct.description)
    formData.append('publish', newProduct.publish)

    const images = newProduct.images.map((item, index) => { return item.file })
    images.forEach((img, index) => { formData.append(`image${index + 1}`, img) });

    // Category Id and formData
    const categoryId = newProduct.category.map((item) => item._id)
    categoryId.forEach(cat => { formData.append('category', cat) });

    // Sub Category Id and formData
    const SubCategoryId = newProduct.subCategory.map((item) => item._id)
    SubCategoryId.forEach(subCat => { formData.append('subCategory', subCat) });

    return formData;
  }

  // Form Handler 
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

  const handleEditProduct = (product) => {
    const images = Array(4).fill(null).map((_, index) => ({
      file: null,
      preview: product.images?.[index] || null
    }));
    setIsEditMode(true);
    setNewProduct({
      id: product._id,
      name: product.name,
      images: images,
      category: product.category || [],
      subCategory: product.subCategory || [],
      unit: product.unit || '',
      unit_quantity: product.unit_quantity || '',
      stock: product.stock || '',
      price: product.price || '',
      discount: product.discount || '',
      description: product.description || "",
      publish: product.publish !== false
    });
    setIsModalOpen(true);
  };

  const handleRemoveCategory = (id) => {
    const category = newProduct.category.filter((item) => item._id !== id)
    setNewProduct({ ...newProduct, category: category })
  };

  const handleRemoveSubCategory = (id) => {
    const subCategory = newProduct.subCategory.filter((item) => item._id !== id)
    setNewProduct({ ...newProduct, subCategory: subCategory })
  };

  // Validate Product Before adding
  const validateProduct = () => {
    let isValid = true;

    if (!newProduct.name.trim() || newProduct.name.length < 3) {
      return toast.error("Enter Valid Product Name"),
        isValid = false;

    }

    if (!newProduct.images.some(img => img.file !== null)) {
      return toast.error('Select At least one image'),
        isValid = false;
    }

    if (newProduct.category.length === 0) {
      return toast.error('Select at least one category'),
        isValid = false;
    }

    if (!newProduct.unit) {
      return toast.error('Select Product Unit'),
        isValid = false;
    }

    if (!newProduct.unit_quantity) {
      return toast.error('Enter Product Unit Quantity'),
        isValid = false;
    }

    if (!newProduct.price || isNaN(newProduct.price)) {
      return toast.error('Enter Product Price'),
        isValid = false;
    }
    else if (Number(newProduct.price) <= 0) {
      return toast.error('Enter Valid Product Price'),
        isValid = false;
    }

    if (newProduct.discount && isNaN(newProduct.discount)) {
      return toast.error('Discount must be a number'),
        isValid = false;
    }
    else if (newProduct.discount && Number(newProduct.discount) < 0) {
      return toast.error('Enter Valid Product Discount'),
        isValid = false;
    }

    return isValid;
  };

  // Product Handler
  const handleAddProduct = async (e) => {

    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData
    formData.append('name', newProduct.name)
    formData.append('unit', newProduct.unit)
    formData.append('unit_quantity', newProduct.unit_quantity)
    formData.append('stock', newProduct.stock)
    formData.append('price', newProduct.price)
    formData.append('discount', newProduct.discount)
    formData.append('description', newProduct.description)
    formData.append('publish', newProduct.publish)

    const images = newProduct.images.map((item, index) => { return item.file })
    images.forEach((img, index) => { formData.append(`image${index + 1}`, img) });

    // Category Id and formData
    const categoryId = newProduct.category.map((item) => item._id)
    categoryId.forEach(cat => { formData.append('category', cat) });

    // Sub Category Id and formData
    const SubCategoryId = newProduct.subCategory.map((item) => item._id)
    SubCategoryId.forEach(subCat => { formData.append('subCategory', subCat) });

    const validate = validateProduct();

    try {

      if (validate) {
        const response = await Axios({
          ...summarApi.product.addProduct, data: formData
        })
        console.log(response)

        if (response.data.success) {
          toast.success(response.data.message)
          resetForm()
          setIsModalOpen(false)
        }
      }


    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

    setIsLoading(false)

  };

  const fetchProductData = async () => {
    setIsPageLoading(true)
    try {
      const response = await Axios({
        url: summarApi.product.getPorduct.url + `?page=${currentPage}&limit=${limit}`,
        method: summarApi.product.getPorduct.method, data: { search: urlSearchQuery ? urlSearchQuery : searchQuery }
      })

      if (response.data.success) {
        setProductData(response.data.data.productData)
        setTotalPages(response.data.data.totalPages)
        setTotalProductCount(response.data.data.totalProductCount)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    setIsPageLoading(false)
  }

  const updateProduct = async () => {
    setIsLoading(true)
    const formData = getFormData()
    try {
      const response = await Axios({
        ...summarApi.product.updateProduct, data: formData
      })
      if (response.data.succes) {
        fetchProductData()
      }
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleNextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviusPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const getCuurentPage = () => {
    if (pageNumber && pageNumber !== 0) {
      setCurrentPage(pageNumber)
    }
    else {
      navigate('?page=1')
    }
  }

  const getSearchQuery = () => {
    if (urlSearchQuery && urlSearchQuery.trim() !== '') {
      setSearchQuery(urlSearchQuery)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      navigate(`?page=${currentPage}`)
    } else {
      window.location.href = `?page=${currentPage}&query=${searchQuery}`
    }
    fetchProductData()
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    window.location.href = `?page=${currentPage}`
    fetchProductData()
  }

  useEffect(() => {
    fetchProductData()
  }, [currentPage])

  useEffect(() => {
    getCuurentPage()
    getSearchQuery()
  }, [searchParams])

  // All Form Handler 
  const handleDragOver = (e) => {
    e.preventDefault();
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
          title="Add New Product"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          style={{ background: primaryColor }}
          className="cursor-pointer flex items-center px-4 py-2 rounded-lg text-white text-xs md:text-sm font-medium"
        >
          <FaPlus className="mr-2" />
          Add Product
        </motion.button>
      </div>
      <button onClick={() => CustomToast.error('Your action was completed successfully!')}>Show Toast</button>


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

                {newProduct.unit &&
                  <div>
                    <label htmlFor="unit_quantity" className="block text-gray-700 mb-2">Quantity in {newProduct.unit}</label>
                    <input
                      id="unit_quantity"
                      type="number"
                      value={newProduct.unit_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, unit_quantity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Quantity in ${newProduct.unit}`}
                      required
                      disabled={isLoading}
                    />
                  </div>}

                {/* Stock, Price, Discount */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="stock" className="block text-gray-700 mb-2">Stock</label>
                    <input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Quantity"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-gray-700 mb-2">Price</label>
                    <input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="₹0.00"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="discount" className="block text-gray-700 mb-2">Discount</label>
                    <input
                      id="discount"
                      type="number"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0%"
                      max="100"
                      required
                      disabled={isLoading}
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
                    onClick={isEditMode ? updateProduct : handleAddProduct}
                    disabled={isLoading}
                    className="cursor-pointer px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-700 hover:bg-purple-700 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <ButtonLoading />
                        Please Wait...
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

      {/* producr header  */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items">

        <div className="flex items-center gap-2">

          <h1 className="text-base md:text-2xl font-bold text-gray-800 flex items-center">
            <BiSolidCategory className="mr-2" style={{ color: '#6945c5' }} />
            Total Products <IoMdArrowDropright className="text-purple-600" /> {totalProductCount}
          </h1>

          {searchQuery && urlSearchQuery &&
            <>
              <IoMdArrowDropright className="text-purple-600 text-2xl" />
              <button
                title="Clear Search"
                onClick={() => handleClearSearch()}
                className="cursor-pointer flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-4 rounded shadow duration-100 active:scale-95"
              >
                Clear Search
                <GiBroom />
              </button>
            </>
          }

        </div>

        <div className="relative flex">
          <input
            type="text"
            title="Search For Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Products"
            className="w-full py-2.5 px-5 pr-12 rounded-lg border border-black shadow-sm transition-all duration-200 hover:shadow-md"
          />
          <button
            title="Search"
            type="submit"
            onClick={() => handleSearch()}
            className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 h-full px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-r-lg   transition-colors duration-200 flex items-center justify-center"
          >
            <FiSearch className="w-5 h-5" />
          </button>

        </div>

      </div>

      {isPageLoading ?
        <PreCategory />
        :
        (searchQuery && !productData[0] ?
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <MdSearchOff className="text-purple-500 text-7xl mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-black max-w-md">
              We couldn't find any products that match your search. Try adjusting your filters or search terms.
            </p>
            <button
              title="Clear Search"
              onClick={() => handleClearSearch()}
              className="cursor-pointer flex items-center mt-4 gap-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-4 rounded shadow duration-100 active:scale-95"
            >
              Clear Search
              <GiBroom />
            </button>

          </div>
          :
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
            {productData.map((pro) => (
              <motion.div
                key={pro._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white border border-gray-400 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image container with fixed height */}
                <div className="relative h-48 w-full overflow-hidden border-b border-gray-400 bg-gradient-to-b from-white to-purple-100 flex items-center justify-center">
                  <img
                    src={pro.images[0]}
                    alt={pro.name}
                    className="max-h-full max-w-full object-contain duration-200 hover:scale-105"
                  />
                </div>

                {/* Content container with consistent padding and flex-grow */}
                <div className="px-2 md:px-2.5 py-3 flex flex-col gap-2 flex-grow">
                  <h3 className="ml-1 md:ml-1.5 text-[13px] md:text-base font-semibold text-gray-800 line-clamp-2">
                    {pro.name}
                  </h3>

                  <div className='flex flex-col gap-0'>
                    <p className="ml-1 md:ml-1.5 text-xs md:text-base font-semibold text-gray-700">
                      {pro.unit_quantity} {pro.unit}
                    </p>
                    <p className="ml-1 md:ml-1.5 text-xs md:text-base font-semibold text-gray-700">
                      Stock-{pro.stock}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEditProduct(pro)}
                    className='cursor-pointer text-[13px] w-full md:px-6 py-2 rounded-sm text-purple-800 font-medium flex items-center justify-center bg-purple-100 border border-purple-950 hover:bg-purple-200 mt-auto'
                    title="Edit Product"
                  >
                    <FaEdit size={16} className='mr-1.5' />
                    Edit Product
                  </button>
                </div>

                <button
                  title='Remove Category'
                  className="cursor-pointer absolute top-0 text-[13px] md:text-sm right-0 px-3 md:px-6 py-2 rounded-b-xs text-white font-medium flex items-center bg-red-500 hover:bg-red-600"
                >
                  <FaTrash className='mr-1.5' />
                </button>
              </motion.div>
            ))}
          </div>
        )
      }

      {/* current page and next page */}
      {productData[0] &&
        <div className="flex items-center p-4 pb-0 text-purple-700 justify-center gap-4 sm:gap-6 ">
          {currentPage === 1 ?
            <div
              className='cursor-no-drop flex gap-1 items-center px-2 py-1 text-gray-700 duration-300 rounded-lg border border-white' >
              <IoIosArrowBack />
              Previous
            </div>
            :
            <Link
              onClick={() => handlePreviusPage()}
              to={`?page=${currentPage - 1}`}
              title='Previous Page'
              className='flex gap-1 items-center px-2 py-1 duration-300 rounded-lg border border-white hover:border-purple-600 hover:bg-purple-100'>

              <IoIosArrowBack />
              Previous
            </Link>
          }

          <span> {currentPage} / {totalPages} </span>

          {currentPage === totalPages ?
            <div
              className='cursor-no-drop flex gap-1 items-center px-2 py-1 text-gray-700 duration-300 rounded-lg border border-white' >
              Next
              <IoIosArrowForward />
            </div>
            :
            <Link
              onClick={() => handleNextPage()}
              to={`?page=${currentPage + 1}`}
              title='Next Page'
              className='flex gap-1 items-center px-2 py-1 duration-300 rounded-lg border border-white hover:border-purple-600 hover:bg-purple-100'>
              Next
              <IoIosArrowForward />
            </Link>
          }

        </div>}
    </div>
  );
};

export default UploadProducts;