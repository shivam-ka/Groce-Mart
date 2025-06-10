import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../Utils/Axios';
import summarApi from '../common/SummaryApi';
import ProductContainer from '../components/ProductContainer';
import { useSelector } from "react-redux";
import { FaArrowTrendUp } from "react-icons/fa6";
import { PreProduct } from '../components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Helmet } from "react-helmet"

const ProductListPage = () => {

  const params = useParams();
  const [isLoading, setIsLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [product, setProduct] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])

  const categoryName = params.category.split('-')[0].replaceAll('+', ' ')
  const categoryId = params.category.split('-')[1]
  const subCategoryId = params.subCategory

  const allSubCategory = useSelector(state => state.product.allSubCategory)


  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await Axios({
        url: `${summarApi.product.getPorductByCatAndSubCat.url}?page=${currentPage}&limit=${limit}`,
        method: summarApi.product.getPorductByCatAndSubCat.method,
        data: ({ categoryId, subCategoryId })
      })
      if (response.data.success) {
        setTotalPage(response.data.data.totalPages)
        setProduct(response.data.data.product)
      }

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const getSubCategoryUrl = (subCate) => {
    const catName = categoryName.replaceAll(' ', '+')
    const url = `/${catName}-${categoryId}/${subCate._id}`
    return url
  }

  const handleNextPage = () => {
    if (currentPage !== totalPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviusPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [params, currentPage])

  useEffect(() => {
    const sub = allSubCategory.filter(sub => {
      const filterData = sub.category.some(el => {
        return el === categoryId
      })
      return filterData ? filterData : false
    })
    setSubCategoryData(sub)
  }, [params, allSubCategory])



  return (
    <>
      <Helmet>
        <title>{`${categoryName} - GroceMart: Groceries in Minutes - A bold promise that can attract time-crunched customers.`}</title>
      </Helmet>

      <div className="grid grid-cols-[1fr_5fr] flex-row bg-gray-50 min-h-screen">

        <div className="px-2 py-4 md:p-4 bg-white border-r border-purple-400">
          <h2 className="flex items-center gap-2 font-bold text-base sm:text-lg mb-4">More Products <FaArrowTrendUp className='hidden md:block' /> </h2>

          <div className=" bg-white rounded-lg space-y-2 ">
            {subCategoryData.map((subCat) => (
              <Link
                to={getSubCategoryUrl(subCat)}
                key={subCat._id}
                className={`flex flex-col md:flex-row items-center gap-4 p-1 md:p-3 hover:bg-purple-50 rounded-lg transition-colors duration-200 border-purple-600 ${subCategoryId === subCat._id ? 'border bg-purple-100' : ''}`}
                onClick={() => getSubCategoryUrl(subCat)}
              >
                {/* Larger square image (uncropped) */}
                <div className='relative'>
                  <div className='w-16 h-16 bg-purple-100 rounded-full overflow-hidden flex-shrink-0'>
                    <img
                      src={subCat.image || "/placeholder-image.svg"}
                      alt={subCat.name}
                      className="absolute bottom-1 w-full object-contain" // Changed to object-contain to prevent cropping
                    />
                  </div>
                </div>


                {/* Text with no truncation (multi-line support) */}
                <p className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
                  {subCat.name}
                </p>
              </Link>
            ))}
          </div>

        </div>


        <div className='relative flex flex-col p-4 sm:p-6'>
          <h2 className="text-lg sm:text-xl font-semibold text-purple-700 mb-4">{categoryName}</h2>
          <div className="pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">

            {isLoading ?
              <PreProduct Length={8} />
              :
              product.map((product) => (
                <ProductContainer key={product._id} product={product} />
              ))
            }

          </div>

          {
            product[0] &&
            <div className="absolute bottom-2 self-center  flex items-center p-4 pb-0 text-purple-700 justify-center gap-4 sm:gap-6 ">
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

              <span> {currentPage} / {totalPage} </span>

              {currentPage === totalPage ?
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
          }
        </div>

      </div>

    </>

  )
}

export default ProductListPage
