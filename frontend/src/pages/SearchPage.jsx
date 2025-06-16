import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PreProduct from '../components/PreLoader/PreProduct';
import Axios from "../Utils/Axios"
import summarApi from '../common/SummaryApi';
import { ProductContainer } from '../components/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoProductFound } from './index';

import { IoMdArrowDropright } from "react-icons/io";



const SearchPage = () => {

    const params = useLocation();
    const query = params.search.split('=').slice(-1).toLocaleString().replaceAll('+', ' ')
    console.log(query)

    const [isLoading, setIsLoading] = useState(false)
    const [searchQueary, setSearchQueary] = useState('')
    const [limit, setLimit] = useState(12)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [products, setProducts] = useState([])
    const [totalProductCount, setTotalProductCount] = useState(0)


    const searchProduct = async () => {
        setIsLoading(true)
        try {

            const response = await Axios({
                url: `${summarApi.product.searchProduct.url}?search=${query}&page=${currentPage}&limit=${limit}`,
                method: summarApi.product.searchProduct.method
            })

            if (response.data.success) {
                if (response.data.data.page == 1) {
                    setProducts([...response.data.data.product])
                } else {
                    setProducts([products, ...response.data.data.product])
                }
                setTotalPages(response.data.data.totalPages)
                setTotalProductCount(response.data.data.totalProductCount)
            }


        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    const handleFetchMore = async () => {
        if (totalPages > currentPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        setSearchQueary(query)
    }, [query])

    useEffect(() => {
        searchProduct()
    }, [query])




    return (
        <div className='min-h-screen p-2 lg:px-20'>
            {query != '' && !products[0] &&
                <NoProductFound query={query} />
            }

            {query && products[0] && <div className='flex items-center gap-0 md:gap-1 py-2 sm:py-4 text-xs md:text-base'>

                <Link to='/' > Home </Link>

                <IoMdArrowDropright className='text-purple-600' />

                <span > Search </span>

                <IoMdArrowDropright className='text-purple-600' />

                <h1>Showing Result for "<b>{searchQueary}</b>".</h1>
            </div>}

            <InfiniteScroll
                dataLength={products.length}
                hasMore={true}
                next={handleFetchMore}
            >


                <div className='py-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 md:gap-4'>
                    {isLoading ?
                        <PreProduct Length={10} />

                        :
                        products[0] && products?.map(pro => (
                            <ProductContainer key={pro?._id} product={pro} />
                        ))
                    }
                </div>

            </InfiniteScroll>

        </div>
    )
}

export default SearchPage
