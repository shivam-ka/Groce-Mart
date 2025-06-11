import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PreProduct from '../components/PreLoader/PreProduct';

const SearchPage = () => {

    const params = useLocation();
    const query = params.search.split('=').slice(-1).toLocaleString()

    const [isLoading, setIsLoading] = useState(false)
    const [searchQueary, setSearchQueary] = useState('')
    console.log(searchQueary)

    useEffect(() => {
        setSearchQueary(query)
    }, [])




    return (
        <div className='min-h-screen p-2 lg:px-20'>

            {query && <div className='py-4 text-base'>
                <h1>Showing Result for "<b>{searchQueary}</b>".</h1>
            </div>}

            {isLoading ?
                <div className='py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4'>
                    <PreProduct Length={10} />
                </div>

                :
                <div>

                </div>
            }

        </div>
    )
}

export default SearchPage
