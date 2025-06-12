import React from 'react'
import { FiPackage, FiSearch } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const NoProductFound = ({ query }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-[75vh] py-12 px-4 text-center">
            <div className="mb-6 p-4 bg-gray-100 rounded-full">
                <FiPackage className="text-gray-400 text-4xl" />
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-2">
                No products found
            </h3>

            {query && (
                <p className="text-gray-500 mb-6">
                    Your search for "<span className="font-medium">{query}</span>" did not match any products.
                </p>
            )}

            {!query && (
                <p className="text-gray-500 mb-6">
                    There are currently no products available in this category.
                </p>
            )}


            <button onClick={() => navigate('/search')} className="cursor-pointer flex items-center justify-center gap-2 px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <FiSearch />
                Browse all products
            </button>


        </div>
    )
}

export default NoProductFound
