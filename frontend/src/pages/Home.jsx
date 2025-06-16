import { useSelector } from 'react-redux'
import { PreHeading, PreHomeCategory, PreProduct, ProductByCategory } from '../components'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet"

const Home = () => {

  const isCategoryLoading = useSelector(state => state.product.isCategoryLoading)
  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const ProductListPageUrl = (category) => {

    const categoryName = (category.name).replaceAll(' ', '+').replaceAll(',', '')

    const subCategory = allSubCategory.find(sub => {
      const filterData = sub.category.some(c => {
        return c == category._id
      })

      return filterData ? true : null
    })

    const subCategoryId = subCategory !== undefined ? subCategory._id : ''

    const url = `${categoryName}-${category._id}/${subCategoryId}`
    return url
  }



  return (
    <>
      <Helmet>
        <title>GroceMart: Groceries in Minutes - A bold promise that can attract time-crunched customers.</title>
        <meta name="description" content='Buy fresh groceries online at competitive prices. Fast delivery, quality produce, and weekly specials.' />
      </Helmet>
      <div className='p-2 lg:px-20 md:py-10'>

        <div className='w-full mb-2 sm:mb-8 '>
          <img className='hidden sm:block w-full  overflow-hidden rounded-lg' src='https://res.cloudinary.com/shivamka/image/upload/v1750051526/5423986_wae2ly.jpg' alt="" />
          <img className='block sm:hidden w-full rounded-lg' src='https://res.cloudinary.com/shivamka/image/upload/v1750051569/56027859164_ko3ibe.png' alt="" />
        </div>
        {isCategoryLoading ?
          <PreHomeCategory />
          :
          <div className="grid grid-cols-4 gap-1.5 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 sm:gap-2 md:gap-3">
            {allCategory.map((item) => (
              <Link
                onClick={window.scrollTo({ top: 0 })}
                key={item._id}
                to={ProductListPageUrl(item)}
                className="flex flex-col h-full" // Added h-full to Link
              >
                <motion.div
                  className="flex flex-col rounded-lg bg-white shadow-xs hover:shadow-sm transition-all cursor-pointer h-full" // Added h-full
                >
                  {/* Image Container - Fixed Square Aspect Ratio */}
                  <div className="aspect-square w-full flex items-center justify-center rounded-b-full bg-gradient-to-b from-purple-100 to-white overflow-hidden">
                    <motion.img
                      className="object-contain w-full h-full max-w-[90%] max-h-[100%] mix-blend-multiply rounded-lg transition-all hover:shadow-lg hover:brightness-105"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'placeholder-image.svg';
                        e.target.classList.remove('mix-blend-multiply');
                      }}
                      whileHover={{
                        scale: 1.09,
                        transition: { duration: 0.1 }
                      }}
                    />
                  </div>

                  {/* Text Container */}
                  <div className="px-1 py-1 min-h-[40px] flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-black font-medium text-center line-clamp-2 leading-tight">
                      {item.name}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

        }

        {/* product by category  */}
        {allCategory[0] ?
          allCategory.map((cat, index) => (
            <ProductByCategory key={cat._id} categoryId={cat?._id} categoryName={cat?.name} navigateTo={ProductListPageUrl(cat)} />
          ))
          :
          Array(4).fill(null).map((_, index) => (
            <div key={index} className="mx-auto px-2 py-6">
              <PreHeading />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 md:gap-4">
                <PreProduct Length={6} />
              </div>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default Home
