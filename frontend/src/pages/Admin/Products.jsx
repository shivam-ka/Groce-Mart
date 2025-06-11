import toast from "react-hot-toast"
import Axios from '../../Utils/Axios'
import summarApi from '../../common/SummaryApi'
import { useState, useEffect, useRef } from 'react'
import { PreCategory } from '../../components'
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ErrorPage from "../ErrorPage"

// Icons
import { FiSearch } from 'react-icons/fi'
import { BiSolidCategory } from 'react-icons/bi'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropright } from "react-icons/io";
import { GiBroom } from "react-icons/gi";
import { MdSearchOff } from "react-icons/md"
import { useSelector } from "react-redux"

const Products = () => {

  const [productData, setProductData] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const pageNumber = Number(searchParams.get('page') || 1)
  const urlSearchQuery = searchParams.get('query')

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
    unit_quantity: '',
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

  if (pageNumber && totalPages && pageNumber > totalPages) {
    return <div>
      <ErrorPage navigateTo="?page=1" />
    </div>
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

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
                    className='cursor-pointer text-[13px] w-full md:px-6 py-2 rounded-sm text-purple-800 font-medium flex items-center justify-center bg-purple-100 border border-purple-950 hover:bg-purple-200 mt-auto'
                    title="Edit category"
                  >
                    <FaEdit size={16} className='mr-1.5' />
                    Edit Category
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
  )
}

export default Products
