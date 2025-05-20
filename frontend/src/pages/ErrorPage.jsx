import React from 'react'
import { useNavigate } from "react-router-dom"


const ErrorPage = () => {

    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg text-center " >

                <div className="animate-bounce text-6xl font-bold text-gray-400 mb-4">
                    404
                </div>

                <h1 className="text-2xl font-semibold text-black mb-2 animate-fade-in">
                    Page Not Found
                </h1>

                <p className="text-gray-600 mb-6 animate-fade-in-up">
                    Oops! The page you're looking for doesn't exist.
                </p>

                <div
                    className="cursor-pointer px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md transition-all duration-300 hover:scale-105 active:scale-100 shadow-md"
                    onClick={() => navigate('/')}
                >
                    Go Back Home
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
