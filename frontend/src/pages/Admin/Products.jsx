import toast from "react-hot-toast"
import Axios from '../../Utils/Axios'
import summarApi from '../../common/SummaryApi'
import { useState, useEffect } from 'react'
import { PreCategory } from '../../components'
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ErrorPage from "../ErrorPage"

// Icons
import { BiSolidCategory } from 'react-icons/bi'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropright } from "react-icons/io";

const Products = () => {

  const [productData, setProductData] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchProductData = async () => {
    setIsPageLoading(true)
    try {
      const response = await Axios({
        url: summarApi.product.getPorduct.url + `?page=${currentPage}&limit=${limit}`,
        method: summarApi.product.getPorduct.method
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

  useEffect(() => {
    fetchProductData()
  }, [currentPage])

  useEffect(() => {
    getCuurentPage()
  }, [searchParams])

  const pageNumber = Number(searchParams.get('page') || 1)

  const getCuurentPage = () => {
    if (pageNumber && pageNumber !== 0) {
      setCurrentPage(pageNumber)
    }
    else {
      navigate('?page=1')
    }
  }

  if (pageNumber > totalPages) {
    return <div>
      <ErrorPage navigateTo="?page=1" />
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-auto">
        <h1 className=" text-base mb-8 md:text-2xl font-bold text-gray-800 flex items-center">
          <BiSolidCategory className="mr-2" style={{ color: '#6945c5' }} />
          Total Products <IoMdArrowDropright className="text-purple-600" /> {totalProductCount}
        </h1>
      </div>

      {isPageLoading ?
        <PreCategory />
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
      }

      {/* current page and next page */}
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

      </div>

    </div>
  )
}

export default Products
