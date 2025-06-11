import { motion } from "framer-motion";

const PreProductDisplay = () => {
    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1 py-2 md:p-8">
                        {/* Image Slider Preloader */}
                        <div className="relative max-w-md mx-auto w-full">
                            <div className="overflow-hidden rounded-2xl bg-purple-50 relative h-80 md:h-96">
                                <div className="flex h-full items-center justify-center">
                                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Thumbnails Preloader */}
                            <div className="mt-6">
                                <div className="flex justify-center space-x-2">
                                    {[...Array(4)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"
                                        />
                                    ))}
                                </div>

                                <div className="flex mt-4 space-x-3">
                                    {[...Array(4)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Details Preloader */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex text-gray-200">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                    ))}
                                </div>
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Delivery Badge Preloader */}
                            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-4 bg-gray-200 rounded animate-pulse"
                                        style={{ width: `${100 - i * 15}%` }}
                                    ></div>
                                ))}
                            </div>

                            <div className="border-t border-b border-purple-100 py-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            <div className="h-12 w-full bg-gray-200 rounded-full animate-pulse"></div>

                            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                                <ul className="space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="w-2 h-2 bg-gray-200 rounded-full mr-2 mt-1.5"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${80 - i * 5}%` }}></div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PreProductDisplay
