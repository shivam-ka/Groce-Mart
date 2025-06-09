
import { FiShoppingCart } from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa";

const PreProduct = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                    {/* Product Image Skeleton */}
                    <div className="relative h-40 w-full border-b border-gray-200 bg-gray-100 animate-pulse"></div>

                    {/* Product Info Skeleton */}
                    <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-3 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>

                        <div className="w-fit py-0.5 px-2 rounded-2xl flex items-center text-xs text-gray-300 border mb-2">
                            <FaMotorcycle className="mr-1" size={12} />
                            <span>Get in -- min</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="bg-gray-200 text-gray-500 text-[13px] px-3 py-1.5 rounded-lg flex items-center animate-pulse">
                                <FiShoppingCart className="mr-1" size={12} />
                                Add
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PreProduct
