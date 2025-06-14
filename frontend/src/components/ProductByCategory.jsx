import React, { useEffect, useState } from 'react'
import CustomToast from './Toast/CustomToast'
import Axios from '../Utils/Axios'
import summarApi from '../common/SummaryApi'
import { motion } from "framer-motion";

import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { FaFire, FaMotorcycle, } from "react-icons/fa";
import PreProduct from './PreLoader/PreProduct';
import PreHeading from './PreLoader/PreHeading';
import { Link } from 'react-router-dom';
import ProductContainer from './ProductContainer';

const ProductByCategory = ({ categoryId, categoryName, navigateTo }) => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchProductByCategory = async () => {
        setIsLoading(true)
        try {
            const response = await Axios({
                url: `${summarApi.product.getPorductByCategory.url}/${categoryId}`,
                method: summarApi.product.getPorductByCategory.method
            })

            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            console.log(error)
            CustomToast.error(error.response.data.message)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        fetchProductByCategory()
    }, [])

    const fetchUrl = (product) => {
        const url = `/product/${product.name}-${product._id}`.replaceAll(" ", "-")
        return url.replaceAll(",", "")
    }


    return (
        <div className="mx-auto md:px-2 py-6">
            {/* category heading  */}
            {data[0] &&
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-base sm:text-xl font-semibold text-black">
                        {categoryName}
                    </h1>
                    <Link
                        onClick={() => window.scrollTo(0, 0)}
                        to={navigateTo}>
                        <span className="flex items-center text-sm sm:text-lg text-red-600 cursor-pointer">
                            See All
                            <FiChevronRight className='text-xl' />
                        </span>
                    </Link>

                </div>}

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 md:gap-4">
                {data.map((product) => (
                    <ProductContainer key={product._id} product={product} />
                ))}
            </div>

        </div>

    )
}

export default ProductByCategory
