import React from 'react'
import { FiChevronRight } from 'react-icons/fi'

const PreHeading = () => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="h-7 w-40 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex items-center">
                <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse mr-1"></div>
                <FiChevronRight className="text-xl text-gray-300" />
            </div>
        </div>
    )
}

export default PreHeading
