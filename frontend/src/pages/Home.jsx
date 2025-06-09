import { useSelector } from 'react-redux'
import { PreHomeCategory } from '../components'
import { motion } from "framer-motion";
import { asstes } from '../assets/assets';
import { Link } from 'react-router-dom';

const Home = () => {

  const isCategoryLoading = useSelector(state => state.product.isCategoryLoading)
  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const ProductListPageUrl = (category) => {

    const categoryName = (category.name).replaceAll(' ', '-').replaceAll(',', '')

    const subCategory = allSubCategory.filter(item =>
      item.category.some(cat => cat === category._id)
    );

    const subCategory_id = subCategory.map(item => item._id)
    const url = `${categoryName}/${subCategory_id.map(item => item)}`

    return url.replaceAll(',', '-')
  }



  return (
    <div className='p-2 lg:px-20 md:py-10'>
      <div className='w-full mb-2 sm:mb-8 '>
        <img className='hidden sm:block w-full rounded-lg' src={asstes.poster.one} alt="" />
        <img className='block sm:hidden w-full rounded-lg' src={asstes.poster.two} alt="" />
      </div>
      {isCategoryLoading ?
        <PreHomeCategory />
        :
        <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2 sm:gap-3">
          {allCategory.map((item) => (
            <Link
              key={item._id}
              to={ProductListPageUrl(item)}
            // onClick={() => ProductListPageUrl(item)}
            >
              <motion.div
                className="flex flex-col rounded-lg bg-white border border-gray-500 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                {/* Image Container - Fixed Square Aspect Ratio */}
                <div className="aspect-square w-full flex items-center justify-center rounded-lg bg-gradient-to-b from-purple-100 to-white ">
                  <img
                    className="object-contain w-[90%] h-[90%] mix-blend-multiply rounded-lg duration-200 hover:scale-105"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'placeholder-image.svg';
                      e.target.classList.remove('mix-blend-multiply');
                    }}
                  />
                </div>

                {/* Text Container */}
                <div className="px-1 py-1.5 border-t border-purple-500 min-h-[40px] flex items-center justify-center">
                  <p className="text-xs sm:text-sm text-black font-medium text-center line-clamp-2 leading-tight">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            </Link>

          ))}
        </div>
      }

    </div>
  )
}

export default Home
